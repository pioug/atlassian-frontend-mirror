import { RichMediaLayout } from '@atlaskit/adf-schema';
import { MediaSingleProps } from '@atlaskit/editor-common';
import { MediaClientConfig } from '@atlaskit/media-core';
import { GridType } from '../../plugins/grid/types';
import { EditorView } from 'prosemirror-view';
import { getPosHandler } from '../../nodeviews/types';
import { DispatchAnalyticsEvent } from '../../plugins/analytics';

export type EnabledHandles = { left?: boolean; right?: boolean };

export type Props = MediaSingleProps & {
  updateSize: (width: number | null, layout: RichMediaLayout) => void;
  displayGrid: (
    show: boolean,
    type: GridType,
    highlight?: number[] | string[],
  ) => void;
  getPos: getPosHandler;
  view: EditorView;
  lineLength: number;
  gridSize: number;
  containerWidth: number;
  dispatchAnalyticsEvent?: DispatchAnalyticsEvent;
  allowBreakoutSnapPoints?: boolean;
  selected?: boolean;
  viewMediaClientConfig?: MediaClientConfig;
  fullWidthMode?: boolean;
  updateWidth?: (newWidth: number) => void;
};
