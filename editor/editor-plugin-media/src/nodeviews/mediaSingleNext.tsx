/**
 * @jsxRuntime classic
 * @jsx jsx
 * @jsxFrag
 */
import React, { Fragment, type MouseEvent } from 'react';

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
import { usePreviousState } from '@atlaskit/editor-common/hooks';
import {
	calcMediaSinglePixelWidth,
	DEFAULT_IMAGE_HEIGHT,
	DEFAULT_IMAGE_WIDTH,
	ExternalImageBadge,
	getMaxWidthForNestedNode,
	MEDIA_SINGLE_GUTTER_SIZE,
	MediaBadges,
} from '@atlaskit/editor-common/media-single';
import type {
	ContextIdentifierProvider,
	MediaProvider,
} from '@atlaskit/editor-common/provider-factory';
import type { EditorAppearance, ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { MediaSingle } from '@atlaskit/editor-common/ui';
import { browser } from '@atlaskit/editor-common/utils';
import type { InlineCommentPluginState } from '@atlaskit/editor-plugin-annotation';
import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import { NodeSelection } from '@atlaskit/editor-prosemirror/state';
import { findParentNodeOfTypeClosestToPos } from '@atlaskit/editor-prosemirror/utils';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import { getAttrsFromUrl } from '@atlaskit/media-client';
import { fg } from '@atlaskit/platform-feature-flags';
import { editorExperiment } from '@atlaskit/tmp-editor-statsig/experiments';

import type { MediaNextEditorPluginType } from '../mediaPluginType';
import { insertAndSelectCaptionFromMediaSinglePos } from '../pm-plugins/commands/captions';
import type { MediaPluginState } from '../pm-plugins/types';
import { isMediaBlobUrlFromAttrs } from '../pm-plugins/utils/media-common';
import type { ForwardRef, MediaOptions } from '../types';
import { CaptionPlaceholder, CaptionPlaceholderButton } from '../ui/CaptionPlaceholder';
import { CommentBadge, CommentBadgeNextWrapper } from '../ui/CommentBadge';
import ResizableMediaSingle from '../ui/ResizableMediaSingle';
import ResizableMediaSingleNext from '../ui/ResizableMediaSingle/ResizableMediaSingleNext';

import { hasPrivateAttrsChanged } from './helpers';
import { createMediaNodeUpdater } from './mediaNodeUpdater';
import type { MediaNodeUpdater } from './mediaNodeUpdater';
import { MediaSingleNodeSelector } from './styles';
import type { MediaSingleNodeProps } from './types';

const figureWrapperStyles = css({
	margin: 0,
});

type UseMediaNodeUpdaterProps = {
	mediaProvider: MediaProvider | null;
	mediaNode: PMNode;
	mediaSingleNodeProps: Omit<MediaSingleNodeProps, 'mediaPluginState' | 'annotationPluginState'>;
	dispatchAnalyticsEvent: DispatchAnalyticsEvent;
};
const useMediaNodeUpdater = ({
	mediaProvider,
	mediaNode,
	dispatchAnalyticsEvent,
	mediaSingleNodeProps,
}: UseMediaNodeUpdaterProps) => {
	const previousMediaProvider = usePreviousState(mediaProvider);
	const previousMediaNode = usePreviousState(mediaNode);
	const mediaNodeUpdaterRef = React.useRef<MediaNodeUpdater | null>(null);

	const createOrUpdateMediaNodeUpdater = React.useCallback(
		(props: Omit<MediaSingleNodeProps, 'mediaPluginState' | 'annotationPluginState'>) => {
			const mediaChildNode = mediaNode.firstChild;
			const updaterProps = {
				...props,
				isMediaSingle: true,
				node: mediaChildNode ? mediaChildNode : mediaNode,
				dispatchAnalyticsEvent,
			};

			if (!mediaNodeUpdaterRef.current) {
				mediaNodeUpdaterRef.current = createMediaNodeUpdater(updaterProps);
			} else {
				mediaNodeUpdaterRef.current.setProps(updaterProps);
			}
		},
		[mediaNode, dispatchAnalyticsEvent],
	);

	React.useEffect(() => {
		// Forced updates not required on mobile
		if (mediaSingleNodeProps.isCopyPasteEnabled === false) {
			return;
		}

		if (!mediaNodeUpdaterRef.current || previousMediaProvider !== mediaProvider) {
			createOrUpdateMediaNodeUpdater(mediaSingleNodeProps);
			mediaNodeUpdaterRef.current?.updateMediaSingleFileAttrs();
		} else if (
			mediaNode.firstChild &&
			previousMediaNode?.firstChild &&
			mediaNode.firstChild !== previousMediaNode?.firstChild
		) {
			const attrsChanged = hasPrivateAttrsChanged(
				previousMediaNode.firstChild.attrs as MediaAttributes,
				mediaNode.firstChild.attrs,
			);
			if (attrsChanged) {
				createOrUpdateMediaNodeUpdater(mediaSingleNodeProps);
				// We need to call this method on any prop change since attrs can get removed with collab editing
				mediaNodeUpdaterRef.current?.updateMediaSingleFileAttrs();
			}
		}
	}, [
		createOrUpdateMediaNodeUpdater,
		mediaNode,
		mediaProvider,
		mediaSingleNodeProps,
		previousMediaNode,
		previousMediaProvider,
	]);

	return mediaNodeUpdaterRef.current;
};

const mediaAsyncOperations = async (props: {
	mediaNode: PMNode;
	mediaChildNode: PMNode;
	updater: MediaNodeUpdater;
	getPos: () => number | undefined;
	// Ignored via go/ees005
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	addPendingTask: (promise: Promise<any>) => void;
}) => {
	const updatedDimensions = await props.updater.getRemoteDimensions();
	const currentAttrs = props.mediaChildNode.attrs;

	if (
		updatedDimensions &&
		(currentAttrs?.width !== updatedDimensions.width ||
			currentAttrs?.height !== updatedDimensions.height)
	) {
		props.updater.updateDimensions(updatedDimensions);
	}

	if (props.mediaChildNode.attrs.type === 'external' && props.mediaChildNode.attrs.__external) {
		const updatingNode = props.updater.handleExternalMedia(props.getPos);
		props.addPendingTask(updatingNode);
		await updatingNode;
		return;
	}

	const contextId = props.updater.getNodeContextId();
	if (!contextId) {
		await props.updater.updateContextId();
	}

	const shouldNodeBeDeepCopied = await props.updater.shouldNodeBeDeepCopied();

	if (shouldNodeBeDeepCopied) {
		try {
			const copyNode = props.updater.copyNode({
				traceId: props.mediaNode.attrs.__mediaTraceId,
			});
			props.addPendingTask(copyNode);
			await copyNode;
		} catch (e) {}
	}
};

type UseMediaAsyncOperationsProps = {
	mediaNode: PMNode;
	mediaNodeUpdater: MediaNodeUpdater | null;
	// Ignored via go/ees005
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	addPendingTask: (promise: Promise<any>) => void;
	getPos: () => number | undefined;
};
const useMediaAsyncOperations = ({
	mediaNode,
	mediaNodeUpdater,
	addPendingTask,
	getPos,
}: UseMediaAsyncOperationsProps) => {
	React.useEffect(() => {
		if (!mediaNodeUpdater) {
			return;
		}
		// we want the first child of MediaSingle (type "media")
		const childNode = mediaNode.firstChild;
		if (!childNode) {
			return;
		}

		mediaAsyncOperations({
			mediaChildNode: childNode,
			updater: mediaNodeUpdater,
			getPos,
			mediaNode,
			addPendingTask,
		});
	}, [mediaNode, addPendingTask, mediaNodeUpdater, getPos]);
};

const noop = () => {};

/**
 * Keep returning the same ProseMirror Node, unless the node content changed.
 *
 * React uses shallow comparation with `Object.is`,
 * but that can cause multiple re-renders when the same node is given in a different instance.
 *
 * To avoid unnecessary re-renders, this hook uses the `Node.eq` from ProseMirror API to compare
 * previous and new values.
 */
const useLatestMediaNode = (nextMediaNode: PMNode) => {
	const previousMediaNode = usePreviousState(nextMediaNode);
	const [mediaNode, setMediaNode] = React.useState(nextMediaNode);

	React.useEffect(() => {
		if (!previousMediaNode) {
			return;
		}

		if (!previousMediaNode.eq(nextMediaNode)) {
			setMediaNode(nextMediaNode);
		}
	}, [previousMediaNode, nextMediaNode]);

	return mediaNode;
};

const useMediaDimensionsLogic = ({
	childMediaNodeAttrs,
}: {
	childMediaNodeAttrs: MediaADFAttrs;
}) => {
	const { width: originalWidth, height: originalHeight } = childMediaNodeAttrs;

	const isExternalMedia = childMediaNodeAttrs.type === 'external';
	const hasMediaUrlBlob =
		isExternalMedia &&
		typeof childMediaNodeAttrs.url === 'string' &&
		isMediaBlobUrlFromAttrs(childMediaNodeAttrs);
	const urlBlobAttrs = React.useMemo(() => {
		if (!hasMediaUrlBlob) {
			return null;
		}

		return getAttrsFromUrl(childMediaNodeAttrs.url);
	}, [hasMediaUrlBlob, childMediaNodeAttrs]);

	const { width, height } = React.useMemo(() => {
		// original width and height of child media node (scaled)
		let width = originalWidth;
		let height = originalHeight;

		if (isExternalMedia) {
			if (urlBlobAttrs) {
				if (urlBlobAttrs) {
					const { width: urlWidth, height: urlHeight } = urlBlobAttrs;
					width = width || urlWidth;
					height = height || urlHeight;
				}
			}
			if (width === null) {
				width = DEFAULT_IMAGE_WIDTH;
			}

			if (height === null) {
				height = DEFAULT_IMAGE_HEIGHT;
			}
		}

		if (!width || !height) {
			width = DEFAULT_IMAGE_WIDTH;
			height = DEFAULT_IMAGE_HEIGHT;
		}

		return {
			width,
			height,
		};
	}, [originalWidth, originalHeight, isExternalMedia, urlBlobAttrs]);

	return {
		width,
		height,
	};
};

const useUpdateSizeCallback = ({
	mediaNode,
	view,
	getPos,
}: {
	mediaNode: PMNode;
	view: EditorView;
	getPos: () => number | undefined;
}) => {
	const updateSize = React.useCallback(
		(width: number | null, layout: MediaSingleLayout) => {
			const { state, dispatch } = view;

			const pos = getPos();
			if (typeof pos === 'undefined') {
				return;
			}

			const tr = state.tr.setNodeMarkup(pos, undefined, {
				...mediaNode.attrs,
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
		},
		[view, getPos, mediaNode],
	);

	return updateSize;
};

/**
 * This value is used to fallback when widthState is undefined.
 *
 * Previously, the old MediaSingle was ignoring the undefined situation:
 *
 * <MediaSingleNode
 *	  width={widthState!.width}
 *	  lineLength={widthState!.lineLength}
 */
const FALLBACK_MOST_COMMON_WIDTH = 760;

type MediaSingleNodeNextProps = {
	view: EditorView;
	node: PMNode;
	getPos: () => number | undefined;
	eventDispatcher: EventDispatcher;
	width: number;
	selected: Function;
	lineLength: number;
	mediaOptions: MediaOptions;
	mediaProvider?: Promise<MediaProvider>;
	contextIdentifierProvider?: Promise<ContextIdentifierProvider>;
	fullWidthMode?: boolean;
	mediaPluginState: MediaPluginState | undefined;
	annotationPluginState: InlineCommentPluginState | undefined;
	dispatchAnalyticsEvent: DispatchAnalyticsEvent;
	isCopyPasteEnabled?: boolean;
	forwardRef: ForwardRef;
	pluginInjectionApi: ExtractInjectionAPI<MediaNextEditorPluginType> | undefined;
	editorViewMode?: boolean;
	editorDisabled?: boolean;
	editorAppearance?: EditorAppearance;
};
export const MediaSingleNodeNext = (mediaSingleNodeNextProps: MediaSingleNodeNextProps) => {
	const {
		selected,
		getPos,
		node: nextMediaNode,
		mediaOptions,
		fullWidthMode,
		view,
		pluginInjectionApi,
		width: containerWidth,
		lineLength,
		dispatchAnalyticsEvent,
		editorViewMode,
		editorDisabled,
		annotationPluginState,
		editorAppearance,
		mediaProvider: mediaProviderPromise,
		forwardRef,
		contextIdentifierProvider: contextIdentifierProviderPromise,
		mediaPluginState,
	} = mediaSingleNodeNextProps;

	const [mediaProvider, setMediaProvider] = React.useState<MediaProvider | null>(null);
	const [_contextIdentifierProvider, setContextIdentifierProvider] =
		React.useState<ContextIdentifierProvider | null>(null);
	const [viewMediaClientConfig, setViewMediaClientConfig] = React.useState<
		MediaProvider['viewMediaClientConfig'] | undefined
	>();
	const mountedRef = React.useRef(true);
	const pos = getPos();
	const isSelected = selected();
	const contentWidthForLegacyExperience = getMaxWidthForNestedNode(view, getPos()) || lineLength;
	const mediaNode = useLatestMediaNode(nextMediaNode);

	const mediaNodeUpdater = useMediaNodeUpdater({
		mediaNode,
		mediaSingleNodeProps: mediaSingleNodeNextProps,
		mediaProvider,
		dispatchAnalyticsEvent,
	});
	useMediaAsyncOperations({
		mediaNodeUpdater,
		getPos,
		mediaNode,
		addPendingTask: mediaPluginState?.addPendingTask || noop,
	});

	React.useLayoutEffect(() => {
		mountedRef.current = true;

		return () => {
			mountedRef.current = false;
		};
	}, []);

	React.useLayoutEffect(() => {
		if (!mediaProviderPromise) {
			return;
		}

		mediaProviderPromise.then((resolvedProvider) => {
			const { viewMediaClientConfig } = resolvedProvider;
			if (mountedRef.current) {
				setViewMediaClientConfig(viewMediaClientConfig);
				setMediaProvider(resolvedProvider);
			}
		});
	}, [mediaProviderPromise]);

	React.useEffect(() => {
		if (!contextIdentifierProviderPromise) {
			return;
		}

		contextIdentifierProviderPromise.then((provider) => {
			if (mountedRef.current) {
				setContextIdentifierProvider(provider);
			}
		});
	}, [contextIdentifierProviderPromise]);

	React.useEffect(() => {
		// No-op but logging an exposure when an external image is rendered
		// Remove this block when cleaning up platform_editor_add_media_from_url
		if (mediaNode.firstChild?.attrs.type === 'external') {
			if (editorExperiment('add-media-from-url', true)) {
				editorExperiment('add-media-from-url', true, { exposure: true });
			} else {
				editorExperiment('add-media-from-url', false, { exposure: true });
			}
		}
	}, [mediaNode]);

	const {
		layout,
		widthType,
		width: mediaSingleWidthAttribute,
	} = mediaNode.attrs as ExtendedMediaAttributes;
	const childNode = mediaNode.firstChild;
	const childMediaNodeAttrs = React.useMemo(() => {
		return (childNode?.attrs as MediaADFAttrs) || {};
	}, [childNode]);

	const { width, height } = useMediaDimensionsLogic({ childMediaNodeAttrs });

	const updateSize = useUpdateSizeCallback({
		view,
		getPos,
		mediaNode,
	});

	const canResize = React.useMemo(() => {
		if (typeof pos !== 'number') {
			return false;
		}

		const result = Boolean(!!mediaOptions.allowResizing && !editorDisabled && !editorViewMode);
		if (mediaOptions.allowResizingInTables) {
			return result;
		}

		// If resizing not allowed in tables, check parents for tables
		const $pos = view.state.doc.resolve(pos);
		const { table } = view.state.schema.nodes;
		const disabledNode = !!findParentNodeOfTypeClosestToPos($pos, [table]);
		return Boolean(result && !disabledNode);
	}, [mediaOptions, pos, view, editorDisabled, editorViewMode]);

	const badgeOffsetRight: undefined | '2px' | '14px' = React.useMemo(() => {
		if (typeof pos !== 'number') {
			return undefined;
		}

		const $pos = view.state.doc.resolve(pos);
		const { table } = view.state.schema.nodes;
		const foundTableNode = findParentNodeOfTypeClosestToPos($pos, [table]);
		return foundTableNode ? '2px' : '14px';
	}, [pos, view]);

	const shouldShowPlaceholder = React.useMemo(() => {
		const result =
			mediaOptions.allowCaptions &&
			mediaNode.childCount !== 2 &&
			isSelected &&
			view.state.selection instanceof NodeSelection;

		return !editorDisabled && result;
	}, [editorDisabled, mediaOptions.allowCaptions, mediaNode, view, isSelected]);
	const isInsideTable = React.useMemo(() => {
		if (typeof pos !== 'number') {
			return false;
		}

		return findParentNodeOfTypeClosestToPos(view.state.doc.resolve(pos), [
			view.state.schema.nodes.table,
		]);
	}, [pos, view]);

	const currentMediaElement = React.useCallback(() => {
		if (typeof pos !== 'number') {
			return null;
		}

		const mediaNode = view.domAtPos(pos + 1).node;
		return mediaNode instanceof HTMLElement ? mediaNode : null;
	}, [view, pos]);

	const mediaSingleWidth = React.useMemo(() => {
		return calcMediaSinglePixelWidth({
			width: mediaSingleWidthAttribute,
			widthType,
			origWidth: width,
			layout,
			// This will only be used when calculating legacy media single width
			// thus we use the legacy value (exclude table as container node)
			contentWidth: contentWidthForLegacyExperience,
			containerWidth,
			gutterOffset: MEDIA_SINGLE_GUTTER_SIZE,
		});
	}, [
		mediaSingleWidthAttribute,
		widthType,
		width,
		layout,
		contentWidthForLegacyExperience,
		containerWidth,
	]);

	const currentMaxWidth = isSelected
		? pluginInjectionApi?.media?.sharedState.currentState()?.currentMaxWidth
		: undefined;

	const contentWidth = currentMaxWidth || lineLength;

	const isCurrentNodeDrafting = Boolean(
		annotationPluginState?.isDrafting &&
			annotationPluginState?.targetNodeId === mediaNode?.firstChild?.attrs.id,
	);

	const shouldShowExternalMediaBadge = childMediaNodeAttrs.type === 'external';
	const mediaSingleWrapperRef = React.createRef<HTMLDivElement>();
	const captionPlaceHolderRef = React.createRef<HTMLSpanElement>();

	const onMediaSingleClicked = React.useCallback(
		(event: MouseEvent) => {
			// Workaround for iOS 16 Caption selection issue
			// @see https://product-fabric.atlassian.net/browse/MEX-2012
			if (!browser.ios) {
				return;
			}

			if (mediaSingleWrapperRef.current !== event.target) {
				return;
			}

			captionPlaceHolderRef.current?.click();
		},
		[mediaSingleWrapperRef, captionPlaceHolderRef],
	);

	const clickPlaceholder = React.useCallback(() => {
		if (typeof getPos === 'boolean') {
			return;
		}

		insertAndSelectCaptionFromMediaSinglePos(pluginInjectionApi?.analytics?.actions)(
			getPos(),
			mediaNode,
		)(view.state, view.dispatch);
	}, [view, getPos, mediaNode, pluginInjectionApi]);

	const legacySize = React.useMemo(() => {
		return {
			width: mediaSingleWidthAttribute,
			widthType: widthType,
		};
	}, [widthType, mediaSingleWidthAttribute]);

	const MediaChildren = (
		// eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions
		<figure
			ref={mediaSingleWrapperRef}
			css={figureWrapperStyles}
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
			className={MediaSingleNodeSelector}
			onClick={onMediaSingleClicked}
		>
			{editorExperiment('add-media-from-url', true) && (
				<MediaBadges
					mediaElement={currentMediaElement()}
					mediaHeight={height}
					mediaWidth={width}
					extendedResizeOffset={
						fg('platform_editor_media_extended_resize_experience') && !isInsideTable
					}
				>
					{({ badgeSize, visible }: { badgeSize: 'small' | 'medium'; visible: boolean }) => (
						<>
							{fg('platform_editor_hide_external_media_badge')
								? visible && (
										<ExternalImageBadge
											badgeSize={badgeSize}
											type={childMediaNodeAttrs.type}
											url={
												childMediaNodeAttrs.type === 'external'
													? childMediaNodeAttrs.url
													: undefined
											}
										/>
									)
								: shouldShowExternalMediaBadge &&
									visible && <ExternalImageBadge badgeSize={badgeSize} />}
							{mediaOptions.allowCommentsOnMedia && (
								<CommentBadgeNextWrapper
									view={view}
									api={pluginInjectionApi as ExtractInjectionAPI<MediaNextEditorPluginType>}
									mediaNode={mediaNode?.firstChild}
									getPos={getPos}
									isDrafting={isCurrentNodeDrafting}
									badgeSize={badgeSize}
								/>
							)}
						</>
					)}
				</MediaBadges>
			)}
			{!editorExperiment('add-media-from-url', true) && mediaOptions.allowCommentsOnMedia && (
				<CommentBadge
					view={view}
					api={pluginInjectionApi as ExtractInjectionAPI<MediaNextEditorPluginType>}
					mediaNode={mediaNode?.firstChild}
					badgeOffsetRight={badgeOffsetRight}
					getPos={getPos}
					isDrafting={isCurrentNodeDrafting}
				/>
			)}
			<div ref={forwardRef} />
			{shouldShowPlaceholder &&
				(fg('platform_editor_typography_ugc') ? (
					<CaptionPlaceholderButton
						// platform_editor_typography_ugc clean up
						// remove typecasting
						ref={captionPlaceHolderRef as React.RefObject<HTMLButtonElement>}
						onClick={clickPlaceholder}
					/>
				) : (
					<CaptionPlaceholder ref={captionPlaceHolderRef} onClick={clickPlaceholder} />
				))}
		</figure>
	);

	return (
		<Fragment>
			{canResize ? (
				fg('platform_editor_media_extended_resize_experience') ? (
					<ResizableMediaSingleNext
						view={view}
						getPos={getPos}
						updateSize={updateSize}
						gridSize={12}
						viewMediaClientConfig={viewMediaClientConfig}
						allowBreakoutSnapPoints={mediaOptions && mediaOptions.allowBreakoutSnapPoints}
						selected={isSelected}
						dispatchAnalyticsEvent={dispatchAnalyticsEvent}
						pluginInjectionApi={pluginInjectionApi}
						layout={layout}
						width={width}
						height={height}
						containerWidth={containerWidth}
						lineLength={contentWidth || FALLBACK_MOST_COMMON_WIDTH}
						fullWidthMode={fullWidthMode}
						hasFallbackContainer={false}
						mediaSingleWidth={mediaSingleWidth}
						editorAppearance={editorAppearance}
						showLegacyNotification={widthType !== 'pixel'}
						forceHandlePositioning={mediaOptions?.forceHandlePositioning}
					>
						{MediaChildren}
					</ResizableMediaSingleNext>
				) : (
					<ResizableMediaSingle
						view={view}
						getPos={getPos}
						updateSize={updateSize}
						gridSize={12}
						viewMediaClientConfig={viewMediaClientConfig}
						allowBreakoutSnapPoints={mediaOptions && mediaOptions.allowBreakoutSnapPoints}
						selected={isSelected}
						dispatchAnalyticsEvent={dispatchAnalyticsEvent}
						pluginInjectionApi={pluginInjectionApi}
						layout={layout}
						width={width}
						height={height}
						containerWidth={containerWidth}
						fullWidthMode={fullWidthMode}
						hasFallbackContainer={false}
						mediaSingleWidth={mediaSingleWidth}
						editorAppearance={editorAppearance}
						lineLength={contentWidthForLegacyExperience || FALLBACK_MOST_COMMON_WIDTH}
						pctWidth={mediaSingleWidthAttribute}
					>
						{MediaChildren}
					</ResizableMediaSingle>
				)
			) : (
				<MediaSingle
					layout={layout}
					width={width}
					height={height}
					containerWidth={containerWidth}
					fullWidthMode={fullWidthMode}
					hasFallbackContainer={false}
					editorAppearance={editorAppearance}
					pctWidth={mediaSingleWidthAttribute}
					lineLength={lineLength || FALLBACK_MOST_COMMON_WIDTH}
					size={legacySize}
				>
					{MediaChildren}
				</MediaSingle>
			)}
		</Fragment>
	);
};
