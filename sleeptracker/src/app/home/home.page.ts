import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
	IonButton, IonContent, IonHeader, IonItem,
	IonLabel, IonList, IonTitle, IonToolbar
} from '@ionic/angular/standalone';
import { OvernightSleepData } from '../data/overnight-sleep-data';
import { SleepService } from '../services/sleep.service';


@Component({
	selector: 'app-home',
	templateUrl: 'home.page.html',
	styleUrls: ['home.page.scss'],
	imports: [DatePipe, FormsModule,
		IonButton, IonContent, IonHeader, IonItem,
		IonLabel, IonList, IonTitle, IonToolbar],
})
export class HomePage {
	bedtime = '';
	wakeTime = '';
	errorMessage = '';
	constructor(public sleepService: SleepService) { }
	get overnightData(): OvernightSleepData[] {
		return SleepService.AllOvernightData;
	}
	addOvernight(): void {
		const start = new Date(this.bedtime);
		const end = new Date(this.wakeTime);
		if (!this.bedtime || !this.wakeTime || Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
			this.errorMessage = 'Please enter both times.';
			return;
		}
		if (end <= start) {
			this.errorMessage = 'Wake-up time must be after bedtime.';
			return;
		}
		if (end > new Date()) {
			this.errorMessage = 'Wake-up time cannot be in the future.';
			return;
		}
		this.sleepService.logOvernightData(new OvernightSleepData(start, end));
		this.errorMessage = '';
		this.bedtime = '';
		this.wakeTime = '';
	}

	ngOnInit() {
		console.log(this.allSleepData);
	}

	/* Ionic doesn't allow bindings to static variables, so this getter can be used instead. */
	get allSleepData() {
		return SleepService.AllSleepData;
	}
}
