import React, { Component } from 'react';

import type { UnbindFn } from 'bind-event-listener';
import { bind } from 'bind-event-listener';

import { MEDIA_CONTEXT } from '@atlaskit/analytics-namespaced-context';
import { AnalyticsContext } from '@atlaskit/analytics-next';
import type {
	ContextIdentifierProvider,
	MediaProvider,
} from '@atlaskit/editor-common/provider-factory';
import { setNodeSelection, setTextSelection, withImageLoader } from '@atlaskit/editor-common/utils';
import type { ImageLoaderProps } from '@atlaskit/editor-common/utils';
import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import { CellSelection } from '@atlaskit/editor-tables/cell-selection';
import type {
	CardDimensions,
	CardEvent,
	CardOnClickCallback,
	NumericalCardDimensions,
} from '@atlaskit/media-card';
import { Card, CardLoading } from '@atlaskit/media-card';
import type { Identifier } from '@atlaskit/media-client';
import type { SSR } from '@atlaskit/media-common';
import type { MediaClientConfig } from '@atlaskit/media-core';
import { fg } from '@atlaskit/platform-feature-flags';
import { editorExperiment } from '@atlaskit/tmp-editor-statsig/experiments';

import { stateKey as mediaStateKey } from '../../pm-plugins/plugin-key';
import type { MediaPluginState } from '../../pm-plugins/types';
import type {
	MediaOptions,
	getPosHandler as ProsemirrorGetPosHandler,
	ReactNodeProps,
} from '../../types';
import { MediaCardWrapper } from '../styles';

// This is being used by DropPlaceholder now
export const MEDIA_HEIGHT = 125;
export const FILE_WIDTH = 156;

export interface MediaNodeProps extends ReactNodeProps, ImageLoaderProps {
	view: EditorView;
	node: PMNode;
	getPos: ProsemirrorGetPosHandler;
	contextIdentifierProvider?: Promise<ContextIdentifierProvider>;
	originalDimensions: NumericalCardDimensions;
	maxDimensions: CardDimensions;
	isMediaSingle?: boolean;
	onClick?: CardOnClickCallback;
	mediaProvider?: Promise<MediaProvider>;
	isLoading?: boolean;
	mediaOptions?: MediaOptions;
	isViewOnly?: boolean;
}

interface MediaNodeState {
	viewMediaClientConfig?: MediaClientConfig;
	contextIdentifierProvider?: ContextIdentifierProvider;
}

// eslint-disable-next-line @repo/internal/react/no-class-components
export class MediaNode extends Component<MediaNodeProps, MediaNodeState> {
	private mediaPluginState: MediaPluginState | undefined;

	state: MediaNodeState = {};
	videoControlsWrapperRef = React.createRef<HTMLDivElement>();
	unbindKeyDown: UnbindFn | null = null;

	constructor(props: MediaNodeProps) {
		super(props);
		const { view } = this.props;
		this.mediaPluginState = mediaStateKey.getState(view.state);
	}

	shouldComponentUpdate(nextProps: MediaNodeProps, nextState: MediaNodeState) {
		const hasNewViewMediaClientConfig =
			!this.state.viewMediaClientConfig && nextState.viewMediaClientConfig;
		if (
			this.props.selected !== nextProps.selected ||
			this.props.node.attrs.id !== nextProps.node.attrs.id ||
			this.props.node.attrs.collection !== nextProps.node.attrs.collection ||
			this.props.maxDimensions.height !== nextProps.maxDimensions.height ||
			this.props.maxDimensions.width !== nextProps.maxDimensions.width ||
			this.props.contextIdentifierProvider !== nextProps.contextIdentifierProvider ||
			this.props.isLoading !== nextProps.isLoading ||
			this.props.mediaProvider !== nextProps.mediaProvider ||
			hasNewViewMediaClientConfig
		) {
			return true;
		}
		return false;
	}

	async componentDidMount() {
		this.handleNewNode(this.props);

		const { contextIdentifierProvider } = this.props;
		this.setState({
			contextIdentifierProvider: await contextIdentifierProvider,
		});

		await this.setViewMediaClientConfig();
	}

	componentWillUnmount() {
		const { node } = this.props;
		this.mediaPluginState?.handleMediaNodeUnmount(node);
		if (this.unbindKeyDown && typeof this.unbindKeyDown === 'function') {
			this.unbindKeyDown();
		}
	}

	componentDidUpdate(prevProps: Readonly<MediaNodeProps>) {
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

	bindKeydown() {
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
		const mediaProvider = await this.props.mediaProvider;
		if (mediaProvider) {
			const viewMediaClientConfig = mediaProvider.viewMediaClientConfig;

			this.setState({
				viewMediaClientConfig,
			});
		}
	};

	private selectMediaSingleFromCard = ({ event }: CardEvent) => {
		this.selectMediaSingle(event);

		// In edit mode (node content wrapper has contenteditable set to true), link redirection is disabled by default
		// We need to call "stopPropagation" here in order to prevent in editor view mode, the browser from navigating to
		// another URL if the media node is wrapped in a link mark.
		if (this.props.isViewOnly && editorExperiment('platform_editor_controls', 'variant1')) {
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

	render() {
		const { node, selected, originalDimensions, isLoading, maxDimensions, mediaOptions } =
			this.props;

		const borderMark = node.marks.find((m) => m.type.name === 'border');

		const { viewMediaClientConfig, contextIdentifierProvider } = this.state;
		const { id, type, collection, url, alt } = node.attrs;

		if (isLoading || (type !== 'external' && !viewMediaClientConfig)) {
			return (
				<MediaCardWrapper dimensions={originalDimensions}>
					<CardLoading interactionName="editor-media-card-loading" />
				</MediaCardWrapper>
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

		// mediaClientConfig is not needed for "external" case. So we have to cheat here.
		// there is a possibility mediaClientConfig will be part of a identifier,
		// so this might be not an issue
		const mediaClientConfig: MediaClientConfig = viewMediaClientConfig || {
			// Ignored via go/ees005
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			authProvider: () => ({}) as any,
		};

		let ssr: SSR | undefined;
		if (fg('platform_editor_ssr_media')) {
			ssr = process.env.REACT_SSR ? 'server' : 'client';
		}

		return (
			<MediaCardWrapper
				dimensions={originalDimensions}
				onContextMenu={this.selectMediaSingle}
				borderWidth={borderMark?.attrs.size}
				selected={selected}
			>
				<AnalyticsContext
					data={{
						[MEDIA_CONTEXT]: {
							border: !!borderMark,
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
					/>
				</AnalyticsContext>
			</MediaCardWrapper>
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

export default withImageLoader<MediaNodeProps>(MediaNode);
