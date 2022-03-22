import { Directive, ElementRef, Injector, SimpleChanges } from '@angular/core';
import { UpgradeComponent } from '@angular/upgrade/static';

@Directive({
  selector: 'wordle-app',
})
export class AppDirective extends UpgradeComponent {
  constructor(elementRef: ElementRef, injector: Injector) {
    super('wordleApp', elementRef, injector);
  }
}
