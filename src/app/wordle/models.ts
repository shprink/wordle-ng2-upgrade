export enum TileState {
  CORRECT = '🟩',
  PRESENT = '🟨',
  ABSENT = '🟦',
  EMPTY = '⬜️',
}

export type RowAnimations = 'valid' | 'invalid' | 'idle';

export namespace GameState {
  export type solution = string;
  export type rowIndex = number;
  export type boardState = string[];
  export type evaluations = TileState[][];
  export type animations = RowAnimations[];
  export type keyboardEvaluations = Record<
    string,
    TileState.CORRECT | TileState.PRESENT | TileState.ABSENT
  >;
}

export type Keyboards = 'AZERTY' | 'QWERTY' | 'QWERTZ' | 'BEPO';

export interface IGameState {
  solution: GameState.solution;
  boardState: GameState.boardState;
}

export type TileAnimations = 'flipin' | 'flipout' | 'pop' | 'idle';
