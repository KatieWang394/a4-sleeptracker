import { Injectable } from '@angular/core';
import { SleepData } from '../data/sleep-data';
import { OvernightSleepData } from '../data/overnight-sleep-data';
import { StanfordSleepinessData } from '../data/stanford-sleepiness-data';
import { StorageService } from './storage.service';

type SleepRecord = OvernightSleepData | StanfordSleepinessData;

// StoredRecord是写进数据库的格式
type StoredRecord = {
	id: string;
	loggedAt: string;
} & (
	| { kind: 'overnight'; sleepStart: string; sleepEnd: string }
	| { kind: 'sleepiness'; score: number }
);

@Injectable({
  providedIn: 'root'
})
export class SleepService {

	// private static LoadDefaultData:boolean = true;
	public static AllSleepData:SleepData[] = [];
	public static AllOvernightData:OvernightSleepData[] = [];
	public static AllSleepinessData:StanfordSleepinessData[] = [];

	// constructor() {
	// 	if(SleepService.LoadDefaultData) {
	// 		this.addDefaultData();
	// 	SleepService.LoadDefaultData = false;
	// }
	// }

	// 新的constructor
	private readonly storageKey = 'sleep-records'; //两类记录在数据库里共用的key
	private readonly ready: Promise<void>; // 这里Promise要等把旧的记录读回来并放进数组

	private saveQueue: Promise<void> = Promise.resolve(); //记住上一笔保存，下一笔会等上一笔结束再写

	//需要传入一个StorageService
	public constructor(private storage: StorageService) {
		this.ready = this.loadRecords(); //读取记录，返回一个promise
		
		// catch error以防前面的操作失败
		void this.ready.catch(error => {
			console.error('Could not load sleep records.', error);
		});
	}
	
	// async让方法可以用await等数据库
	// 不会返回记录数组么事直接把记录放进现有的数组
	private async loadRecords(): Promise<void> {

		// StoredRecord[]是一组存起来的记录，但也可能找不到数据所以null
  		const saved: StoredRecord[] | null = await this.storage.get(this.storageKey);

		// 如果找不到数据就load默认的假数据，也就是第一次运行时没存过，saved才会是null
  		if (saved === null) {
    		this.addDefaultData();
    		return;
  		}

		this.restoreRecords(saved);
  	}

  	private restoreRecords(saved: StoredRecord[]): void {
    	// 先清空页面读取的数组，再把数据库里的最新列表放进去。
    	SleepService.AllSleepData.length = 0;
    	SleepService.AllOvernightData.length = 0;
    	SleepService.AllSleepinessData.length = 0;
		
		// 对每个saved数据
		for (const item of saved) {

    		const loggedAt = new Date(item.loggedAt); // item.loggedAt是数据库里的时间文字
    		
			let record: SleepRecord;

			//重建夜间记录
	    	if(item.kind === 'overnight'){
				record = new OvernightSleepData(new Date(item.sleepStart), new Date(item.sleepEnd),);
    		}else{ //重建白天困倦记录
      			record = new StanfordSleepinessData(item.score, loggedAt);
    		}

		    record.id = item.id;
    		record.loggedAt = loggedAt;
    		this.addRecord(record); //add这个记录会页面已经读取的数组里，也就是让history看到读回来的记录
		}
	}


	private addRecord(record: SleepRecord): void {

		// 这个是把record push到总数组里面的
		SleepService.AllSleepData.push(record);

		if(record instanceof OvernightSleepData) { //如果record是OvernightSleepData那就push到夜间记录数组
			SleepService.AllOvernightData.push(record);
  		}else{
    		SleepService.AllSleepinessData.push(record); //那就push到白天困倦数组
  		}
	}


	// 这是start code里面放的假数据，两条夜间样例和一条4分的困倦样例
	private addDefaultData() {
		var goToBed = new Date();
		goToBed.setDate(goToBed.getDate() - 1); //set to yesterday
		goToBed.setHours(1, 3, 0); //1:03am
		var wakeUp = new Date();
		wakeUp.setTime(goToBed.getTime() + 8 * 60 * 60 * 1000); //Sleep for exactly eight hours, waking up at 9:03am


		// this.logOvernightData(new OvernightSleepData(goToBed, wakeUp)); 
		this.addRecord(new OvernightSleepData(goToBed, wakeUp)); // add that person was asleep 1am-9am yesterday

		var sleepinessDate = new Date();
		sleepinessDate.setDate(sleepinessDate.getDate() - 1); //set to yesterday
		sleepinessDate.setHours(14, 38, 0); //2:38pm


		// this.logSleepinessData(new StanfordSleepinessData(4, sleepinessDate)); 
		this.addRecord(new StanfordSleepinessData(4, sleepinessDate)); // add sleepiness at 2pm

		goToBed = new Date();
		goToBed.setDate(goToBed.getDate() - 1); //set to yesterday
		goToBed.setHours(23, 11, 0); //11:11pm
		wakeUp = new Date();
		wakeUp.setTime(goToBed.getTime() + 9 * 60 * 60 * 1000); //Sleep for exactly nine hours


		// this.logOvernightData(new OvernightSleepData(goToBed, wakeUp));
		this.addRecord(new OvernightSleepData(goToBed, wakeUp));
	}

	// public logOvernightData(sleepData:OvernightSleepData) {
	// 	SleepService.AllSleepData.push(sleepData);
	// 	SleepService.AllOvernightData.push(sleepData);
	// }

	// public logSleepinessData(sleepData:StanfordSleepinessData) {
	// 	SleepService.AllSleepData.push(sleepData);
	// 	SleepService.AllSleepinessData.push(sleepData);
	// }

	public logOvernightData(record: OvernightSleepData): Promise<void> {
  		return this.saveRecord(record);
	}

	public logSleepinessData(record: StanfordSleepinessData): Promise<void> {
  		return this.saveRecord(record);
	}


	// private saveRecord(record: SleepRecord): Promise<void> {

	// 	//要等前一笔保存完在运行花括号里的步骤所以.then()
	// 	//async()因为用await
  	// 	const save = this.saveQueue.then(async() => {
			
	// 		//等loadRecords()完成，拿到记录了再把新纪录加进去
    // 		await this.ready;

	// 		// 把新的和旧的加在一起
    // 		const records = [...SleepService.AllOvernightData, ...SleepService.AllSleepinessData, record];
    // 		const storedRecords = records.map(item => this.toStoredRecord(item)); //把记录转化成上面顶级的数据库格式

	//     	await this.storage.set(this.storageKey, storedRecords); //写入数据库
    // 		this.addRecord(record); //给History和Today正在读取的数组
  	// 	});

	// 	this.saveQueue = save.catch(() => undefined);
  	// 	return save;
	// }

	private saveRecord(record: SleepRecord): Promise<void> {
  	// 将新记录加入数据库里的最新列表。
  		return this.updateRecords(records => [...records, this.toStoredRecord(record)]);
	}

	private updateRecords(change: (records: StoredRecord[]) => StoredRecord[],): Promise<void> {
  		// 等当前标签页上一笔操作完成，再执行这一笔。
  		const write = this.saveQueue.then(async () => {
			await this.ready;
			const update = async () => {
				// 先读数据库，避免用这个标签页手上的旧列表覆盖新记录。
      			const saved: StoredRecord[] | null = await this.storage.get(this.storageKey);
      			const current = saved ?? [...SleepService.AllOvernightData, ...SleepService.AllSleepinessData,
				].map(record => this.toStoredRecord(record));
				
				// change 是这次要做的操作：加一条，或者按 ID 删一条。
				const updated = change(current);
      			await this.storage.set(this.storageKey, updated);
      			this.restoreRecords(updated);
    		};

    		// 加锁后才读写，避免两个标签页同时更新同一份列表。
    		if(navigator.locks){
      			await navigator.locks.request('sleep-notes-records', update);
    		}else{
      			await update();
    		}
		});
		
		// 某一笔失败后，下一笔仍然可以继续执行。
  		this.saveQueue = write.catch(() => undefined);
  		return write;
	}

	// 把记录转化成上面定义的数据路格式
	private toStoredRecord(record: SleepRecord): StoredRecord {
  		const id = record.id;
  		const loggedAt = record.loggedAt.toISOString();

  		if (record instanceof OvernightSleepData) {
    		return {
				kind: 'overnight',
      			id,
      			loggedAt,
      			sleepStart: record.sleepStart.toISOString(),
      			sleepEnd: record.sleepEnd.toISOString(),
    		};
  		}else{
			return { kind: 'sleepiness', id, loggedAt, score: record.score};
		}

	}

	// //给undo和history删除用的
	// public deleteRecord(id: string): Promise<void> {

		
	// 	const deletion = this.saveQueue.then(async () => {

	// 		//先等app读取完记录再开始删
	// 		await this.ready;

	// 		//根据id找出来
    // 		const nights = SleepService.AllOvernightData.filter(record => record.id !== id);
    // 		const checkIns = SleepService.AllSleepinessData.filter(record => record.id !== id);
    // 		const remaining = [...nights, ...checkIns]; // 合并删除后要保留的记录

	// 		// 等数据库写完，再继续修改页面用的数组
	// 		// 把旧的列表更新成删除后的列表
	//     	await this.storage.set(
    //   			this.storageKey,
    //   			remaining.map(record => this.toStoredRecord(record)), //转换要写进去的数据库里的格式
    // 		);

	// 		//更新
    // 		SleepService.AllOvernightData = nights; 
    // 		SleepService.AllSleepinessData = checkIns;
    // 		SleepService.AllSleepData = SleepService.AllSleepData.filter(record => record.id !== id);
  	// 	});

  	// 	this.saveQueue = deletion.catch(() => undefined);
  	// 	return deletion;
	// }

	public deleteRecord(id: string): Promise<void> {
  		// 从数据库的最新列表删除这个 ID，保留其他标签页刚加的记录。
  		return this.updateRecords(records => records.filter(record => record.id !== id));
	}
}
