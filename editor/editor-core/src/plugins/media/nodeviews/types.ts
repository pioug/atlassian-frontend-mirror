import { Node as PMNode } from 'prosemirror-model';
import { EditorView } from 'prosemirror-view';
import { ProviderFactory } from '@atlaskit/editor-common/provider-factory';
import type {
  ContextIdentifierProvider,
  MediaProvider,
} from '@atlaskit/editor-common/provider-factory';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { ProsemirrorGetPosHandler, ForwardRef } from '../../../nodeviews';
import { EventDispatcher } from '../../../event-dispatcher';
import { MediaOptions } from '../types';
import { DispatchAnalyticsEvent } from '../../analytics';
import { MediaPluginState } from '../pm-plugins/types';
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
