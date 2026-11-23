import { importProvidersFrom } from '@angular/core'; // 待会儿要用它把Ionic的存储模块提供给整个App
import { bootstrapApplication } from '@angular/platform-browser';
import { RouteReuseStrategy, provideRouter, withPreloading, PreloadAllModules } from '@angular/router';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone';
import { Drivers } from '@ionic/storage'; // 可以把它理解成一组存储方式的名字。待会儿写 Drivers.IndexedDB，就是从这组名字里选 IndexedDB。
import { IonicStorageModule } from '@ionic/storage-angular'; // 上一行的 Drivers 给你一个选择，这一行的 IonicStorageModule 才是后面要配置和注册的工具。

import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';


// 启动 App，并注册 IndexedDB
bootstrapApplication(AppComponent, {

  // providers 是这里的一项配置，`[` 表示后面是一份清单。清单里列出 App 启动时需要提供给 Angular 的工具和规则。路由、Ionic 和存储都在这里注册。
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideIonicAngular(),
    provideRouter(routes, withPreloading(PreloadAllModules)),

    // 开始调用 importProvidersFrom。
    // 它会把括号里那个模块提供的工具取出来，让这些工具可以放进现在这个 providers 清单。
    importProvidersFrom(
      IonicStorageModule.forRoot({ //forRoot在这里是为整个App配置存储的意思
        name: 'sleep-notes', // 我们给数据库起的名字, 它是整个数据库的名字
        driverOrder: [Drivers.IndexedDB, Drivers.LocalStorage], // driverOrder 是 Ionic Storage 尝试存储方式的顺序。
                                                                // Drivers.IndexedDB 写在前面，所以浏览器支持 IndexedDB 时就用它。
                                                                // Drivers.LocalStorage 写在后面，只有 IndexedDB 无法初始化时，才会尝试它。
      }),
    ),
  ],
});
