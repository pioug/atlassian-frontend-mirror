/**
 * @jsxRuntime classic
 * @jsx jsx
 * @jsxFrag
 */
import type { MouseEvent } from 'react';
import React, { Component, Fragment, useCallback, useMemo } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';

import type {
	ExtendedMediaAttributes,
	MediaADFAttrs,
	MediaAttributes,
	RichMediaLayout as MediaSingleLayout,
} from '@atlaskit/adf-schema';
import type { DispatchAnalyticsEvent } from '@atlaskit/editor-common/analytics';
import type { EventDispatcher } from '@atlaskit/editor-common/event-dispatcher';
import {
	sharedPluginStateHookMigratorFactory,
	useSharedPluginState,
} from '@atlaskit/editor-common/hooks';
import { captionMessages } from '@atlaskit/editor-common/media';
import {
	calcMediaSinglePixelWidth,
	DEFAULT_IMAGE_HEIGHT,
	DEFAULT_IMAGE_WIDTH,
	ExternalImageBadge,
	getMaxWidthForNestedNode,
	MEDIA_SINGLE_GUTTER_SIZE,
	MediaBadges,
} from '@atlaskit/editor-common/media-single';
import type { PortalProviderAPI } from '@atlaskit/editor-common/portal';
import { WithProviders } from '@atlaskit/editor-common/provider-factory';
import type {
	ContextIdentifierProvider,
	ProviderFactory,
} from '@atlaskit/editor-common/provider-factory';
import ReactNodeView from '@atlaskit/editor-common/react-node-view';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { MediaSingle } from '@atlaskit/editor-common/ui';
import { useSharedPluginStateSelector } from '@atlaskit/editor-common/use-shared-plugin-state-selector';
import {
	browser,
	isNodeSelectedOrInRange,
	setNodeSelection,
	setTextSelection,
} from '@atlaskit/editor-common/utils';
import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import { NodeSelection } from '@atlaskit/editor-prosemirror/state';
import { findParentNodeOfTypeClosestToPos } from '@atlaskit/editor-prosemirror/utils';
import type { Decoration, DecorationSource, EditorView } from '@atlaskit/editor-prosemirror/view';
import { CellSelection } from '@atlaskit/editor-tables/cell-selection';
import type { CardEvent } from '@atlaskit/media-card';
import { getAttrsFromUrl } from '@atlaskit/media-client';
import type { MediaClientConfig } from '@atlaskit/media-core';
import { fg } from '@atlaskit/platform-feature-flags';

import type { MediaNextEditorPluginType } from '../mediaPluginType';
import { insertAndSelectCaptionFromMediaSinglePos } from '../pm-plugins/commands/captions';
import { MEDIA_CONTENT_WRAP_CLASS_NAME } from '../pm-plugins/main';
import { isMediaBlobUrlFromAttrs } from '../pm-plugins/utils/media-common';
import type { ForwardRef, getPosHandler, getPosHandlerNode, MediaOptions } from '../types';
import { CaptionPlaceholder, CaptionPlaceholderButton } from '../ui/CaptionPlaceholder';
import { CommentBadge, CommentBadgeNextWrapper } from '../ui/CommentBadge';
import ResizableMediaSingle from '../ui/ResizableMediaSingle';
import ResizableMediaSingleNext from '../ui/ResizableMediaSingle/ResizableMediaSingleNext';

import { hasPrivateAttrsChanged } from './helpers';
import { MediaNodeUpdater } from './mediaNodeUpdater';
import { MediaSingleNodeNext } from './mediaSingleNext';
import { MediaSingleNodeSelector } from './styles';
import type { MediaSingleNodeProps, MediaSingleNodeViewProps } from './types';

const figureWrapperStyles = css({
	margin: 0,
});
interface MediaSingleNodeState {
	width?: number;
	height?: number;
	viewMediaClientConfig?: MediaClientConfig;
	contextIdentifierProvider?: ContextIdentifierProvider;
	isCopying: boolean;
}

// eslint-disable-next-line @repo/internal/deprecations/deprecation-ticket-required -- Ignored via go/ED-25883
/*
 * @deprecated Please use the MediaSingleNodeNext
 */
// eslint-disable-next-line @repo/internal/react/no-class-components
export default class MediaSingleNode extends Component<MediaSingleNodeProps, MediaSingleNodeState> {
	static defaultProps: Partial<MediaSingleNodeProps> = {
		mediaOptions: {},
	};
	static displayName = 'MediaSingleNode';
	mediaNodeUpdater: MediaNodeUpdater | null = null;

	state: MediaSingleNodeState = {
		width: undefined,
		height: undefined,
		viewMediaClientConfig: undefined,
		isCopying: false,
	};

	mediaSingleWrapperRef = React.createRef<HTMLDivElement>();
	// platform_editor_typography_ugc clean up
	// remove HTMLSpanElement type
	captionPlaceHolderRef = React.createRef<HTMLSpanElement | HTMLButtonElement>();

	createOrUpdateMediaNodeUpdater = (props: MediaSingleNodeProps) => {
		const node = this.props.node.firstChild;
		const updaterProps = {
			...props,
			isMediaSingle: true,
			node: node ? (node as PMNode) : this.props.node,
			dispatchAnalyticsEvent: this.props.dispatchAnalyticsEvent,
		};
		if (!this.mediaNodeUpdater) {
			this.mediaNodeUpdater = new MediaNodeUpdater(updaterProps);
		} else {
			this.mediaNodeUpdater?.setProps(updaterProps);
		}
	};

	// Ignored via go/ees005
	// eslint-disable-next-line react/no-unsafe
	UNSAFE_componentWillReceiveProps(nextProps: MediaSingleNodeProps) {
		if (!this.mediaNodeUpdater) {
			this.createOrUpdateMediaNodeUpdater(nextProps);
		}
		if (nextProps.mediaProvider !== this.props.mediaProvider) {
			this.setViewMediaClientConfig(nextProps);
		}

		// Forced updates not required on mobile
		if (nextProps.isCopyPasteEnabled === false) {
			return;
		}

		if (nextProps.mediaProvider !== this.props.mediaProvider) {
			this.createOrUpdateMediaNodeUpdater(nextProps);
			this.mediaNodeUpdater?.updateMediaSingleFileAttrs();
		} else if (nextProps.node.firstChild && this.props.node.firstChild) {
			const attrsChanged = hasPrivateAttrsChanged(
				this.props.node.firstChild.attrs as MediaAttributes,
				nextProps.node.firstChild.attrs,
			);
			if (attrsChanged) {
				this.createOrUpdateMediaNodeUpdater(nextProps);
				// We need to call this method on any prop change since attrs can get removed with collab editing
				this.mediaNodeUpdater?.updateMediaSingleFileAttrs();
			}
		}
	}

	setViewMediaClientConfig = async (props: MediaSingleNodeProps) => {
		const mediaProvider = await props.mediaProvider;
		if (mediaProvider) {
			const viewMediaClientConfig = mediaProvider.viewMediaClientConfig;

			this.setState({
				viewMediaClientConfig,
			});
		}
	};

	updateMediaNodeAttributes = async (props: MediaSingleNodeProps) => {
		this.createOrUpdateMediaNodeUpdater(props);
		const { addPendingTask } = this.props;
		if (!addPendingTask) {
			return;
		}

		// we want the first child of MediaSingle (type "media")
		const node = this.props.node.firstChild;
		if (!node) {
			return;
		}

		const updatedDimensions = await this.mediaNodeUpdater?.getRemoteDimensions();
		const currentAttrs = this.props.node.firstChild?.attrs;
		if (
			updatedDimensions &&
			(currentAttrs?.width !== updatedDimensions.width ||
				currentAttrs?.height !== updatedDimensions.height)
		) {
			this.mediaNodeUpdater?.updateDimensions(updatedDimensions);
		}

		if (node.attrs.type === 'external' && node.attrs.__external) {
			// Ignored via go/ees005
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			const updatingNode = this.mediaNodeUpdater!.handleExternalMedia(this.props.getPos);
			addPendingTask(updatingNode);
			await updatingNode;
			return;
		}

		const contextId = this.mediaNodeUpdater?.getNodeContextId();
		if (!contextId) {
			await this.mediaNodeUpdater?.updateContextId();
		}

		const shouldNodeBeDeepCopied = await this.mediaNodeUpdater?.shouldNodeBeDeepCopied();

		if (shouldNodeBeDeepCopied) {
			this.setState({ isCopying: true });
			try {
				// Ignored via go/ees005
				// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
				const copyNode = this.mediaNodeUpdater!.copyNode({
					traceId: node.attrs.__mediaTraceId,
				});
				addPendingTask(copyNode);
				await copyNode;
			} catch (e) {
				// if copyNode fails, let's set isCopying false so we can show the eventual error
				this.setState({ isCopying: false });
			}
		}
	};

	async componentDidMount() {
		const { contextIdentifierProvider } = this.props;
		this.createOrUpdateMediaNodeUpdater(this.props);

		await Promise.all([
			this.setViewMediaClientConfig(this.props),
			this.updateMediaNodeAttributes(this.props),
		]);

		this.setState({
			contextIdentifierProvider: await contextIdentifierProvider,
		});
	}

	selectMediaSingle = ({ event }: CardEvent) => {
		const propPos = this.props.getPos();

		if (typeof propPos !== 'number') {
			return;
		}

		// We need to call "stopPropagation" here in order to prevent the browser from navigating to
		// another URL if the media node is wrapped in a link mark.
		event.stopPropagation();

		const { state } = this.props.view;

		if (event.shiftKey) {
			// don't select text if there is current selection in a table (as this would override selected cells)
			if (state.selection instanceof CellSelection) {
				return;
			}

			setTextSelection(
				this.props.view,
				state.selection.from < propPos ? state.selection.from : propPos,
				// + 3 needed for offset of the media inside mediaSingle and cursor to make whole mediaSingle selected
				state.selection.to > propPos ? state.selection.to : propPos + 3,
			);
		} else {
			setNodeSelection(this.props.view, propPos);
		}
	};

	updateSize = (width: number | null, layout: MediaSingleLayout) => {
		const { state, dispatch } = this.props.view;
		const pos = this.props.getPos();
		if (typeof pos === 'undefined') {
			return;
		}

		const tr = state.tr.setNodeMarkup(pos, undefined, {
			...this.props.node.attrs,
			layout,
			width,
			widthType: 'pixel',
		});
		tr.setMeta('scrollIntoView', false);
		/**
		 * Any changes to attributes of a node count the node as "recreated" in Prosemirror[1]
		 * This makes it so Prosemirror resets the selection to the child i.e. "media" instead of "media-single"
		 * The recommended fix is to reset the selection.[2]
		 *
		 * [1] https://discuss.prosemirror.net/t/setnodemarkup-loses-current-nodeselection/976
		 * [2] https://discuss.prosemirror.net/t/setnodemarkup-and-deselect/3673
		 */
		tr.setSelection(NodeSelection.create(tr.doc, pos));
		return dispatch(tr);
	};

	onMediaSingleClicked = (event: MouseEvent) => {
		// Workaround for iOS 16 Caption selection issue
		// @see https://product-fabric.atlassian.net/browse/MEX-2012
		if (!browser.ios) {
			return;
		}

		if (this.mediaSingleWrapperRef.current !== event.target) {
			return;
		}

		this.captionPlaceHolderRef.current?.click();
	};

	render() {
		const {
			selected,
			getPos,
			node,
			mediaOptions,
			fullWidthMode,
			view: { state },
			view,
			pluginInjectionApi,
			width: containerWidth,
			lineLength,
			dispatchAnalyticsEvent,
			editorViewMode,
			editorDisabled,
			isDrafting,
			targetNodeId,
			editorAppearance,
		} = this.props;

		const {
			layout,
			widthType,
			width: mediaSingleWidthAttribute,
		} = node.attrs as ExtendedMediaAttributes;
		const childNode = node.firstChild;
		const attrs = (childNode?.attrs as MediaADFAttrs) || {};

		// original width and height of child media node (scaled)
		let { width, height } = attrs;

		if (attrs.type === 'external') {
			if (isMediaBlobUrlFromAttrs(attrs)) {
				const urlAttrs = getAttrsFromUrl(attrs.url);
				if (urlAttrs) {
					const { width: urlWidth, height: urlHeight } = urlAttrs;
					width = width || urlWidth;
					height = height || urlHeight;
				}
			}
			const { width: stateWidth, height: stateHeight } = this.state;

			if (width === null) {
				width = stateWidth || DEFAULT_IMAGE_WIDTH;
			}

			if (height === null) {
				height = stateHeight || DEFAULT_IMAGE_HEIGHT;
			}
		}

		if (!width || !height) {
			width = DEFAULT_IMAGE_WIDTH;
			height = DEFAULT_IMAGE_HEIGHT;
		}

		const isSelected = selected();

		const currentMaxWidth = isSelected
			? pluginInjectionApi?.media?.sharedState.currentState()?.currentMaxWidth
			: undefined;

		const contentWidthForLegacyExperience = getMaxWidthForNestedNode(view, getPos()) || lineLength;
		const contentWidth = currentMaxWidth || lineLength;

		const mediaSingleProps = {
			layout,
			width,
			height,
			containerWidth: containerWidth,
			lineLength: contentWidth,
			fullWidthMode,
			hasFallbackContainer: false,
			mediaSingleWidth: calcMediaSinglePixelWidth({
				width: mediaSingleWidthAttribute,
				widthType,
				origWidth: width,
				layout,
				// This will only be used when calculating legacy media single width
				// thus we use the legacy value (exclude table as container node)
				contentWidth: contentWidthForLegacyExperience,
				containerWidth,
				gutterOffset: MEDIA_SINGLE_GUTTER_SIZE,
			}),
			allowCaptions: mediaOptions.allowCaptions,
			editorAppearance,
		};

		const resizableMediaSingleProps = {
			view: view,
			getPos: getPos,
			updateSize: this.updateSize,
			gridSize: 12,
			viewMediaClientConfig: this.state.viewMediaClientConfig,
			allowBreakoutSnapPoints: mediaOptions && mediaOptions.allowBreakoutSnapPoints,
			selected: isSelected,
			dispatchAnalyticsEvent: dispatchAnalyticsEvent,
			pluginInjectionApi: pluginInjectionApi,
			forceHandlePositioning: mediaOptions?.forceHandlePositioning,
			...mediaSingleProps,
		};

		let canResize = !!this.props.mediaOptions.allowResizing && !editorDisabled && !editorViewMode;

		if (!this.props.mediaOptions.allowResizingInTables) {
			// If resizing not allowed in tables, check parents for tables
			const pos = getPos();
			if (pos) {
				const $pos = state.doc.resolve(pos);
				const { table } = state.schema.nodes;
				const disabledNode = !!findParentNodeOfTypeClosestToPos($pos, [table]);
				canResize = canResize && !disabledNode;
			}
		}
		const isBadgePosOffsetRight = () => {
			const pos = getPos();
			if (pos !== undefined) {
				const $pos = view.state.doc.resolve(pos);
				const { table } = view.state.schema.nodes;
				const foundTableNode = findParentNodeOfTypeClosestToPos($pos, [table]);
				return foundTableNode ? '2px' : '14px';
			}
		};

		const badgeOffsetRight = isBadgePosOffsetRight();

		let shouldShowPlaceholder =
			mediaOptions.allowCaptions &&
			node.childCount !== 2 &&
			isSelected &&
			state.selection instanceof NodeSelection;

		shouldShowPlaceholder = !editorDisabled && shouldShowPlaceholder;

		const isCurrentNodeDrafting = Boolean(
			isDrafting && targetNodeId === node?.firstChild?.attrs.id,
		);

		const pos = getPos();
		const isInsideTable =
			pos !== undefined &&
			findParentNodeOfTypeClosestToPos(state.doc.resolve(pos), [state.schema.nodes.table]);

		const currentMediaElement = () => {
			if (pos !== undefined) {
				const mediaNode = view.domAtPos(pos + 1).node;
				return mediaNode instanceof HTMLElement ? mediaNode : null;
			}
			return null;
		};

		const MediaChildren = (
			// eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions
			<figure
				ref={this.mediaSingleWrapperRef}
				css={figureWrapperStyles}
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
				className={MediaSingleNodeSelector}
				onClick={this.onMediaSingleClicked}
			>
				{fg('platform_editor_add_media_from_url_rollout') && (
					<MediaBadges
						mediaElement={currentMediaElement()}
						mediaHeight={height}
						mediaWidth={width}
						extendedResizeOffset={mediaOptions.allowPixelResizing && !isInsideTable}
					>
						{({ visible }: { visible: boolean }) => (
							<>
								{visible && (
									<ExternalImageBadge
										type={attrs.type}
										url={attrs.type === 'external' ? attrs.url : undefined}
									/>
								)}
								{mediaOptions.allowCommentsOnMedia && (
									<CommentBadgeNextWrapper
										view={view}
										api={pluginInjectionApi as ExtractInjectionAPI<MediaNextEditorPluginType>}
										mediaNode={node?.firstChild}
										getPos={getPos}
										isDrafting={isCurrentNodeDrafting}
									/>
								)}
							</>
						)}
					</MediaBadges>
				)}
				{!fg('platform_editor_add_media_from_url_rollout') && mediaOptions.allowCommentsOnMedia && (
					<CommentBadge
						view={view}
						api={pluginInjectionApi as ExtractInjectionAPI<MediaNextEditorPluginType>}
						mediaNode={node?.firstChild}
						badgeOffsetRight={badgeOffsetRight}
						getPos={getPos}
						isDrafting={isCurrentNodeDrafting}
					/>
				)}
				<div ref={this.props.forwardRef} />
				{shouldShowPlaceholder &&
					(fg('platform_editor_typography_ugc') ? (
						<CaptionPlaceholderButton
							// platform_editor_typography_ugc clean up
							// remove typecasting
							ref={this.captionPlaceHolderRef as React.RefObject<HTMLButtonElement>}
							onClick={this.clickPlaceholder}
							placeholderMessage={
								mediaOptions.allowImagePreview
									? captionMessages.placeholderWithDoubleClickPrompt
									: captionMessages.placeholder
							}
						/>
					) : (
						<CaptionPlaceholder
							ref={this.captionPlaceHolderRef}
							onClick={this.clickPlaceholder}
							placeholderMessage={
								mediaOptions.allowImagePreview
									? captionMessages.placeholderWithDoubleClickPrompt
									: captionMessages.placeholder
							}
						/>
					))}
			</figure>
		);

		return (
			<Fragment>
				{canResize ? (
					mediaOptions.allowPixelResizing ? (
						<ResizableMediaSingleNext
							// Ignored via go/ees005
							// eslint-disable-next-line react/jsx-props-no-spreading
							{...resizableMediaSingleProps}
							showLegacyNotification={widthType !== 'pixel'}
						>
							{MediaChildren}
						</ResizableMediaSingleNext>
					) : (
						<ResizableMediaSingle
							// Ignored via go/ees005
							// eslint-disable-next-line react/jsx-props-no-spreading
							{...resizableMediaSingleProps}
							lineLength={contentWidthForLegacyExperience}
							pctWidth={mediaSingleWidthAttribute}
						>
							{MediaChildren}
						</ResizableMediaSingle>
					)
				) : (
					<MediaSingle
						// Ignored via go/ees005
						// eslint-disable-next-line react/jsx-props-no-spreading
						{...mediaSingleProps}
						pctWidth={mediaSingleWidthAttribute}
						size={{ width: mediaSingleWidthAttribute, widthType: widthType }}
					>
						{MediaChildren}
					</MediaSingle>
				)}
			</Fragment>
		);
	}

	private clickPlaceholder = () => {
		const { view, getPos, node, pluginInjectionApi } = this.props;

		if (typeof getPos === 'boolean') {
			return;
		}

		insertAndSelectCaptionFromMediaSinglePos(pluginInjectionApi?.analytics?.actions)(
			getPos(),
			node,
		)(view.state, view.dispatch);
	};
}

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

	if (
		fg('platform_editor_react18_phase2__media_single') ||
		fg('platform_editor_react18_phase2__media_single_jira')
	) {
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
	}

	return (
		<MediaSingleNode
			width={width}
			lineLength={lineLength}
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
