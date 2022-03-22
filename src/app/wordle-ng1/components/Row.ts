import { WordleStateService } from '../services/state.service';
import { TileState, RowAnimations } from '../models';

// import './Row.scss';

// interface IWordleRowScope extends ng.IScope {
//   wordLength: number;
// }

class WordleRowController {
  emptyTile = TileState.EMPTY;
  animation: RowAnimations = 'idle';
  wordLength: number = 5;
  word: string = '';
  lastKey: string = '';
  evaluations: TileState[] = [];

  constructor(private $element: JQLite) {
    'ngInject';
  }

  $onInit() {}

  $postLink() {
    const $row = this.$element[0].querySelector('.row');
    if (!$row) {
      return;
    }

    $row.addEventListener('animationend', (event: Event) => {
      const { animationName } = event as AnimationEvent;
      switch (animationName as RowAnimations) {
        case 'valid':
        case 'invalid':
          this.animation = 'idle';
          this.updateAnimation();
          break;
      }
    });
  }

  $onChanges(changesObj: angular.IOnChangesObject) {
    if (
      changesObj?.['evaluations']?.currentValue &&
      Array.isArray(changesObj['evaluations'].previousValue) &&
      changesObj['evaluations'].currentValue.join() !==
        changesObj['evaluations'].previousValue.join()
    ) {
      const AreAllCorrect = this.evaluations.every(
        (evaluation) => evaluation === TileState.CORRECT
      );
      if (this.lastKey === 'enter') {
        if (AreAllCorrect) {
          this.animation = 'valid';
        } else {
          this.animation = 'invalid';
        }
        this.updateAnimation();
      }
    }
  }

  updateAnimation() {
    this.$element.attr('data-animation', this.animation);
  }
}

export class WordleRowComponent implements angular.IComponentOptions {
  static selector = 'wordleRow';
  static controller = WordleRowController;
  static template = `
    <div
      class="row"
      style="--anim-delay: {{$ctrl.wordLength * 250}}ms;"
      ng-style="{
        'grid-template-columns': 'repeat(' + $ctrl.wordLength + ', 1fr)'
      }"
    >
      <wordle-tile
        ng-repeat="x in [].constructor($ctrl.wordLength) track by $index"
        style="--anim-delay: {{$index * 250}}ms;"
        letter="($ctrl.word || '')[$index]"
        state="$ctrl.evaluations[$index] || $ctrl.emptyTile"
      >
      </wordle-tile>
    </div>
  `;
  static bindings: { [id: string]: string } = {
    word: '<',
    wordLength: '<',
    evaluations: '<',
    lastKey: '<',
  };
}
