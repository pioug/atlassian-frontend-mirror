import React, { Component } from 'react';

import type { UnbindFn } from 'bind-event-listener';
import { bind } from 'bind-event-listener';
import memoizeOne from 'memoize-one';

import { MEDIA_CONTEXT } from '@atlaskit/analytics-namespaced-context/MediaAnalyticsContext';
import AnalyticsContext from '@atlaskit/analytics-next/AnalyticsContext';
import { ACTION, ACTION_SUBJECT, EVENT_TYPE } from '@atlaskit/editor-common/analytics';
import type {
	ContextIdentifierProvider,
	MediaProvider,
} from '@atlaskit/editor-common/provider-factory';
import { areToolbarFlagsEnabled } from '@atlaskit/editor-common/toolbar-flag-check';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import type { ImageLoaderProps } from '@atlaskit/editor-common/utils';
import { setNodeSelection, setTextSelection, withImageLoader } from '@atlaskit/editor-common/utils';
import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import { findParentNodeClosestToPos } from '@atlaskit/editor-prosemirror/utils';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import { CellSelection } from '@atlaskit/editor-tables/cell-selection';
import Card from '@atlaskit/media-card/cardLoader';
import { CardLoading } from '@atlaskit/media-card/cardLoading';
import type { CardDimensions, CardEvent, CardOnClickCallback } from '@atlaskit/media-card/types';
import type { Identifier } from '@atlaskit/media-client';
import type { SSR } from '@atlaskit/media-common';
import type { NumericalCardDimensions } from '@atlaskit/media-common/main-types';
import type { MediaClientConfig } from '@atlaskit/media-core/auth';
import { isExperimentEnabled } from '@atlaskit/platform-feature-experiments/is-experiment-enabled';
import { fg } from '@atlaskit/platform-feature-flags/fg';
import { editorExperiment } from '@atlaskit/tmp-editor-statsig/editor-experiment';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';
import { expValEqualsNoExposure } from '@atlaskit/tmp-editor-statsig/exp-val-equals-no-exposure';

import type { MediaNextEditorPluginType } from '../../mediaPluginType';
import { stateKey as mediaStateKey } from '../../pm-plugins/plugin-key';
import type { MediaPluginState } from '../../pm-plugins/types';
import type {
	MediaOptions,
	MediaRenderEventPayload,
	getPosHandler as ProsemirrorGetPosHandler,
	ReactNodeProps,
} from '../../types';
import { GeneratedMediaReveal } from '../../ui/GeneratedMediaReveal';
import { createMediaNodeUpdater } from '../mediaNodeUpdater';
import { MediaCardWrapper } from '../styles';

// This is being used by DropPlaceholder now
export const MEDIA_HEIGHT = 125;
export const FILE_WIDTH = 156;

export interface MediaNodeProps extends ReactNodeProps, ImageLoaderProps {
	api?: ExtractInjectionAPI<MediaNextEditorPluginType>;
	contextIdentifierProvider?: Promise<ContextIdentifierProvider>;
	getPos: ProsemirrorGetPosHandler;
	isAIGenerating?: boolean;
	isCwrAIGenerating?: boolean;
	isLoading?: boolean;
	isMediaSingle?: boolean;
	isViewOnly?: boolean;
	maxDimensions: CardDimensions;
	mediaOptions?: MediaOptions;
	mediaProvider?: Promise<MediaProvider>;
	node: PMNode;
	onClick?: CardOnClickCallback;
	originalDimensions: NumericalCardDimensions;
	pluginInjectionApi: ExtractInjectionAPI<MediaNextEditorPluginType> | undefined;
	syncProvider?: MediaProvider;
	view: EditorView;
}

interface MediaNodeState {
	contextIdentifierProvider?: ContextIdentifierProvider;
	/** File the card reported a terminal error for. Keyed by id, as `previewRenderedFileId`. */
	failedFileId?: string;
	/**
	 * File the card last reported a rendered preview for. Keyed by id rather than a boolean,
	 * because the node's media can be replaced without remounting this component.
	 */
	previewRenderedFileId?: string;
	viewAndUploadMediaClientConfig?: MediaClientConfig;
	viewMediaClientConfig?: MediaClientConfig;
}

// eslint-disable-next-line @repo/internal/react/no-class-components
export class MediaNode extends Component<MediaNodeProps, MediaNodeState> {
	private readonly mediaInstance = {};
	private mediaPluginState: MediaPluginState | undefined;

	state: MediaNodeState = {};
	videoControlsWrapperRef: React.RefObject<HTMLDivElement> = React.createRef<HTMLDivElement>();
	unbindKeyDown: UnbindFn | null = null;

	constructor(props: MediaNodeProps) {
		super(props);
		const { view, syncProvider } = this.props;
		this.mediaPluginState = mediaStateKey.getState(view.state);

		// Initialize state from syncProvider (available on both server and client for SSR)
		if (syncProvider) {
			this.state = {
				viewMediaClientConfig: syncProvider.viewMediaClientConfig,
				viewAndUploadMediaClientConfig: syncProvider.viewAndUploadMediaClientConfig,
			};
		}
	}

	shouldComponentUpdate(nextProps: MediaNodeProps, nextState: MediaNodeState): boolean {
		const hasNewViewMediaClientConfig =
			!this.state.viewMediaClientConfig && nextState.viewMediaClientConfig;

		const hasNewViewAndUploadMediaClientConfig =
			!this.state.viewAndUploadMediaClientConfig && nextState.viewAndUploadMediaClientConfig;

		if (
			this.props.selected !== nextProps.selected ||
			this.props.node.attrs.id !== nextProps.node.attrs.id ||
			this.props.node.attrs.collection !== nextProps.node.attrs.collection ||
			// Patched in asynchronously once media services report the real size.
			this.props.node.attrs.width !== nextProps.node.attrs.width ||
			this.props.node.attrs.height !== nextProps.node.attrs.height ||
			this.props.isAIGenerating !== nextProps.isAIGenerating ||
			this.props.isCwrAIGenerating !== nextProps.isCwrAIGenerating ||
			this.props.maxDimensions.height !== nextProps.maxDimensions.height ||
			this.props.maxDimensions.width !== nextProps.maxDimensions.width ||
			this.props.contextIdentifierProvider !== nextProps.contextIdentifierProvider ||
			this.props.isLoading !== nextProps.isLoading ||
			this.props.isViewOnly !== nextProps.isViewOnly ||
			this.props.mediaProvider !== nextProps.mediaProvider ||
			this.props.syncProvider !== nextProps.syncProvider ||
			this.getDataConsumerSource() !== this.getDataConsumerSource(nextProps) ||
			this.props.mediaOptions?.onMediaRenderEvent !== nextProps.mediaOptions?.onMediaRenderEvent ||
			this.state.previewRenderedFileId !== nextState.previewRenderedFileId ||
			this.state.failedFileId !== nextState.failedFileId ||
			hasNewViewMediaClientConfig ||
			hasNewViewAndUploadMediaClientConfig
		) {
			return true;
		}
		return false;
	}

	private getDataConsumerMark = () =>
		fg('cc-maui-add-mark-for-remix-generated-images')
			? this.props.node.marks.find((m) => m.type.name === 'dataConsumer')
			: undefined;

	private getDataConsumerSource = (props: MediaNodeProps = this.props): string | undefined =>
		props.node.marks.find((mark) => mark.type.name === 'dataConsumer')?.attrs.sources?.[0];

	private emitMediaRenderEvent = (
		event: MediaRenderEventPayload,
		props: MediaNodeProps = this.props,
	): void => {
		props.mediaOptions?.onMediaRenderEvent?.({
			...event,
			dataConsumerSource: this.getDataConsumerSource(props),
			mediaId: props.node.attrs.id,
			mediaInstance: this.mediaInstance,
		});
	};

	async componentDidMount(): Promise<void> {
		this.handleNewNode(this.props);
		this.emitMediaRenderEvent({ type: 'mounted' });

		const { node, pluginInjectionApi } = this.props;
		const dataConsumerMark = this.getDataConsumerMark();
		const infographicType = dataConsumerMark?.attrs.sources?.[0];
		if (infographicType) {
			pluginInjectionApi?.analytics?.actions.fireAnalyticsEvent({
				action: ACTION.RENDERED,
				actionSubject: ACTION_SUBJECT.MEDIA,
				actionSubjectId: node.attrs.id,
				eventType: EVENT_TYPE.TRACK,
				attributes: {
					infographicType,
					pageMode: 'edit',
					mediaId: node.attrs.id,
				},
			});
		}

		const { contextIdentifierProvider } = this.props;
		this.setState({
			contextIdentifierProvider: await contextIdentifierProvider,
		});

		await this.setViewMediaClientConfig();
	}

	componentWillUnmount(): void {
		const { node } = this.props;
		this.emitMediaRenderEvent({ type: 'unmounted' });
		this.mediaPluginState?.handleMediaNodeUnmount(node);
		if (this.unbindKeyDown && typeof this.unbindKeyDown === 'function') {
			this.unbindKeyDown();
		}
	}

	componentDidUpdate(prevProps: Readonly<MediaNodeProps>): void {
		if (
			prevProps.node.attrs.id !== this.props.node.attrs.id ||
			this.getDataConsumerSource(prevProps) !== this.getDataConsumerSource() ||
			prevProps.mediaOptions?.onMediaRenderEvent !== this.props.mediaOptions?.onMediaRenderEvent
		) {
			this.emitMediaRenderEvent({ type: 'unmounted' }, prevProps);
			this.emitMediaRenderEvent({ type: 'mounted' });
		}

		if (prevProps.node.attrs.id !== this.props.node.attrs.id) {
			this.mediaPluginState?.handleMediaNodeUnmount(prevProps.node);
			this.handleNewNode(this.props);
		}

		this.mediaPluginState?.updateElement();
		this.setViewMediaClientConfig();
		// this.videoControlsWrapperRef is null on componentDidMount. We need to wait until it has value
		if (this.videoControlsWrapperRef && this.videoControlsWrapperRef.current) {
			if (!this.mediaPluginState?.videoControlsWrapperRef) {
				this.bindKeydown();
				this.mediaPluginState?.updateAndDispatch({
					videoControlsWrapperRef: this.videoControlsWrapperRef.current,
				});
			}
		}
	}

	bindKeydown(): void {
		const onKeydown = (event: KeyboardEvent) => {
			if (event.key === 'Tab') {
				// Add focus trap for controls panel
				let firstElement: HTMLElement;
				let lastElement: HTMLElement;
				const focusableElements = this.videoControlsWrapperRef?.current?.querySelectorAll(
					'button, input, [tabindex]:not([tabindex="-1"])',
				);

				if (focusableElements && focusableElements.length) {
					// Ignored via go/ees005
					// eslint-disable-next-line @atlaskit/editor/no-as-casting
					firstElement = focusableElements[0] as HTMLElement;
					// Ignored via go/ees005
					// eslint-disable-next-line @atlaskit/editor/no-as-casting
					lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;
					if (event.shiftKey && document.activeElement === firstElement) {
						event.preventDefault();
						lastElement.focus();
					} else if (!event.shiftKey && document.activeElement === lastElement) {
						event.preventDefault();
						firstElement?.focus();
					}
				}
			}
		};

		if (this.videoControlsWrapperRef?.current) {
			this.unbindKeyDown = bind(this.videoControlsWrapperRef.current, {
				type: 'keydown',
				listener: onKeydown,
				options: { capture: true, passive: false },
			});
		}
	}

	private setViewMediaClientConfig = async () => {
		// mediaProvider is Promise<MediaProvider>, so await it first to get the actual provider
		const mediaProvider = await this.props.mediaProvider;
		if (mediaProvider) {
			const viewMediaClientConfig = mediaProvider.viewMediaClientConfig;
			const viewAndUploadMediaClientConfig = mediaProvider.viewAndUploadMediaClientConfig;
			// Only update state if new configs are available and different from current state
			if (
				(viewMediaClientConfig && this.state.viewMediaClientConfig !== viewMediaClientConfig) ||
				(viewAndUploadMediaClientConfig &&
					this.state.viewAndUploadMediaClientConfig !== viewAndUploadMediaClientConfig)
			) {
				this.setState({
					viewMediaClientConfig,
					viewAndUploadMediaClientConfig,
				});
			}
		}
	};

	private selectMediaSingleFromCard = ({ event }: CardEvent) => {
		this.selectMediaSingle(event);

		// In edit mode (node content wrapper has contenteditable set to true), link redirection is disabled by default
		// We need to call "stopPropagation" here in order to prevent in editor view mode, the browser from navigating to
		// another URL if the media node is wrapped in a link mark.
		if (
			this.props.isViewOnly &&
			areToolbarFlagsEnabled(Boolean(this.props.pluginInjectionApi?.toolbar))
		) {
			event.preventDefault();
		}
	};

	private selectMediaSingle = (event: React.MouseEvent<HTMLElement, MouseEvent>) => {
		const propPos = this.props.getPos();

		if (typeof propPos !== 'number') {
			return;
		}

		// NOTE: This does not prevent the link navigation in the editor view mode, .preventDefault is needed (see selectMediaSingleFromCard)
		// Hence it should be removed
		// We need to call "stopPropagation" here in order to prevent the browser from navigating to
		// another URL if the media node is wrapped in a link mark.
		if (editorExperiment('platform_editor_controls', 'control')) {
			event.stopPropagation();
		}

		const { state } = this.props.view;

		if (event.shiftKey) {
			// don't select text if there is current selection in a table (as this would override selected cells)
			if (state.selection instanceof CellSelection) {
				return;
			}

			setTextSelection(
				this.props.view,
				state.selection.from < propPos ? state.selection.from : propPos - 1,
				// + 3 needed for offset of the media inside mediaSingle and cursor to make whole mediaSingle selected
				state.selection.to > propPos ? state.selection.to : propPos + 2,
			);
		} else {
			setNodeSelection(this.props.view, propPos - 1);
		}
	};

	private getMediaSettings = memoizeOne(
		(viewAndUploadMediaClientConfig: MediaClientConfig | undefined, isViewOnly?: boolean) => {
			return {
				canUpdateVideoCaptions: fg('platform_media_video_captions')
					? !!viewAndUploadMediaClientConfig && !isViewOnly
					: false,
			};
		},
	);

	/**
	 * Surface opt-in first, so surfaces that never ask for the motion are not exposed to the
	 * gate. The node type is checked after it, so every node on an opted-in surface counts
	 * towards the same exposure population.
	 */
	private get hasGeneratedMediaMotion(): boolean {
		return (
			!!this.props.mediaOptions?.allowAIGeneratedMediaMotion &&
			fg('aifc_page_create_defer_generated_visuals') &&
			// File-backed only: `ExternalImageCard` reports neither its rendered preview nor its
			// dimensions, so an external node could only ever open on the reveal's timeout.
			this.props.node.attrs.type !== 'external'
		);
	}

	/**
	 * Media written straight into the document arrives without intrinsic dimensions, and the
	 * fetch that would supply them resolves `false` while the file is still processing. Only
	 * editor-driven uploads get a second attempt, from the plugin's media-state listener, so
	 * otherwise the card would keep its placeholder ratio forever. The preview rendering is the
	 * one moment the file is guaranteed ready, so the fetch is retried there.
	 */
	private fetchMissingDimensions = async (): Promise<void> => {
		const {
			node,
			view,
			mediaProvider,
			contextIdentifierProvider,
			mediaOptions,
			pluginInjectionApi,
		} = this.props;
		if (
			node.attrs.type === 'external' ||
			!node.attrs.id ||
			(node.attrs.width && node.attrs.height)
		) {
			return;
		}

		const updater = createMediaNodeUpdater({
			view,
			mediaProvider,
			contextIdentifierProvider,
			node,
			// Carries `allowRemoteDimensionsFetch`, so surfaces that cannot reach the media
			// APIs get the default dimensions back instead of a request.
			mediaOptions,
			isMediaSingle: true,
			lineLength: pluginInjectionApi?.width?.sharedState.currentState()?.lineLength,
		});

		try {
			const dimensions = await updater.getRemoteDimensions();
			if (dimensions) {
				updater.updateDimensions(dimensions);
			}
		} catch {
			// Leaves the card at its placeholder ratio, which the reveal's own timeout covers.
		}
	};

	private onPreviewRender = (fileId: string) => {
		this.emitMediaRenderEvent({ renderedMediaId: fileId, type: 'preview-rendered' });
		// Only tracked where the reveal uses it. Every media card in every editor calls this,
		// and the extra render it would otherwise trigger is not free.
		if (this.hasGeneratedMediaMotion && this.state.previewRenderedFileId !== fileId) {
			this.setState({ previewRenderedFileId: fileId });
			this.fetchMissingDimensions();
		}

		if (isExperimentEnabled('aifc_page_create_with_rovo_include_infographics')) {
			this.props.pluginInjectionApi?.core?.actions.execute(({ tr }) =>
				tr.setMeta(mediaStateKey, { type: 'PREVIEW_RENDERED', fileId }),
			);
		}
	};

	private onError = (reason: string) => {
		// The card is already showing its error treatment, so let the reveal open onto
		// that instead of waiting out its timeout.
		this.setState({ failedFileId: this.props.node.attrs.id });

		this.emitMediaRenderEvent({ reason, type: 'error' });

		// `getMediaRenderErrorHandler` also wires this for surfaces the analytics
		// experiment does not cover, so re-read without exposure — the render-time read
		// owns that — to keep the dispatch inside the experiment's own cohort.
		if (!expValEqualsNoExposure('platform_editor_media_error_analytics', 'isEnabled', true)) {
			return;
		}

		const nestedUnder = this.getNestedUnder();
		this.props.api?.media.actions.handleMediaNodeRenderError(this.props.node, reason, nestedUnder);
	};

	private onRemixRenderError = (reason: string) => {
		this.emitMediaRenderEvent({ reason, type: 'error' });
	};

	private getMediaRenderErrorHandler = () => {
		if (expValEquals('platform_editor_media_error_analytics', 'isEnabled', true)) {
			return this.onError;
		}
		// The reveal needs terminal errors too, so it can open onto the card's error treatment
		// rather than waiting out its timeout. `onError` keeps the analytics dispatch itself
		// inside the experiment's cohort.
		if (this.hasGeneratedMediaMotion) {
			return this.onError;
		}
		return this.props.mediaOptions?.onMediaRenderEvent ? this.onRemixRenderError : undefined;
	};

	/**
	 * This function checks if the media node is nested under a certain nodes, and if so,
	 * returns the name of the parent node type. This is used for providing more context in media render errors.
	 * @returns
	 */
	private getNestedUnder = (): string | undefined => {
		const pos = this.props.getPos();
		if (typeof pos !== 'number') {
			return undefined;
		}

		const { doc, schema } = this.props.view.state;
		const { bodiedSyncBlock } = schema.nodes;
		if (!bodiedSyncBlock) {
			return undefined;
		}

		const resolvedPos = doc.resolve(pos);

		const bodiedSyncBlockNode = findParentNodeClosestToPos(
			resolvedPos,
			(currentNode) => currentNode.type === bodiedSyncBlock,
		);

		return bodiedSyncBlockNode?.node.type.name;
	};

	render(): React.JSX.Element {
		const { node, selected, originalDimensions, isLoading, maxDimensions, mediaOptions } =
			this.props;

		const borderMark = node.marks.find((m) => m.type.name === 'border');
		const dataConsumerMark = this.getDataConsumerMark();

		const { viewMediaClientConfig, viewAndUploadMediaClientConfig, contextIdentifierProvider } =
			this.state;
		const { id, type, collection, url, alt } = node.attrs;

		// Check if we have any media client config available (syncProvider, state, or upload config)
		const hasNoMediaClientConfig =
			!viewMediaClientConfig &&
			(fg('platform_media_video_captions') ? !viewAndUploadMediaClientConfig : true);

		const hasGeneratedMediaMotion = this.hasGeneratedMediaMotion;

		// Opening before the real dimensions land would animate to the wrong height and snap
		// when they correct. Nodes that never get them fall through to the reveal's timeout.
		//
		// A terminal error is readiness too: the card is already showing its error treatment,
		// so the space opens onto that rather than hiding it until the timeout.
		const isRevealReady =
			this.state.failedFileId === id ||
			(this.state.previewRenderedFileId === id && !!node.attrs.width && !!node.attrs.height);

		if (isLoading || (type !== 'external' && hasNoMediaClientConfig)) {
			return (
				<GeneratedMediaReveal
					isEnabled={hasGeneratedMediaMotion}
					isReady={isRevealReady}
					mediaKey={id}
				>
					<MediaCardWrapper
						dimensions={originalDimensions}
						borderWidth={borderMark?.attrs.size}
						selected={selected}
					>
						<CardLoading interactionName="editor-media-card-loading" />
					</MediaCardWrapper>
				</GeneratedMediaReveal>
			);
		}

		const contextId = contextIdentifierProvider && contextIdentifierProvider.objectId;
		const identifier: Identifier =
			type === 'external'
				? {
						// Ignored via go/ees005
						// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
						dataURI: url!,
						name: url,
						mediaItemType: 'external-image',
					}
				: {
						id,
						mediaItemType: 'file',
						// Ignored via go/ees005
						// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
						collectionName: collection!,
					};

		const resolvedViewAndUploadMediaClientConfig = fg('platform_media_video_captions')
			? viewAndUploadMediaClientConfig
			: undefined;
		// mediaClientConfig is not needed for "external" case. So we have to cheat here.
		// there is a possibility mediaClientConfig will be part of a identifier,
		// so this might be not an issue
		const mediaClientConfig: MediaClientConfig = resolvedViewAndUploadMediaClientConfig ||
			viewMediaClientConfig || {
				// Ignored via go/ees005
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				authProvider: () => ({}) as any,
			};

		const ssr: SSR = process.env.REACT_SSR ? 'server' : 'client';

		// CWR (create-with-Rovo) infographics get a distinct loading treatment so the
		// generic media type icon isn't shown while the image streams in. Gated on the
		// existing infographics experiment.
		const isCWR =
			!!this.props.isCwrAIGenerating &&
			isExperimentEnabled('aifc_page_create_with_rovo_include_infographics');

		return (
			<GeneratedMediaReveal
				isEnabled={hasGeneratedMediaMotion}
				isReady={isRevealReady}
				mediaKey={id}
			>
				<MediaCardWrapper
					dimensions={originalDimensions}
					onContextMenu={this.selectMediaSingle}
					borderWidth={borderMark?.attrs.size}
					selected={selected}
				>
					<AnalyticsContext
						// eslint-disable-next-line @atlassian/perf-linting/no-unstable-inline-props -- Ignored via go/ees017 (to be fixed)
						data={{
							[MEDIA_CONTEXT]: {
								border: !!borderMark,
								// Only defined for remix-generated media (i.e. media nodes with a dataConsumer mark).
								// Format: "remix:{type}:{subtype}" e.g. "remix:infographic:corporate-doodle"
								remixSource: dataConsumerMark?.attrs.sources?.[0],
							},
						}}
					>
						<Card
							mediaClientConfig={mediaClientConfig}
							resizeMode="stretchy-fit"
							dimensions={maxDimensions}
							originalDimensions={originalDimensions}
							identifier={identifier}
							selectable={true}
							selected={selected}
							disableOverlay={true}
							onFullscreenChange={this.onFullscreenChange}
							onClick={this.selectMediaSingleFromCard}
							useInlinePlayer={mediaOptions && mediaOptions.allowLazyLoading}
							isLazy={mediaOptions && mediaOptions.allowLazyLoading}
							featureFlags={mediaOptions && mediaOptions.featureFlags}
							contextId={contextId}
							alt={alt}
							videoControlsWrapperRef={this.videoControlsWrapperRef}
							ssr={ssr}
							mediaSettings={this.getMediaSettings(
								viewAndUploadMediaClientConfig,
								this.props.isViewOnly,
							)}
							isAIGenerating={!!this.props.isAIGenerating}
							isCWR={isCWR}
							hasLoadingMotion={hasGeneratedMediaMotion}
							onPreviewRender={this.onPreviewRender}
							fallbackMediaNameFetcher={mediaOptions?.fallbackMediaNameFetcher}
							onError={this.getMediaRenderErrorHandler()}
						/>
					</AnalyticsContext>
				</MediaCardWrapper>
			</GeneratedMediaReveal>
		);
	}

	private onFullscreenChange = (fullscreen: boolean) => {
		this.mediaPluginState?.updateAndDispatch({
			isFullscreen: fullscreen,
		});
	};

	private handleNewNode = (props: MediaNodeProps) => {
		const { node } = props;

		this.mediaPluginState?.handleMediaNodeMount(node, () => this.props.getPos());
	};
}

const _default_1: React.ComponentClass<MediaNodeProps & ImageLoaderProps> =
	withImageLoader<MediaNodeProps>(MediaNode);
export default _default_1;
