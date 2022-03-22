import * as angular from 'angular';

import './Keyboard.scss';

const QWERTY = [
  ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
  ['enter', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'backspace'],
];

class WordleKeyboardController implements angular.IOnChanges {
  evaluations: Record<string, '🟩' | '🟨' | '🟦'> = {};
  keyboardType = QWERTY;

  constructor(private $element: JQLite, private $scope: angular.IScope) {
    'ngInject';
  }

  $postLink() {}

  $onChanges(changesObj: angular.IOnChangesObject) {}

  handleClick(e: Event, key: string) {
    e.preventDefault();
    let event = new KeyboardEvent('keyboard-key-press', {
      key,
      repeat: false,
      metaKey: false,
      ctrlKey: false,
      bubbles: true,
    });
    this.$scope.$emit('keyboard-key-press', event);
  }
}

export class WordleKeyboardComponent implements angular.IComponentOptions {
  static selector = 'wordleKeyboard';
  static controller = WordleKeyboardController;
  static bindings: { [id: string]: string } = {
    evaluations: '<',
  };
  static template = `
    <div class="row" ng-repeat="row in $ctrl.keyboardType track by $index">
      <button
        ng-repeat="letter in row track by letter"
        ng-click="$ctrl.handleClick($event, letter)"
        class="fade"
        data-state="{{$ctrl.evaluations[letter]}}"
      >
        {{letter}}
      </button>
    </div>
  `;
}
