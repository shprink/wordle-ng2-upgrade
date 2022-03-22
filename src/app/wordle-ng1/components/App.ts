import { TileState } from '../models';
import { GameState } from '../models';
import { WordleStateService } from '../services/state.service';

// import './App.scss';

const specialChar = '#';

class WordleAppController {
  private won = false;
  private wordLength = 5;
  private maxGuesses = 6;
  private solution: GameState.solution = '';
  private guessIndex: GameState.rowIndex = 0;
  private guess: GameState.solution = '';
  private boardState: GameState.boardState = [];
  private evaluations: GameState.evaluations = [];
  private lastKey = '';
  private keyboardEvaluations: GameState.keyboardEvaluations = {};
  private keyboardSub: (() => void) | undefined;

  constructor(
    private wordleStateService: WordleStateService,
    private $scope: angular.IScope
  ) {
    'ngInject';
  }

  $onInit() {
    const savedGame = this.wordleStateService.loadGame();
    if (savedGame) {
      this.solution = savedGame.solution;
      this.updateBoardState(savedGame.boardState);
    } else {
      this.solution = this.wordleStateService.getTodaysSolution();
    }
  }

  enableKeyboardEvent() {
    this.disableKeyboardEvent();
    window.addEventListener('keydown', this.keyboardEvent);
    this.keyboardSub = this.$scope.$on(
      'keyboard-key-press',
      (_e, keyboardEvent: KeyboardEvent) => {
        this.handleKeyDown(keyboardEvent);
      }
    );
  }

  disableKeyboardEvent() {
    window.removeEventListener('keydown', this.keyboardEvent);
    if (this.keyboardSub) {
      this.keyboardSub();
    }
  }

  keyboardEvent = (keyboardEvent: KeyboardEvent) => {
    this.handleKeyDown(keyboardEvent);
    this.$scope.$apply();
  };

  saveSolution(e: KeyboardEvent) {
    if (e.key === 'Enter' && this.solution.length === this.wordLength) {
      this.wordleStateService.saveGame({
        solution: this.solution,
        boardState: [],
      });
      window.location.reload();
    }
  }

  handleKeyDown({ key, repeat, metaKey, ctrlKey }: KeyboardEvent) {
    const lowerKey = key.toLowerCase();
    const isLetter = /^[a-z]$/i.test(lowerKey);
    const isAllowed = isLetter || ['backspace', 'enter'].includes(lowerKey);

    if (
      repeat ||
      !isAllowed ||
      metaKey ||
      ctrlKey ||
      this.boardState.length >= this.maxGuesses
    ) {
      return;
    }

    this.lastKey = lowerKey;

    switch (lowerKey) {
      case 'backspace':
        this.guess = this.guess.slice(0, -1);
        break;
      case 'enter':
        if (this.guess.length === this.wordLength) {
          this.updateBoardState([...this.boardState, this.guess]);
          this.wordleStateService.saveGame({
            solution: this.solution,
            boardState: this.boardState,
          });
        }
        break;
      default:
        if (this.guess.length < this.wordLength) {
          this.guess = this.guess + lowerKey;
        }
        break;
    }
  }

  updateBoardState(newState: GameState.boardState) {
    this.boardState = newState;
    this.guess = '';
    this.guessIndex = newState.length;
    this.evaluations = this.getEvaluations(this.solution, newState);
    this.keyboardEvaluations = this.getKeyboardEvaluations(
      newState,
      this.evaluations
    );
    this.won = this.isWinner(this.evaluations);
    if (this.won) {
      this.disableKeyboardEvent();
    } else {
      this.enableKeyboardEvent();
    }
    console.table(this.evaluations);
    console.table(this.keyboardEvaluations);
  }

  isWinner(evaluations: GameState.evaluations) {
    let isWinner = false;
    for (let i = 0; i < evaluations.length; i++) {
      const row = evaluations[i];
      isWinner = row.every((state) => state === TileState.CORRECT);
      if (isWinner) {
        break;
      }
    }
    return isWinner;
  }

  getEvaluations(
    solution: GameState.solution,
    boardState: GameState.boardState
  ): GameState.evaluations {
    return Array.from(Array(this.maxGuesses)).map((_, index) => {
      let word = boardState[index];
      if (!word) {
        return Array.from(Array(this.wordLength)).fill(TileState.EMPTY);
      }
      let solutionCopy = solution;
      const evaluation = Array.from(Array(this.wordLength)).fill(
        TileState.ABSENT
      );
      for (let i = 0; i < word.length; i++) {
        const char = word[i];
        if (solutionCopy[i] === char) {
          evaluation[i] = TileState.CORRECT;
          word = replaceAt(word, specialChar, i);
          solutionCopy = replaceAt(solutionCopy, specialChar, i);
        }
      }
      for (let j = 0; j < word.length; j++) {
        const char = word[j];
        if (char === specialChar) {
          continue;
        }
        if (solutionCopy.includes(char)) {
          evaluation[j] = TileState.PRESENT;
          solutionCopy = replaceAt(
            solutionCopy,
            specialChar,
            solutionCopy.indexOf(char)
          );
        }
      }
      return evaluation;
    });
  }

  getKeyboardEvaluations(
    boardState: GameState.boardState,
    evaluations: GameState.evaluations
  ): GameState.keyboardEvaluations {
    const keyboardEvaluations = {} as any;

    for (let i = 0; i < boardState.length; i++) {
      const word = boardState[i];
      for (let j = 0; j < word.length; j++) {
        const letter = word[j].toLocaleUpperCase();
        const currEval = evaluations[i][j];
        const currKeyEval = keyboardEvaluations[letter];
        if (!currKeyEval) {
          keyboardEvaluations[letter] = currEval;
        } else if (currEval > currKeyEval) {
          keyboardEvaluations[letter] = currEval;
        }
      }
    }

    return keyboardEvaluations;
  }
}

export class WordleAppComponent implements angular.IComponentOptions {
  static selector = 'wordleApp';
  static controller = WordleAppController;
  static template = `
    <header>
      <form name="stateForm">
        <label>Solution:
          <input
            type="text"
            name="solution"
            ng-model="$ctrl.solution"
            ng-keydown="$ctrl.saveSolution($event)"
            ng-focus="$ctrl.disableKeyboardEvent()"
            ng-blur="$ctrl.enableKeyboardEvent()" />
        </label>
      </form>
      <h2 ng-if="$ctrl.won">WINNER</h2>
    </header>
    <main>
      <div id="board">
        <wordle-row
          ng-repeat="x in [].constructor( $ctrl.maxGuesses) track by $index"
          word="$ctrl.guessIndex === $index ? $ctrl.guess : $ctrl.boardState[$index]"
          last-key="$ctrl.lastKey"
          evaluations="$ctrl.evaluations[$index]"
          word-length="$ctrl.wordLength"
        >
        </wordle-row>
      </div>
    </main>
    <footer>
      <wordle-keyboard
        evaluations="$ctrl.keyboardEvaluations"
      ></wordle-keyboard>
    </footer>
  `;
}

function replaceAt(myString: string, char: string, index: number) {
  return myString.substring(0, index) + char + myString.substring(index + 1);
}
