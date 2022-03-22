import * as angular from 'angular';
import { TileState, TileAnimations } from '../models';

// import './Tile.scss';

class WordleTileController implements angular.IOnChanges {
  letter: string = '';
  state: string = TileState.EMPTY;
  animation: TileAnimations = 'idle';

  constructor(private $element: JQLite) {
    'ngInject';
  }

  $postLink() {
    const $tile = this.$element[0].querySelector('.tile');
    if (!$tile) {
      return;
    }

    $tile.addEventListener('animationend', (event: Event) => {
      const { animationName } = event as AnimationEvent;
      switch (animationName as TileAnimations) {
        case 'flipin':
          this.animation = 'flipout';
          break;
        case 'pop':
        case 'flipout':
        default:
          this.animation = 'idle';
          break;
      }
      this.updateAnimation();
    });
  }

  $onChanges(changesObj: angular.IOnChangesObject) {
    if (changesObj?.['letter']) {
      this.$element.attr('data-letter', this.letter || null);
    }
    if (
      changesObj?.['state']?.currentValue &&
      changesObj['state'].currentValue !== changesObj['state'].previousValue
    ) {
      this.$element.attr('data-state', this.state);
    }
    if (
      changesObj?.['animation']?.currentValue &&
      changesObj['animation'].currentValue !==
        changesObj['animation'].previousValue
    ) {
      this.updateAnimation();
    }
    if (
      changesObj?.['state']?.previousValue === TileState.EMPTY &&
      changesObj?.['state']?.currentValue !== TileState.EMPTY
    ) {
      this.animation = 'flipin';
      this.updateAnimation();
    }
    if (
      changesObj?.['letter']?.previousValue === undefined &&
      changesObj?.['letter']?.currentValue
    ) {
      this.animation = 'pop';
      this.updateAnimation();
    }
  }

  updateAnimation() {
    this.$element.attr('data-animation', this.animation);
  }
}

export class WordleTileComponent implements angular.IComponentOptions {
  static selector = 'wordleTile';
  static controller = WordleTileController;
  static bindings: { [id: string]: string } = {
    letter: '<',
    state: '<',
    animation: '<',
  };
  static template = `
    <div class="tile">{{$ctrl.letter}}</div>
  `;
}
