import * as angular from 'angular';

import { WordleStateService } from './services/state.service';
import { WordleRowComponent } from './components/Row';
import { WordleAppComponent } from './components/App';
import { WordleTileComponent } from './components/Tile';
import { WordleKeyboardComponent } from './components/Keyboard';

export const WordleNg1Module = angular.module('wordleNg1', []);

WordleNg1Module.component(WordleAppComponent.selector, WordleAppComponent);
WordleNg1Module.component(WordleRowComponent.selector, WordleRowComponent);
WordleNg1Module.component(WordleTileComponent.selector, WordleTileComponent);
WordleNg1Module.component(
  WordleKeyboardComponent.selector,
  WordleKeyboardComponent
);

WordleNg1Module.service(WordleStateService.selector, WordleStateService);
