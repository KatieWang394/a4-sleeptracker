import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { IonButton, IonContent } from '@ionic/angular/standalone';

import { OvernightSleepData } from '../data/overnight-sleep-data';
import { SleepService } from '../services/sleep.service';

@Component({
	selector: 'app-home',
	templateUrl: 'home.page.html',
	styleUrls: ['home.page.scss'],
	imports: [DatePipe, IonButton, IonContent],
})
export class HomePage {
	constructor(
		public sleepService: SleepService,
		private router: Router
	) { }
	// 将睡眠时长压缩为适合首页大卡片的格式
	get durationLabel(): string {
		const record = this.latestSleep;
		if (!record) return '';

		const minutes = Math.floor(
			(record.sleepEnd.getTime() - record.sleepStart.getTime()) / 60000
		);
		return `${Math.floor(minutes / 60)}h ${minutes % 60}m`;
	}

		// 按醒来时间排序，避免把“最后加入数组”误当作最近一晚
	get nightsByWakeTime(): OvernightSleepData[] {
		return [...SleepService.AllOvernightData].sort(
			(a, b) => b.sleepEnd.getTime() - a.sleepEnd.getTime()
		);
		}

	get latestSleep(): OvernightSleepData | null {
		return this.nightsByWakeTime[0] ?? null;
		}

	// 至少两条记录时，比较最近两次睡眠的时长
	get comparisonLabel(): string | null {
		const [latest, previous] = this.nightsByWakeTime;
		if (!latest || !previous) return null;

		const latestMinutes =
			(latest.sleepEnd.getTime() - latest.sleepStart.getTime()) / 60000;
		const previousMinutes =
			(previous.sleepEnd.getTime() - previous.sleepStart.getTime()) / 60000;
		const difference = Math.round(latestMinutes - previousMinutes);

		if (difference === 0) return 'Same duration';
		return `${difference > 0 ? '+' : ''}${difference} min`;
		}

		// 同一天即使误录多次，也只算一个夜晚
		get nightsLast7Days(): number {
		const today = new Date();
		const cutoff = new Date(
			today.getFullYear(), today.getMonth(), today.getDate() - 6
		);

		const dates = SleepService.AllOvernightData
			.filter(record => record.sleepEnd >= cutoff && record.sleepEnd <= today)
			.map(record => record.sleepStart.toDateString());

	return new Set(dates).size;
	}
	// 点击首页按钮，进入夜间睡眠记录页
	openSleep(): void {
		this.router.navigateByUrl('/tabs/sleep');
	}
}