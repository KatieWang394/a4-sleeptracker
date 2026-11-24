import { Injectable } from '@angular/core';

import { OvernightSleepData } from '../data/overnight-sleep-data';
import { SleepData } from '../data/sleep-data';
import { StanfordSleepinessData } from '../data/stanford-sleepiness-data';
import { StorageService } from './storage.service';

type SleepRecord = OvernightSleepData | StanfordSleepinessData;
type StoredRecord = { id: string; loggedAt: string } & (
  | { kind: 'overnight'; sleepStart: string; sleepEnd: string }
  | { kind: 'sleepiness'; score: number }
);

@Injectable({ providedIn: 'root' })
export class SleepService {
  static AllSleepData: SleepData[] = [];
  static AllOvernightData: OvernightSleepData[] = [];
  static AllSleepinessData: StanfordSleepinessData[] = [];

  private readonly storageKey = 'sleep-records';
  private saveQueue: Promise<void>;

  constructor(private storage: StorageService) {
    this.saveQueue = this.readRecords()
      .then(records => this.restoreRecords(records))
      .catch(error => console.error('Could not load sleep records.', error));
  }

  logOvernightData(record: OvernightSleepData): Promise<void> {
    return this.saveRecord(record);
  }

  logSleepinessData(record: StanfordSleepinessData): Promise<void> {
    return this.saveRecord(record);
  }

  deleteRecord(id: string): Promise<void> {
    return this.updateRecords(records => records.filter(record => record.id !== id));
  }

  private async readRecords(): Promise<StoredRecord[]> {
    return (await this.storage.get(this.storageKey)) ?? [];
  }

  private saveRecord(record: SleepRecord): Promise<void> {
    return this.updateRecords(records => [...records, this.toStoredRecord(record)]);
  }

  private updateRecords(change: (records: StoredRecord[]) => StoredRecord[]): Promise<void> {
    const write = this.saveQueue.then(async () => {
      const update = async () => {
        const updated = change(await this.readRecords());
        await this.storage.set(this.storageKey, updated);
        this.restoreRecords(updated);
      };

      // Keep the read and write under the same lock across browser tabs.
      if (navigator.locks) {
        await navigator.locks.request('sleep-notes-records', update);
      } else {
        await update();
      }
    });

    this.saveQueue = write.catch(() => undefined);
    return write;
  }

  private restoreRecords(saved: StoredRecord[]): void {
    SleepService.AllSleepData.length = 0;
    SleepService.AllOvernightData.length = 0;
    SleepService.AllSleepinessData.length = 0;

    for (const item of saved) {
      const loggedAt = new Date(item.loggedAt);
      const record = item.kind === 'overnight'
        ? new OvernightSleepData(new Date(item.sleepStart), new Date(item.sleepEnd))
        : new StanfordSleepinessData(item.score, loggedAt);

      record.id = item.id;
      record.loggedAt = loggedAt;
      SleepService.AllSleepData.push(record);

      if (record instanceof OvernightSleepData) {
        SleepService.AllOvernightData.push(record);
      } else {
        SleepService.AllSleepinessData.push(record);
      }
    }
  }

  private toStoredRecord(record: SleepRecord): StoredRecord {
    const { id, loggedAt } = record;
    const common = { id, loggedAt: loggedAt.toISOString() };

    if (record instanceof OvernightSleepData) {
      return {
        ...common,
        kind: 'overnight',
        sleepStart: record.sleepStart.toISOString(),
        sleepEnd: record.sleepEnd.toISOString(),
      };
    }
    return { ...common, kind: 'sleepiness', score: record.score };
  }
}
