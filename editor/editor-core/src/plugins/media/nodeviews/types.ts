import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import type { ProviderFactory } from '@atlaskit/editor-common/provider-factory';
import type {
  ContextIdentifierProvider,
  MediaProvider,
} from '@atlaskit/editor-common/provider-factory';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import type { ProsemirrorGetPosHandler, ForwardRef } from '../../../nodeviews';
import type { EventDispatcher } from '../../../event-dispatcher';
import type { MediaOptions } from '../types';
import type { DispatchAnalyticsEvent } from '@atlaskit/editor-common/analytics';
import type { MediaPluginState } from '../pm-plugins/types';
import type mediaPlugin from '../index';

export interface MediaSingleNodeProps {
  view: EditorView;
  node: PMNode;
  getPos: ProsemirrorGetPosHandler;
  eventDispatcher: EventDispatcher;
  width: number;
  selected: Function;
  lineLength: number;
  mediaOptions: MediaOptions;
  mediaProvider?: Promise<MediaProvider>;
  contextIdentifierProvider?: Promise<ContextIdentifierProvider>;
  fullWidthMode?: boolean;
  mediaPluginState: MediaPluginState;
  dispatchAnalyticsEvent: DispatchAnalyticsEvent;
  isCopyPasteEnabled?: boolean;
  forwardRef: ForwardRef;
  pluginInjectionApi: ExtractInjectionAPI<typeof mediaPlugin> | undefined;
}

export interface MediaSingleNodeViewProps {
  eventDispatcher: EventDispatcher;
  providerFactory: ProviderFactory;
  mediaOptions: MediaOptions;
  fullWidthMode?: boolean;
  dispatchAnalyticsEvent?: DispatchAnalyticsEvent;
  isCopyPasteEnabled?: boolean;
  pluginInjectionApi: ExtractInjectionAPI<typeof mediaPlugin> | undefined;
}

export interface MediaNodeViewProps {
  eventDispatcher: EventDispatcher;
  providerFactory: ProviderFactory;
  mediaOptions: MediaOptions;
  pluginInjectionApi: ExtractInjectionAPI<typeof mediaPlugin> | undefined;
}
