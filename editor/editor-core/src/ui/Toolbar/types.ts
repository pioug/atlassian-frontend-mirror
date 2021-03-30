import React from 'react';
import { UiComponentFactoryParams } from '../../types/ui-components';

export enum ToolbarSize {
  XXL = 6,
  XL = 5,
  L = 4,
  M = 3,
  S = 2,
  XXXS = 1,
}

export enum ToolbarWidths {
  XXL = 610,
  XL = 540,
  L = 460,
  M = 450,
  S = 370,
}

export enum ToolbarWidthsFullPage {
  XXL = 650,
  XL = 580,
  L = 540,
  M = 490,
  S = 410,
}

export type ToolbarUiComponentFactoryParams = UiComponentFactoryParams & {
  toolbarSize: ToolbarSize;
  isToolbarReducedSpacing: boolean;
  isLastItem?: boolean;
};
export type ToolbarUIComponentFactory = (
  params: ToolbarUiComponentFactoryParams,
) => React.ReactElement<any> | null;
