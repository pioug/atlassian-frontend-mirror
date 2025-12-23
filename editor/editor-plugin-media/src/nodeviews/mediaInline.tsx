/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { useEffect, useMemo, useState } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx } from '@emotion/react';

import type { DispatchAnalyticsEvent } from '@atlaskit/editor-common/analytics';
import type { EventDispatcher } from '@atlaskit/editor-common/event-dispatcher';
import {
	type NamedPluginStatesFromInjectionAPI,
	useSharedPluginStateWithSelector,
} from '@atlaskit/editor-common/hooks';
import { MediaInlineImageCard } from '@atlaskit/editor-common/media-inline';
import { type PortalProviderAPI } from '@atlaskit/editor-common/portal';
import { WithProviders } from '@atlaskit/editor-common/provider-factory';
import type {
	ContextIdentifierProvider,
	MediaProvider,
	ProviderFactory,
} from '@atlaskit/editor-common/provider-factory';
import { SelectionBasedNodeView } from '@atlaskit/editor-common/selection-based-node-view';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import type { EditorView, NodeView } from '@atlaskit/editor-prosemirror/view';
import { MediaInlineCard } from '@atlaskit/media-card';
import type { FileIdentifier } from '@atlaskit/media-client';
import { getMediaClient } from '@atlaskit/media-client-react';
import type { MediaClientConfig } from '@atlaskit/media-core/auth';
import { MediaInlineCardLoadingView } from '@atlaskit/media-ui';

import type { MediaNextEditorPluginType } from '../mediaPluginType';
import { isImage } from '../pm-plugins/utils/is-type';
import type {
	getPosHandler,
	getPosHandlerNode,
	getPosHandler as ProsemirrorGetPosHandler,
} from '../types';
import { MediaViewerContainer } from '../ui/MediaViewer/MediaViewerContainer';

import { MediaNodeUpdater } from './mediaNodeUpdater';
export interface MediaInlineProps {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	addPendingTask: (promise: Promise<any>) => void;
	allowInlineImages?: boolean;
	contextIdentifierProvider?: Promise<ContextIdentifierProvider>;
	dispatchAnalyticsEvent?: DispatchAnalyticsEvent;
	editorViewMode?: boolean;
	getPos: ProsemirrorGetPosHandler;
	handleMediaNodeMount: (node: PMNode, getPos: ProsemirrorGetPosHandler) => void;
	handleMediaNodeUnmount: (node: PMNode) => void;
	identifier: FileIdentifier;
	isSelected: boolean;
	mediaClientConfig: MediaClientConfig;
	mediaProvider: Promise<MediaProvider>;
	node: PMNode;
	selectedMediaContainerNode: () => PMNode | undefined;
	view: EditorView;
}

const createMediaNodeUpdater = (props: MediaInlineProps): MediaNodeUpdater => {
	const node = props.node;
	return new MediaNodeUpdater({
		...props,
		isMediaSingle: true,
		node: node ? (node as PMNode) : props.node,
		dispatchAnalyticsEvent: props.dispatchAnalyticsEvent,
		contextIdentifierProvider: props.contextIdentifierProvider,
	});
};

/**
 * Handles updating the media inline node attributes
 * but also handling copy-paste for cross-editor of the same instance
 * using the contextid
 *
 */
const updateMediaNodeAttributes = async (
	props: MediaInlineProps,
	mediaNodeUpdater: MediaNodeUpdater,
) => {
	const { addPendingTask } = props;

	const node = props.node;
	if (!node) {
		return;
	}

	const contextId = mediaNodeUpdater.getNodeContextId();
	if (!contextId) {
		await mediaNodeUpdater.updateContextId();
	}

	const shouldNodeBeDeepCopied = await mediaNodeUpdater.shouldNodeBeDeepCopied();

	if (shouldNodeBeDeepCopied) {
		// Copy paste flow (different pages)
		try {
			const copyNode = mediaNodeUpdater.copyNode({
				traceId: node.attrs.__mediaTraceId,
			});
			addPendingTask(copyNode);
			await copyNode;
		} catch (e) {
			return;
		}
	}
	await mediaNodeUpdater.updateMediaSingleFileAttrs();
};

export const handleNewNode = (props: MediaInlineProps): void => {
	const { node, handleMediaNodeMount, getPos } = props;
	handleMediaNodeMount(node, () => getPos());
};

export const MediaInline = (props: MediaInlineProps) => {
	const [viewMediaClientConfig, setViewMediaClientConfig] = useState<
		MediaClientConfig | undefined
	>();
	const [isNodeScopeUnsync, setIsNodeScopeUnsync] = useState<boolean>(true);

	useEffect(() => {
		const mediaNodeUpdater = createMediaNodeUpdater(props);
		mediaNodeUpdater.shouldNodeBeDeepCopied().then(setIsNodeScopeUnsync);

		handleNewNode(props);
		updateMediaNodeAttributes(props, mediaNodeUpdater);
		updateViewMediaClientConfig(props);

		return () => {
			const { handleMediaNodeUnmount } = props;
			handleMediaNodeUnmount(props.node);
		};
	}, [props]);

	const updateViewMediaClientConfig = async (props: MediaInlineProps) => {
		const mediaProvider = await props.mediaProvider;
		if (mediaProvider) {
			const viewMediaClientConfig = mediaProvider.viewMediaClientConfig;
			setViewMediaClientConfig(viewMediaClientConfig);
		}
	};

	const { id, collection, type, alt, width, height } = props.node.attrs;
	const identifier: FileIdentifier = {
		id,
		mediaItemType: 'file',
		// Ignored via go/ees005
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		collectionName: collection!,
	};

	/*
	 * Show the loading view if
	 * 1. The media provider is not ready
	 * 2. Context Id is not synced
	 * to prevent calling the media API (in mounting of `MediaInlineCard`)
	 * before the prerequisites meet
	 */
	if (!viewMediaClientConfig || isNodeScopeUnsync) {
		return <MediaInlineCardLoadingView message="" isSelected={false} />;
	}

	const { allowInlineImages } = props;
	const borderMark = props.node?.marks?.find((mark) => mark.type.name === 'border');

	if (allowInlineImages && isImage(type)) {
		return (
			<MediaInlineImageCard
				mediaClient={getMediaClient(viewMediaClientConfig)}
				identifier={identifier}
				isSelected={props.isSelected}
				alt={alt}
				width={width}
				height={height}
				border={{
					borderSize: borderMark?.attrs.size,
					borderColor: borderMark?.attrs.color,
				}}
				isViewOnly={props.editorViewMode}
			/>
		);
	}

	return (
		<MediaViewerContainer
			mediaNode={props.node}
			selectedMediaContainerNode={props.selectedMediaContainerNode}
			mediaClientConfig={props.mediaClientConfig}
			isEditorViewMode={props.editorViewMode}
			isSelected={props.isSelected}
			isInline={true}
		>
			<MediaInlineCard
				isSelected={props.isSelected}
				identifier={identifier}
				mediaClientConfig={viewMediaClientConfig}
			/>
		</MediaViewerContainer>
	);
};

type MediaInlineSharedStateProps = Omit<
	MediaInlineProps,
	| 'mediaPluginState'
	| 'mediaProvider'
	| 'handleMediaNodeMount'
	| 'handleMediaNodeUnmount'
	| 'addPendingTask'
	| 'selectedMediaContainerNode'
	| 'mediaClientConfig'
> & {
	api: ExtractInjectionAPI<MediaNextEditorPluginType> | undefined;
};

const selector = (
	states: NamedPluginStatesFromInjectionAPI<
		ExtractInjectionAPI<MediaNextEditorPluginType>,
		'editorViewMode' | 'media'
	>,
) => {
	return {
		viewMode: states.editorViewModeState?.mode,
		mediaProvider: states.mediaState?.mediaProvider,
		handleMediaNodeMount: states.mediaState?.handleMediaNodeMount,
		handleMediaNodeUnmount: states.mediaState?.handleMediaNodeUnmount,
		allowInlineImages: states.mediaState?.allowInlineImages,
		addPendingTask: states.mediaState?.addPendingTask,
		selectedMediaContainerNode: states.mediaState?.selectedMediaContainerNode,
		mediaClientConfig: states.mediaState?.mediaClientConfig,
	};
};

const MediaInlineSharedState = ({
	identifier,
	node,
	isSelected,
	getPos,
	contextIdentifierProvider,
	api,
	view,
}: MediaInlineSharedStateProps) => {
	const {
		mediaProvider,
		allowInlineImages,
		handleMediaNodeMount,
		handleMediaNodeUnmount,
		addPendingTask,
		selectedMediaContainerNode,
		mediaClientConfig,
		viewMode,
	} = useSharedPluginStateWithSelector(api, ['editorViewMode', 'media'], selector);
	const newMediaProvider = useMemo(
		() => (mediaProvider ? Promise.resolve(mediaProvider) : undefined),
		[mediaProvider],
	);

	if (
		!handleMediaNodeMount ||
		!handleMediaNodeUnmount ||
		!addPendingTask ||
		!selectedMediaContainerNode ||
		!mediaClientConfig ||
		!newMediaProvider
	) {
		return null;
	}

	return (
		<MediaInline
			identifier={identifier}
			mediaProvider={newMediaProvider}
			handleMediaNodeMount={handleMediaNodeMount}
			handleMediaNodeUnmount={handleMediaNodeUnmount}
			allowInlineImages={allowInlineImages}
			addPendingTask={addPendingTask}
			selectedMediaContainerNode={selectedMediaContainerNode}
			mediaClientConfig={mediaClientConfig}
			node={node}
			isSelected={isSelected}
			view={view}
			getPos={getPos}
			contextIdentifierProvider={contextIdentifierProvider}
			editorViewMode={viewMode === 'view'}
		/>
	);
};

interface MediaInlineNodeViewProps {
	api: ExtractInjectionAPI<MediaNextEditorPluginType> | undefined;
	dispatchAnalyticsEvent?: DispatchAnalyticsEvent;
	providerFactory: ProviderFactory;
}
export class MediaInlineNodeView extends SelectionBasedNodeView<MediaInlineNodeViewProps> {
	createDomRef() {
		const domRef = document.createElement('span');
		domRef.contentEditable = 'false';
		return domRef;
	}

	ignoreMutation() {
		return true;
	}

	viewShouldUpdate(nextNode: PMNode) {
		if (this.node.attrs !== nextNode.attrs) {
			return true;
		}

		return super.viewShouldUpdate(nextNode);
	}

	render(props: MediaInlineNodeViewProps) {
		const { providerFactory, api } = props;
		const { view } = this;
		const getPos = this.getPos as getPosHandlerNode;
		return (
			<WithProviders
				providers={['contextIdentifierProvider']}
				providerFactory={providerFactory}
				renderNode={({ mediaProvider, contextIdentifierProvider }) => {
					return (
						<MediaInlineSharedState
							identifier={this.node.attrs.id}
							node={this.node}
							isSelected={this.nodeInsideSelection()}
							view={view}
							getPos={getPos}
							contextIdentifierProvider={contextIdentifierProvider}
							api={api}
						/>
					);
				}}
			/>
		);
	}
}

export const ReactMediaInlineNode =
	(
		portalProviderAPI: PortalProviderAPI,
		eventDispatcher: EventDispatcher,
		providerFactory: ProviderFactory,
		api: ExtractInjectionAPI<MediaNextEditorPluginType> | undefined,
		dispatchAnalyticsEvent?: DispatchAnalyticsEvent,
	) =>
	(node: PMNode, view: EditorView, getPos: getPosHandler): NodeView => {
		return new MediaInlineNodeView(node, view, getPos, portalProviderAPI, eventDispatcher, {
			providerFactory,
			dispatchAnalyticsEvent,
			api,
		}).init();
	};
