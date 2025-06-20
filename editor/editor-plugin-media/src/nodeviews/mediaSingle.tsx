/**
 * @jsxRuntime classic
 * @jsx jsx
 * @jsxFrag
 */
import { useCallback, useMemo } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx } from '@emotion/react';

import type { DispatchAnalyticsEvent } from '@atlaskit/editor-common/analytics';
import type { EventDispatcher } from '@atlaskit/editor-common/event-dispatcher';
import {
	sharedPluginStateHookMigratorFactory,
	useSharedPluginState,
} from '@atlaskit/editor-common/hooks';
import type { PortalProviderAPI } from '@atlaskit/editor-common/portal';
import { WithProviders } from '@atlaskit/editor-common/provider-factory';
import type { ProviderFactory } from '@atlaskit/editor-common/provider-factory';
import ReactNodeView from '@atlaskit/editor-common/react-node-view';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { useSharedPluginStateSelector } from '@atlaskit/editor-common/use-shared-plugin-state-selector';
import { isNodeSelectedOrInRange } from '@atlaskit/editor-common/utils';
import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import type { Decoration, DecorationSource, EditorView } from '@atlaskit/editor-prosemirror/view';
import { fg } from '@atlaskit/platform-feature-flags';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';

import type { MediaNextEditorPluginType } from '../mediaPluginType';
import { MEDIA_CONTENT_WRAP_CLASS_NAME } from '../pm-plugins/main';
import type { ForwardRef, getPosHandler, getPosHandlerNode, MediaOptions } from '../types';

import { MediaSingleNodeNext } from './mediaSingleNext';
import type { MediaSingleNodeProps, MediaSingleNodeViewProps } from './types';

const useSharedState = sharedPluginStateHookMigratorFactory(
	(pluginInjectionApi: ExtractInjectionAPI<MediaNextEditorPluginType> | undefined) => {
		const mediaProviderPromise = useSharedPluginStateSelector(
			pluginInjectionApi,
			'media.mediaProvider',
		);
		const addPendingTask = useSharedPluginStateSelector(pluginInjectionApi, 'media.addPendingTask');
		const isDrafting = useSharedPluginStateSelector(pluginInjectionApi, 'annotation.isDrafting');
		const targetNodeId = useSharedPluginStateSelector(
			pluginInjectionApi,
			'annotation.targetNodeId',
		);
		const width = useSharedPluginStateSelector(pluginInjectionApi, 'width.width');
		const lineLength = useSharedPluginStateSelector(pluginInjectionApi, 'width.lineLength');
		const editorDisabled = useSharedPluginStateSelector(
			pluginInjectionApi,
			'editorDisabled.editorDisabled',
		);
		const viewMode = useSharedPluginStateSelector(pluginInjectionApi, 'editorViewMode.mode');
		return {
			mediaProviderPromise,
			addPendingTask,
			isDrafting,
			targetNodeId,
			width,
			lineLength,
			editorDisabled,
			viewMode,
		};
	},
	(pluginInjectionApi: ExtractInjectionAPI<MediaNextEditorPluginType> | undefined) => {
		const { widthState, mediaState, annotationState, editorDisabledState, editorViewModeState } =
			useSharedPluginState(pluginInjectionApi, [
				'width',
				'media',
				'annotation',
				'editorDisabled',
				'editorViewMode',
			]);
		return {
			mediaProviderPromise: mediaState?.mediaProvider,
			addPendingTask: mediaState?.addPendingTask,
			isDrafting: annotationState?.isDrafting,
			targetNodeId: annotationState?.targetNodeId,
			width: widthState?.width,
			lineLength: widthState?.lineLength,
			editorDisabled: editorDisabledState?.editorDisabled,
			viewMode: editorViewModeState?.mode,
		};
	},
);

const MediaSingleNodeWrapper = ({
	pluginInjectionApi,
	contextIdentifierProvider,
	node,
	getPos,
	mediaOptions,
	view,
	fullWidthMode,
	selected,
	eventDispatcher,
	dispatchAnalyticsEvent,
	forwardRef,
	editorAppearance,
}: Omit<
	MediaSingleNodeProps,
	| 'width'
	| 'lineLength'
	| 'mediaPluginState'
	| 'annotationPluginState'
	| 'editorDisabled'
	| 'editorViewMode'
>) => {
	const {
		mediaProviderPromise,
		addPendingTask,
		isDrafting,
		targetNodeId,
		width,
		lineLength,
		editorDisabled,
		viewMode,
	} = useSharedState(pluginInjectionApi);

	const hasHadInteraction = useSharedPluginStateSelector(
		pluginInjectionApi,
		'interaction.hasHadInteraction',
	);

	const interactionState = useSharedPluginStateSelector(
		pluginInjectionApi,
		'interaction.interactionState',
	);
	const mediaProvider = useMemo(
		() => (mediaProviderPromise ? Promise.resolve(mediaProviderPromise) : undefined),
		[mediaProviderPromise],
	);

	const isSelectedAndInteracted = useCallback(
		() =>
			Boolean(
				selected() &&
					(fg('platform_editor_interaction_api_refactor')
						? interactionState !== 'hasNotHadInteraction'
						: hasHadInteraction !== false),
			),
		[hasHadInteraction, interactionState, selected],
	);

	return (
		<MediaSingleNodeNext
			width={width || 0}
			lineLength={lineLength || 0}
			node={node}
			getPos={getPos}
			mediaProvider={mediaProvider}
			contextIdentifierProvider={contextIdentifierProvider}
			mediaOptions={mediaOptions}
			view={view}
			fullWidthMode={fullWidthMode}
			selected={
				fg('platform_editor_no_cursor_on_live_doc_init') ? isSelectedAndInteracted : selected
			}
			eventDispatcher={eventDispatcher}
			addPendingTask={addPendingTask}
			isDrafting={isDrafting}
			targetNodeId={targetNodeId}
			dispatchAnalyticsEvent={dispatchAnalyticsEvent}
			forwardRef={forwardRef}
			pluginInjectionApi={pluginInjectionApi}
			editorDisabled={editorDisabled}
			editorViewMode={viewMode === 'view'}
			editorAppearance={editorAppearance}
		/>
	);
};

class MediaSingleNodeView extends ReactNodeView<MediaSingleNodeViewProps> {
	lastOffsetLeft = 0;
	forceViewUpdate = false;
	selectionType: number | null = null;
	unsubscribeToViewModeChange: (() => void) | undefined;

	createDomRef(): HTMLElement {
		const domRef = document.createElement('div');

		// control the domRef contentEditable attribute based on the editor view mode
		this.unsubscribeToViewModeChange = this.subscribeToViewModeChange(domRef);
		const initialViewMode =
			this.reactComponentProps.pluginInjectionApi?.editorViewMode?.sharedState.currentState()?.mode;
		this.updateDomRefContentEditable(domRef, initialViewMode);

		if (this.reactComponentProps.mediaOptions?.allowPixelResizing) {
			domRef.classList.add('media-extended-resize-experience');
		}
		if (expValEquals('platform_editor_media_card_vc_wrapper_attribute', 'isEnabled', true)) {
			domRef.setAttribute('data-media-vc-wrapper', 'true');
		}

		return domRef;
	}

	getContentDOM() {
		const dom = document.createElement('div');
		dom.classList.add(MEDIA_CONTENT_WRAP_CLASS_NAME);
		return { dom };
	}

	viewShouldUpdate(nextNode: PMNode) {
		if (this.forceViewUpdate) {
			this.forceViewUpdate = false;
			return true;
		}

		if (this.node.attrs !== nextNode.attrs) {
			return true;
		}

		if (this.selectionType !== this.checkAndUpdateSelectionType()) {
			return true;
		}

		if (this.node.childCount !== nextNode.childCount) {
			return true;
		}

		return super.viewShouldUpdate(nextNode);
	}

	subscribeToViewModeChange(domRef: HTMLElement) {
		return this.reactComponentProps.pluginInjectionApi?.editorViewMode?.sharedState.onChange(
			(viewModeState) => {
				this.updateDomRefContentEditable(domRef, viewModeState.nextSharedState?.mode);
			},
		);
	}

	updateDomRefContentEditable(domRef: HTMLElement, editorViewMode?: 'edit' | 'view') {
		// if the editor is in view mode, we should not allow editing
		if (editorViewMode === 'view') {
			domRef.contentEditable = 'false';
			return;
		}

		// if the editor is in edit mode, we should allow editing if the media options allow it
		if (this.reactComponentProps.mediaOptions?.allowMediaSingleEditable) {
			// workaround Chrome bug in https://product-fabric.atlassian.net/browse/ED-5379
			// see also: https://github.com/ProseMirror/prosemirror/issues/884
			domRef.contentEditable = 'true';
		}
	}

	checkAndUpdateSelectionType = () => {
		const getPos = this.getPos as getPosHandlerNode;
		const { selection } = this.view.state;

		/**
		 *  ED-19831
		 *  There is a getPos issue coming from this code. We need to apply this workaround for now and apply a patch
		 *  directly to confluence since this bug is now in production.
		 */
		let pos: number | undefined;
		try {
			pos = getPos ? getPos() : undefined;
		} catch (e) {
			pos = undefined;
		}

		const isNodeSelected = isNodeSelectedOrInRange(
			selection.$anchor.pos,
			selection.$head.pos,
			pos,
			this.node.nodeSize,
		);

		this.selectionType = isNodeSelected;

		return isNodeSelected;
	};

	isNodeSelected = () => {
		this.checkAndUpdateSelectionType();
		return this.selectionType !== null;
	};

	getNodeMediaId(node: PMNode): string | undefined {
		if (node.firstChild) {
			return node.firstChild.attrs.id;
		}
		return undefined;
	}

	stopEvent(event: Event): boolean {
		if (
			this.isNodeSelected() &&
			event instanceof KeyboardEvent &&
			event?.target instanceof HTMLElement
		) {
			const targetType = (event.target as HTMLElement & { type?: string }).type;
			if (event.key === 'Enter' && targetType === 'button') {
				return true;
			}
		}

		return false;
	}

	update(
		node: PMNode,
		decorations: readonly Decoration[],
		_innerDecorations?: DecorationSource,
		isValidUpdate?: (currentNode: PMNode, newNode: PMNode) => boolean,
	) {
		if (!isValidUpdate) {
			isValidUpdate = (currentNode, newNode) =>
				this.getNodeMediaId(currentNode) === this.getNodeMediaId(newNode);
		}
		return super.update(node, decorations, _innerDecorations, isValidUpdate);
	}

	render(props: MediaSingleNodeViewProps, forwardRef?: ForwardRef) {
		const {
			eventDispatcher,
			fullWidthMode,
			providerFactory,
			mediaOptions,
			dispatchAnalyticsEvent,
			pluginInjectionApi,
			editorAppearance,
		} = this.reactComponentProps;

		// getPos is a boolean for marks, since this is a node we know it must be a function
		const getPos = this.getPos as getPosHandlerNode;

		return (
			<WithProviders
				providers={['contextIdentifierProvider']}
				providerFactory={providerFactory}
				renderNode={({ contextIdentifierProvider }) => {
					return (
						<MediaSingleNodeWrapper
							pluginInjectionApi={pluginInjectionApi}
							contextIdentifierProvider={contextIdentifierProvider}
							node={this.node}
							getPos={getPos}
							mediaOptions={mediaOptions}
							view={this.view}
							fullWidthMode={fullWidthMode}
							selected={this.isNodeSelected}
							eventDispatcher={eventDispatcher}
							// Ignored via go/ees005
							// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
							dispatchAnalyticsEvent={dispatchAnalyticsEvent!}
							// Ignored via go/ees005
							// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
							forwardRef={forwardRef!}
							editorAppearance={editorAppearance}
						/>
					);
				}}
			/>
		);
	}

	ignoreMutation() {
		// DOM has changed; recalculate if we need to re-render
		if (this.dom) {
			// Ignored via go/ees005
			// eslint-disable-next-line @atlaskit/editor/no-as-casting
			const offsetLeft = (this.dom as HTMLElement).offsetLeft;

			if (offsetLeft !== this.lastOffsetLeft) {
				this.lastOffsetLeft = offsetLeft;
				this.forceViewUpdate = true;

				this.update(this.node, [], undefined, () => true);
			}
		}

		return true;
	}

	destroy() {
		this.unsubscribeToViewModeChange?.();
	}
}

export const ReactMediaSingleNode =
	(
		portalProviderAPI: PortalProviderAPI,
		eventDispatcher: EventDispatcher,
		providerFactory: ProviderFactory,
		pluginInjectionApi: ExtractInjectionAPI<MediaNextEditorPluginType> | undefined,
		dispatchAnalyticsEvent?: DispatchAnalyticsEvent,
		mediaOptions: MediaOptions = {},
	) =>
	(node: PMNode, view: EditorView, getPos: getPosHandler) => {
		return new MediaSingleNodeView(node, view, getPos, portalProviderAPI, eventDispatcher, {
			eventDispatcher,
			fullWidthMode: mediaOptions.fullWidthEnabled,
			providerFactory,
			mediaOptions,
			dispatchAnalyticsEvent,
			isCopyPasteEnabled: mediaOptions.isCopyPasteEnabled,
			pluginInjectionApi,
			editorAppearance: mediaOptions.editorAppearance,
		}).init();
	};
