import type { DispatchAnalyticsEvent } from '@atlaskit/editor-common/analytics';
import type { EventDispatcher } from '@atlaskit/editor-common/event-dispatcher';
import type {
	ContextIdentifierProvider,
	MediaProvider,
	ProviderFactory,
} from '@atlaskit/editor-common/provider-factory';
import type { EditorAppearance, ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';

import type { MediaNextEditorPluginType } from '../mediaPluginType';
import type { ForwardRef, MediaOptions, getPosHandler as ProsemirrorGetPosHandler } from '../types';

export interface MediaSingleNodeProps {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	addPendingTask?: (promise: Promise<any>) => void;
	contextIdentifierProvider?: Promise<ContextIdentifierProvider>;
	dispatchAnalyticsEvent: DispatchAnalyticsEvent;
	editorAppearance?: EditorAppearance;
	editorDisabled?: boolean;
	editorViewMode?: boolean;
	eventDispatcher: EventDispatcher;
	forwardRef: ForwardRef;
	fullWidthMode?: boolean;
	getPos: ProsemirrorGetPosHandler;
	isCopyPasteEnabled?: boolean;
	isDrafting?: boolean;
	lineLength: number;
	mediaOptions: MediaOptions;
	mediaProvider?: Promise<MediaProvider>;
	node: PMNode;
	pluginInjectionApi: ExtractInjectionAPI<MediaNextEditorPluginType> | undefined;
	selected: () => boolean;
	targetNodeId?: string;
	view: EditorView;
	width: number;
}

export interface MediaSingleNodeViewProps {
	dispatchAnalyticsEvent?: DispatchAnalyticsEvent;
	editorAppearance?: EditorAppearance;
	eventDispatcher: EventDispatcher;
	fullWidthMode?: boolean;
	isCopyPasteEnabled?: boolean;
	mediaOptions: MediaOptions;
	pluginInjectionApi: ExtractInjectionAPI<MediaNextEditorPluginType> | undefined;
	providerFactory: ProviderFactory;
}

export interface MediaNodeViewProps {
	eventDispatcher: EventDispatcher;
	mediaOptions: MediaOptions;
	pluginInjectionApi: ExtractInjectionAPI<MediaNextEditorPluginType> | undefined;
	providerFactory: ProviderFactory;
}
