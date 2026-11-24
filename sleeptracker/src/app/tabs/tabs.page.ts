import { Component, inject } from '@angular/core';
import {
  IonLabel, IonTabBar, IonTabButton, IonTabs
} from '@ionic/angular/standalone';

import { SaveUndoService } from '../services/save-undo.service';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss'],
  imports: [IonTabs, IonTabBar, IonTabButton, IonLabel],
})
export class TabsPage {
  readonly saveUndo = inject(SaveUndoService);
}
