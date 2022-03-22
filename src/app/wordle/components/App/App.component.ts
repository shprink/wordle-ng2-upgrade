import { Directive, ElementRef, Injector, Input } from '@angular/core';
import { UpgradeComponent } from '@angular/upgrade/static';

@Directive({
  selector: 'wordle-ng2-app',
})
export class WordleNg2AppDirective extends UpgradeComponent {
  constructor(elementRef: ElementRef, injector: Injector) {
    super('wordleApp', elementRef, injector);
  }
}
