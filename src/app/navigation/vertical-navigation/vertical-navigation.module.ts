import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { TooltipConfig, TooltipModule } from 'ngx-bootstrap/tooltip';

import { VerticalNavigationConfig } from './vertical-navigation-config';
import { VerticalNavigationComponent } from './vertical-navigation.component';
import { WindowReference } from '../../utilities/window.reference';

export {
  VerticalNavigationConfig
};

/**
 * A module containing objects associated with the navigation components
 */
@NgModule({
  imports: [
    CommonModule,
    TooltipModule.forRoot()
  ],
  declarations: [VerticalNavigationComponent],
  exports: [VerticalNavigationComponent],
  providers: [TooltipConfig, WindowReference]
})
export class VerticalNavigationModule {}
