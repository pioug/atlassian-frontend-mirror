import { type RichMediaLayout } from '@atlaskit/adf-schema';
import { type EditorView } from '@atlaskit/editor-prosemirror/view';
import { type MediaClientConfig } from '@atlaskit/media-core';

import type { DispatchAnalyticsEvent } from '../../analytics';
import type { getPosHandler } from '../../react-node-view';
import type { GridType } from '../../types';
import type { MediaSingleProps } from '../../ui';

export type EnabledHandles = { left?: boolean; right?: boolean };

export type Props = MediaSingleProps & {
  updateSize: (width: number | null, layout: RichMediaLayout) => void;
  displayGrid:
    | ((show: boolean, type: GridType, highlight: number[] | string[]) => void)
    | undefined;
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
