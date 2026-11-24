import { Injectable, signal } from '@angular/core';

import { SleepService } from './sleep.service';

@Injectable({ providedIn: 'root' })
export class SaveUndoService {
  private readonly feedback = signal<{ message: string; recordId?: string } | null>(null);
  private dismissTimer?: ReturnType<typeof setTimeout>;

  readonly notification = this.feedback.asReadonly();

  constructor(private sleepService: SleepService) {}

  show(recordId: string): void {
    this.present('Saved', recordId);
  }

  async undo(recordId: string): Promise<void> {
    if (this.feedback()?.recordId !== recordId) return;

    clearTimeout(this.dismissTimer);
    this.feedback.set(null);

    try {
      await this.sleepService.deleteRecord(recordId);
    } catch {
      if (!this.feedback()) {
        this.present('Could not undo. Try deleting in History.');
      }
    }
  }

  private present(message: string, recordId?: string): void {
    clearTimeout(this.dismissTimer);
    this.feedback.set({ message, recordId });
    this.dismissTimer = setTimeout(() => this.feedback.set(null), 3000);
  }
}
