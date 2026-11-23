import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { IonContent } from '@ionic/angular/standalone';
import { OvernightSleepData } from '../data/overnight-sleep-data';
import { StanfordSleepinessData } from '../data/stanford-sleepiness-data';
import { SleepService } from '../services/sleep.service';
interface HistoryItem {
  id: string;
  when: Date;
  overnight?: OvernightSleepData;
  sleepiness?: StanfordSleepinessData;
  showDateHeader?: boolean;
}
@Component({
  selector: 'app-history',
  templateUrl: 'history.page.html',
  styleUrls: ['history.page.scss'],
  imports: [DatePipe, IonContent],
})
export class HistoryPage {
  constructor(public sleepService: SleepService) {}

  // 将两类记录合并，并按发生时间从新到旧排列
  get historyItems(): HistoryItem[] {
    const nights: HistoryItem[] = SleepService.AllOvernightData.map(
      record => ({
        id: record.id,
        when: record.sleepEnd,
        overnight: record,
      })
    );

    const checkIns: HistoryItem[] = SleepService.AllSleepinessData.map(
      record => ({
        id: record.id,
        when: record.loggedAt,
        sleepiness: record,
      })
    );
    
    
    const sorted = [...nights, ...checkIns].sort(
        (a, b) => b.when.getTime() - a.when.getTime()
    );

    // 每个日期的第一条记录前显示日期标题
    return sorted.map((item, index) => ({
        ...item,
        showDateHeader:
            index === 0 ||
            item.when.toDateString() !== sorted[index - 1].when.toDateString(),
        }));
  }
  // 历史卡片显示简短时长
  durationLabel(record: OvernightSleepData): string {
    const minutes = Math.floor(
      (record.sleepEnd.getTime() - record.sleepStart.getTime()) / 60000
    );
    return `${Math.floor(minutes / 60)}h ${minutes % 60}m`;
  }
}