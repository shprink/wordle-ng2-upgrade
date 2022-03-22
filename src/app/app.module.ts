import * as angular from 'angular';
import { DoBootstrap, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { setAngularJSGlobal, UpgradeModule } from '@angular/upgrade/static';

import { AppComponent } from './app.component';
import { WordleModule } from './wordle/wordle.module';
import { WordleNg1Module } from './wordle-ng1/wordle.module';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, UpgradeModule, WordleModule],
  providers: [{ provide: '$scope', useExisting: '$rootScope' }],
})
export class AppModule implements DoBootstrap {
  constructor(private upgrade: UpgradeModule) {}
  ngDoBootstrap(app: any) {
    setAngularJSGlobal(angular);
    this.upgrade.bootstrap(document.body, [WordleNg1Module.name], {
      strictDi: false,
    });
    app.bootstrap(AppComponent);
  }
}
