import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonButton, IonContent } from '@ionic/angular/standalone';

import { OvernightSleepData } from '../data/overnight-sleep-data';
import { SleepService } from '../services/sleep.service';

@Component({
	selector: 'app-sleep',
	templateUrl: 'sleep.page.html',
	styleUrls: ['sleep.page.scss'],
	imports: [FormsModule, IonButton, IonContent],
})
export class SleepPage {
	bedtime = '';
	wakeTime = '';
	errorMessage = '';
	successMessage = '';

	constructor(public sleepService: SleepService) { }

	// 输入有效时显示预计时长；这里只预览，不保存
	get durationPreview(): string {
		if (!this.bedtime || !this.wakeTime) return '—';

		const minutes = Math.round(
			(new Date(this.wakeTime).getTime() -
				new Date(this.bedtime).getTime()) / 60000
		);

		if (!Number.isFinite(minutes) || minutes <= 0 || minutes > 1440) {
			return '—';
		}

		return `${Math.floor(minutes / 60)}h ${minutes % 60}m`;
	}

	addOvernight(): void {
		const start = new Date(this.bedtime);
		const end = new Date(this.wakeTime);
		this.errorMessage = '';
		this.successMessage = '';

		// 阻止漏填、时间颠倒、超过一天和未来时间
		if (!this.bedtime || !this.wakeTime ||
			Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
			this.errorMessage = 'Please enter both times.';
			return;
		}

		if (end <= start ||
			end.getTime() - start.getTime() > 24 * 60 * 60 * 1000) {
			this.errorMessage =
				'Wake-up must be after bedtime and within 24 hours.';
			return;
		}

		if (end > new Date()) {
			this.errorMessage = 'Wake-up time cannot be in the future.';
			return;
		}

		// 把两个时间做成一条记录，然后外层的logOvernightData(...)是吧这条记录交给服务
		this.sleepService.logOvernightData(
			new OvernightSleepData(start, end)
		);

		this.successMessage = 'Sleep log saved. View it in History.';
		this.bedtime = '';
		this.wakeTime = '';
	}
}