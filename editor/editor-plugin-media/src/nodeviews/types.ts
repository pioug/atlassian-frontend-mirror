import type { DispatchAnalyticsEvent } from '@atlaskit/editor-common/analytics';
import type { EventDispatcher } from '@atlaskit/editor-common/event-dispatcher';
import type {
	ContextIdentifierProvider,
	MediaProvider,
	ProviderFactory,
} from '@atlaskit/editor-common/provider-factory';
import type { EditorAppearance, ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import type { InlineCommentPluginState } from '@atlaskit/editor-plugin-annotation';
import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';

import type { MediaNextEditorPluginType } from '../mediaPluginType';
import type { MediaPluginState } from '../pm-plugins/types';
import type { ForwardRef, MediaOptions, getPosHandler as ProsemirrorGetPosHandler } from '../types';

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
	annotationPluginState: InlineCommentPluginState;
	dispatchAnalyticsEvent: DispatchAnalyticsEvent;
	isCopyPasteEnabled?: boolean;
	forwardRef: ForwardRef;
	pluginInjectionApi: ExtractInjectionAPI<MediaNextEditorPluginType> | undefined;
	editorViewMode?: boolean;
	editorDisabled?: boolean;
	editorAppearance?: EditorAppearance;
}

export interface MediaSingleNodeViewProps {
	eventDispatcher: EventDispatcher;
	providerFactory: ProviderFactory;
	mediaOptions: MediaOptions;
	fullWidthMode?: boolean;
	dispatchAnalyticsEvent?: DispatchAnalyticsEvent;
	isCopyPasteEnabled?: boolean;
	pluginInjectionApi: ExtractInjectionAPI<MediaNextEditorPluginType> | undefined;
	editorAppearance?: EditorAppearance;
}

export interface MediaNodeViewProps {
	eventDispatcher: EventDispatcher;
	providerFactory: ProviderFactory;
	mediaOptions: MediaOptions;
	pluginInjectionApi: ExtractInjectionAPI<MediaNextEditorPluginType> | undefined;
}
