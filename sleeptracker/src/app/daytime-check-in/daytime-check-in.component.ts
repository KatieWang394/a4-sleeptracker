import { Component } from '@angular/core'; 
import { FormsModule } from '@angular/forms'; //表单要用ngModel，让用户选的value传回来
import { IonButton } from '@ionic/angular/standalone';

import { StanfordSleepinessData } from '../data/stanford-sleepiness-data'; // starter code写好了1-7分的描述
import { SleepService } from '../services/sleep.service'; // 负责接受睡眠记录的服务，我们要把新纪录给他，history从这一个服务读取记录

@Component({
  selector: 'app-daytime-check-in', 
  standalone: true, //开启后可以被Today直接导入
  imports: [FormsModule, IonButton], //这个component的html要用的东西
  templateUrl: './daytime-check-in.component.html',
  styleUrls: ['./daytime-check-in.component.scss'],
})

export class DaytimeCheckInComponent {

  readonly descriptions = StanfordSleepinessData.ScaleValues;
  readonly scores = [1, 2, 3, 4, 5, 6, 7]; // 因为有七个状态，所以html会根据它生成七个下拉选项

  selectedScore: number | null = null; // null means 用户还没选
  checkInTime = '';
  errorMessage = '';
  successMessage = '';


  constructor(private sleepService: SleepService) { }

  saveCheckIn(): void{

    // clear the old message
    this.errorMessage = '';
    this.successMessage = '';

    const score = this.selectedScore;

    // 如果还没选分数，或者value不在1-7里，就print error message
    if(score === null || !this.scores.includes(score)){
      this.errorMessage = 'Please choose a sleepiness score from 1 to 7.';
      return;
    }

    const time = new Date(this.checkInTime);

    // 现在检查checkInTime如果是空的，或者时间解析不了，就print error message
    if(!this.checkInTime || Number.isNaN(time.getTime())){
      this.errorMessage = 'Please enter the date and time you felt this way.';
      return;
    }

    // 如果用户选了未来的时间
    if(time.getTime() > Date.now()){
      this.errorMessage = 'The check-in time cannot be in the future.'
      return;
    }

    
    // 如果输入的信息都没错，开始创建记录，保存记录，然后清空表单
    // 现在创建记录
    // StanfordSleepinessData的constructor需要：(loggedValue:number, loggedAt:Date = new Date()) 
    const record = new StanfordSleepinessData(score, time);

    // sleepservice 的 logSleepinessData(sleepData:StanfordSleepinessData)
    // 服务会把记录加入数组，然后history就可以从那里读到它，也就是保存这一行(但不是持久化).
    this.sleepService.logSleepinessData(record);

    //清空
    this.selectedScore = null;
    this.checkInTime = '';
    this.successMessage = 'Check-in saved. View it in History.';

  }

}
