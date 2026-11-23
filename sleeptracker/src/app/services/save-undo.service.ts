import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular/standalone'; //Toast是保存成功后短暂弹出来的提示
import { SleepService } from './sleep.service';

@Injectable({ 
  providedIn: 'root'  //告诉angular整个app都能用这个服务
})
export class SaveUndoService {
  public constructor(private toastController: ToastController, private sleepService: SleepService) {}

  // 记录写入后才调用show
  public async show(recordId: string): Promise<void> {
    const toast = await this.toastController.create({
      message: 'Record saved.',
      cssClass: 'save-undo-toast',
      duration: 3000, //3秒
      buttons: [{ text: 'Undo', role: 'undo' }], //text给用户看的, roles给程序看的名字, 用力啊判断题时是不是因为用户点了Undo才关闭
    });

    //等create*()完成再显示提示
    await toast.present();
    const result = await toast.onDidDismiss(); //等待关闭(用户点了Undo或者5秒到了也会关闭它)

    // 只有刚刚关闭原因是用户点了Undo，我们才call删除方法
    if(result.role === 'undo') {
      try{
        await this.sleepService.deleteRecord(recordId);
      }catch{
        const errorToast = await this.toastController.create({
          message: 'Could not undo the save. Please try again in History.',
          duration: 3000,
        });
        await errorToast.present();
      }
    }
  }
}