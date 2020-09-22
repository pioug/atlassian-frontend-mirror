import { RichMediaLayout as MediaSingleLayout } from '@atlaskit/adf-schema';
import { MediaSingleProps } from '@atlaskit/editor-common';
import { MediaClientConfig } from '@atlaskit/media-core';
import { GridType } from '../../../grid/types';
import { EditorView } from 'prosemirror-view';
import { getPosHandler } from '../../../../nodeviews/types';
import { DispatchAnalyticsEvent } from '../../../../plugins/analytics';
import { ResolvedPos } from 'prosemirror-model';

export type EnabledHandles = { left?: boolean; right?: boolean };

export type Props = MediaSingleProps & {
  updateSize: (width: number | null, layout: MediaSingleLayout) => void;
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
  allowBreakoutSnapPoints?: boolean;
  selected: boolean;
  viewMediaClientConfig?: MediaClientConfig;
  fullWidthMode?: boolean;
  dispatchAnalyticsEvent: DispatchAnalyticsEvent;
};

export interface SnapPointsProps {
  $pos?: ResolvedPos | null;
  akEditorWideLayoutWidth: number;
  allowBreakoutSnapPoints?: boolean;
  containerWidth: number;
  gridSize: number;
  gridWidth: number;
  insideInlineLike: boolean;
  insideLayout: boolean;
  isVideoFile: boolean;
  lineLength: number;
  offsetLeft: number;
  wrappedLayout: boolean;
}
