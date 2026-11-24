import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonButton, IonPopover } from '@ionic/angular/standalone';

import { StanfordSleepinessData } from '../data/stanford-sleepiness-data';
import { SaveUndoService } from '../services/save-undo.service';
import { SleepService } from '../services/sleep.service';

@Component({
  selector: 'app-daytime-check-in',
  imports: [FormsModule, IonButton, IonPopover],
  templateUrl: './daytime-check-in.component.html',
  styleUrls: ['./daytime-check-in.component.scss'],
})
export class DaytimeCheckInComponent {
  readonly descriptions = StanfordSleepinessData.ScaleValues;
  readonly scores = [1, 2, 3, 4, 5, 6, 7];

  selectedScore: number | null = null;
  checkInTime = '';
  errorMessage = '';
  isSaving = false;

  constructor(
    private sleepService: SleepService,
    private saveUndo: SaveUndoService
  ) {}

  selectScore(score: number): void {
    if (this.selectedScore === null) {
      const now = new Date();
      // datetime-local expects local time without a timezone suffix.
      const localTime = new Date(now.getTime() - now.getTimezoneOffset() * 60_000);
      this.checkInTime = localTime.toISOString().slice(0, 16);
    }
    this.selectedScore = score;
    this.errorMessage = '';
  }

  async saveCheckIn(): Promise<void> {
    if (this.isSaving) return;

    this.errorMessage = '';

    const score = this.selectedScore;
    if (score === null || !this.scores.includes(score)) {
      this.errorMessage = 'Please choose a sleepiness score from 1 to 7.';
      return;
    }

    const time = new Date(this.checkInTime);
    if (!this.checkInTime || Number.isNaN(time.getTime())) {
      this.errorMessage = 'Please enter the date and time you felt this way.';
      return;
    }
    if (time.getTime() > Date.now()) {
      this.errorMessage = 'The check-in time cannot be in the future.';
      return;
    }

    const record = new StanfordSleepinessData(score, time);
    this.isSaving = true;
    try {
      await this.sleepService.logSleepinessData(record);
    } catch {
      this.errorMessage = 'Could not save the check-in. Please try again.';
      return;
    } finally {
      this.isSaving = false;
    }

    this.selectedScore = null;
    this.checkInTime = '';
    this.saveUndo.show(record.id);
  }
}
