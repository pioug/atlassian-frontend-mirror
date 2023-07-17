import { RichMediaLayout as MediaSingleLayout } from '@atlaskit/adf-schema';
import type { MediaSingleProps } from '@atlaskit/editor-common/ui';
import { MediaClientConfig } from '@atlaskit/media-core';
import type mediaPlugin from '../../index';
import { EditorView } from 'prosemirror-view';
import { getPosHandler } from '../../../../nodeviews/types';
import type { DispatchAnalyticsEvent } from '@atlaskit/editor-common/analytics';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';

export type EnabledHandles = { left?: boolean; right?: boolean };

export type Props = MediaSingleProps & {
  updateSize: (width: number | null, layout: MediaSingleLayout) => void;
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
  pluginInjectionApi: ExtractInjectionAPI<typeof mediaPlugin> | undefined;
};
