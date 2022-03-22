import { IGameState } from '../models';

const storageKey = 'gameState';

export class WordleStateService {
  static selector = 'wordleStateService';
  protected solution = 'pause';

  constructor(private $q: angular.IQService) {
    'ngInject';
  }

  getTodaysSolution() {
    return this.solution;
  }

  loadGame() {
    const gameState = window.localStorage.getItem(storageKey);
    if (gameState) {
      try {
        return JSON.parse(gameState) as IGameState;
      } catch (error) {}
    }
    return;
  }

  saveGame(game: IGameState) {
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(game));
    } catch (error) {}
  }
}
