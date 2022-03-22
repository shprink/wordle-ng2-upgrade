import { Directive, ElementRef, Injector, Input } from '@angular/core';
import { UpgradeComponent } from '@angular/upgrade/static';

@Directive({
  selector: 'wordle-ng2-tile',
})
export class WordleNg2TileDirective extends UpgradeComponent {
  @Input() letter = '';

  constructor(elementRef: ElementRef, injector: Injector) {
    super('wordleTile', elementRef, injector);
  }
}
