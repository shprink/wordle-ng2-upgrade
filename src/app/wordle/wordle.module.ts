import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { UpgradeModule } from '@angular/upgrade/static';

// import { AppDirective } from './components/App';
// import { WordleNg2TileDirective } from './components/Tile/Tile.component';
import { WordleNg2AppDirective } from './components/App/App.component';

@NgModule({
  imports: [CommonModule, UpgradeModule],
  exports: [WordleNg2AppDirective],
  declarations: [WordleNg2AppDirective],
  providers: [],
})
export class WordleModule {}
