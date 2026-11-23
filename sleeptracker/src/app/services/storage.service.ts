import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular'; //负责打开，写入和读取数据库的工具

@Injectable({
  providedIn: 'root', //给整个app的范围内提供这个服务
})
export class StorageService {

  private _storage: Promise<Storage>;

  // 把配置好的Ionic Storage传进来
  public constructor(private storage: Storage) {
    // create() 让它开始打开存储，必要时创建存储。`
    // create() 返回一个 Promise
    this._storage = this.storage.create();
  }

  // public让其他类能调用它，例如 SleepService。
  // async表示这个方法会返回一个Promise，里面也可以写await等操作完成。
  public async set(key: string, value: unknown) {
    // 右边的await让这个方法先等数据库准备好。
    // 等Promise成功完成，拿到的Storage对象就放进左边这个局部变量storage
    const storage = await this._storage; 
    // 上一行等数据库打开，这一行等数据写完。
    await storage.set(key, value); // 调用刚拿到的Ionic工具的set()，把value存在key这个名字下面
  }

  public async get(key: string) {
    const storage = await this._storage; // 读取前也要等存储准备好
    const val = await storage.get(key); // 调用Ionic工具的get()，查找key对应的数据
    return val;
  }
}