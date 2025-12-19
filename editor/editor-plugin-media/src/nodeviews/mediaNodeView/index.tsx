import React from 'react';

import { bind } from 'bind-event-listener';

import type { MediaADFAttrs } from '@atlaskit/adf-schema';
import type { EventDispatcher } from '@atlaskit/editor-common/event-dispatcher';
import {
	type NamedPluginStatesFromInjectionAPI,
	useSharedPluginStateWithSelector,
} from '@atlaskit/editor-common/hooks';
import { DEFAULT_IMAGE_HEIGHT, DEFAULT_IMAGE_WIDTH } from '@atlaskit/editor-common/media-single';
import { type PortalProviderAPI } from '@atlaskit/editor-common/portal';
import { WithProviders } from '@atlaskit/editor-common/provider-factory';
import type {
	ContextIdentifierProvider,
	MediaProvider,
	ProviderFactory,
	Providers,
} from '@atlaskit/editor-common/provider-factory';
import { SelectionBasedNodeView } from '@atlaskit/editor-common/selection-based-node-view';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { useSharedPluginStateSelector } from '@atlaskit/editor-common/use-shared-plugin-state-selector';
import type { SharedInteractionState } from '@atlaskit/editor-plugin-interaction';
import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import type { Decoration, EditorView } from '@atlaskit/editor-prosemirror/view';
import {
	akEditorFullWidthLayoutWidth,
	akEditorDefaultLayoutWidth,
	akEditorCalculatedWideLayoutWidth,
} from '@atlaskit/editor-shared-styles';
import { getAttrsFromUrl } from '@atlaskit/media-client';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';

import type { MediaNextEditorPluginType } from '../../mediaPluginType';
import { updateCurrentMediaNodeAttrs } from '../../pm-plugins/commands/helpers';
import { isMediaBlobUrlFromAttrs } from '../../pm-plugins/utils/media-common';
import type { getPosHandler, getPosHandlerNode, MediaOptions } from '../../types';
import type { MediaNodeViewProps } from '../types';

// Ignored via go/ees005
// eslint-disable-next-line import/no-named-as-default
import MediaNode from './media';

interface MediaNodeWithPluginStateComponentProps {
	interactionState?: SharedInteractionState['interactionState'];
	mediaProvider?: Promise<MediaProvider>;
}

interface MediaNodeWithProvidersProps {
	innerComponent: (props: MediaNodeWithPluginStateComponentProps) => React.ReactElement;
	pluginInjectionApi: ExtractInjectionAPI<MediaNextEditorPluginType> | undefined;
}

const selector = (
	states: NamedPluginStatesFromInjectionAPI<
		ExtractInjectionAPI<MediaNextEditorPluginType>,
		'media'
	>,
) => {
	return {
		mediaProvider: states.mediaState?.mediaProvider,
	};
};

const MediaNodeWithProviders = ({
	pluginInjectionApi,
	innerComponent,
}: MediaNodeWithProvidersProps) => {
	const { mediaProvider } = useSharedPluginStateWithSelector(
		pluginInjectionApi,
		['media'],
		selector,
	);
	const interactionState = useSharedPluginStateSelector(
		pluginInjectionApi,
		'interaction.interactionState',
	);
	return innerComponent({
		mediaProvider: mediaProvider ? Promise.resolve(mediaProvider) : undefined,
		interactionState,
	});
};

function isMediaDecorationSpec(decoration: Decoration): decoration is Decoration {
	return decoration.spec.type !== undefined && decoration.spec.selected !== undefined;
}

class MediaNodeView extends SelectionBasedNodeView<MediaNodeViewProps> {
	private isSelected = false;
	private hasBeenResized = false;
	private resizeListenerBinding?: () => void;

	getMediaSingleNode(getPos: getPosHandlerNode): PMNode | null {
		const pos = getPos();
		if (typeof pos !== 'number') {
			return null;
		}

		const $pos = this.view.state.doc.resolve(pos);

		// The parent of the media node should be mediaSingle
		if ($pos.parent && $pos.parent.type.name === 'mediaSingle') {
			return $pos.parent;
		}

		return null;
	}

	getMaxWidthFromMediaSingleNode(mediaSingleNode: PMNode): number {
		const {
			width: widthAttr,
			widthType: widthTypeAttr,
			layout: layoutAttr,
		} = mediaSingleNode.attrs;
		// for extended mediaSingle nodes with width and widthType attributes ( default behaviour )
		if (widthAttr && widthTypeAttr === 'pixel') {
			return widthAttr;
		}
		// for legacy mediaSingle nodes without widthType attribute
		switch (layoutAttr) {
			case 'full-width':
				return akEditorFullWidthLayoutWidth;
			case 'wide':
				return akEditorCalculatedWideLayoutWidth;
			default:
				return akEditorDefaultLayoutWidth;
		}
	}

	hasResizedListener = () => {
		if (!this.hasBeenResized) {
			this.hasBeenResized = true;
			this.update(this.node, this.decorations);
		}
	};

	createDomRef(): HTMLElement {
		const domRef = document.createElement('div');
		if (
			this.reactComponentProps.mediaOptions &&
			this.reactComponentProps.mediaOptions.allowMediaSingleEditable
		) {
			// workaround Chrome bug in https://product-fabric.atlassian.net/browse/ED-5379
			// see also: https://github.com/ProseMirror/prosemirror/issues/884
			domRef.contentEditable = 'true';
		}

		if (expValEquals('platform_editor_media_vc_fixes', 'isEnabled', true)) {
			this.resizeListenerBinding = bind(domRef, {
				type: 'resized',
				listener: this.hasResizedListener,
			});
		}
		return domRef;
	}

	viewShouldUpdate(nextNode: PMNode, decorations: Decoration[]) {
		const hasMediaNodeSelectedDecoration = decorations.some(
			(decoration) =>
				isMediaDecorationSpec(decoration) &&
				decoration.spec.type === 'media' &&
				decoration.spec.selected,
		);

		if (this.isSelected !== hasMediaNodeSelectedDecoration) {
			this.isSelected = hasMediaNodeSelectedDecoration;
			return true;
		}

		if (this.node.attrs !== nextNode.attrs) {
			return true;
		}

		return super.viewShouldUpdate(nextNode, decorations);
	}

	stopEvent(event: Event) {
		// Don't trap right click events on media node
		if (['mousedown', 'contextmenu'].indexOf(event.type) !== -1) {
			const mouseEvent = event as MouseEvent;
			if (mouseEvent.button === 2) {
				return true;
			}
		}
		return false;
	}

	getAttrs(): MediaADFAttrs {
		const { attrs } = this.node;
		return attrs as MediaADFAttrs;
	}

	isMediaBlobUrl(): boolean {
		const attrs = this.getAttrs();
		return isMediaBlobUrlFromAttrs(attrs);
	}

	onExternalImageLoaded = (dimensions: { height: number; width: number }) => {
		const getPos = this.getPos as getPosHandlerNode;
		const { width, height, ...rest } = this.getAttrs();
		if (!width || !height) {
			updateCurrentMediaNodeAttrs(
				{
					...rest,
					width: width || dimensions.width,
					height: height || dimensions.height,
				},
				{
					node: this.node,
					getPos,
				},
				true,
			)(this.view.state, this.view.dispatch);
		}
	};

	getMaxCardDimensions = () => {
		const flexibleDimensions = { width: '100%', height: '100%' };

		if (expValEquals('platform_editor_media_vc_fixes', 'isEnabled', true)) {
			const pos = (this.getPos as getPosHandlerNode)();
			if (typeof pos !== 'number') {
				return flexibleDimensions;
			}

			if (this.hasBeenResized) {
				return flexibleDimensions;
			}

			const mediaSingleNodeParent = this.getMediaSingleNode(this.getPos as getPosHandlerNode);

			// If media parent not found, return default
			if (!mediaSingleNodeParent) {
				return flexibleDimensions;
			}

			// Compute normal dimensions
			const maxWidth = this.getMaxWidthFromMediaSingleNode(mediaSingleNodeParent);
			return {
				width: `${maxWidth}px`,
				height: '100%',
			};
		}

		return flexibleDimensions;
	};

	renderMediaNodeWithState = (contextIdentifierProvider?: Promise<ContextIdentifierProvider>) => {
		return ({
			mediaProvider,
			interactionState,
		}: MediaNodeWithPluginStateComponentProps): React.JSX.Element => {
			const getPos = this.getPos as getPosHandlerNode;
			const { mediaOptions } = this.reactComponentProps;

			const attrs = this.getAttrs();
			const url = attrs.type === 'external' ? attrs.url : '';

			let { width, height } = attrs;
			if (this.isMediaBlobUrl()) {
				const urlAttrs = getAttrsFromUrl(url);
				if (urlAttrs) {
					const { width: urlWidth, height: urlHeight } = urlAttrs;
					width = width || urlWidth;
					height = height || urlHeight;
				}
			}
			width = width || DEFAULT_IMAGE_WIDTH;
			height = height || DEFAULT_IMAGE_HEIGHT;

			const { pluginInjectionApi } = this.reactComponentProps;

			// mediaSingle defines the max dimensions, so we don't need to constrain twice.
			const maxDimensions = this.getMaxCardDimensions();

			const originalDimensions = {
				width,
				height,
			};

			const isSelectedAndInteracted =
				this.nodeInsideSelection() && interactionState !== 'hasNotHadInteraction';

			return (
				<MediaNode
					api={pluginInjectionApi}
					view={this.view}
					node={this.node}
					getPos={getPos}
					selected={isSelectedAndInteracted}
					originalDimensions={originalDimensions}
					maxDimensions={maxDimensions}
					url={url}
					mediaProvider={mediaProvider}
					contextIdentifierProvider={contextIdentifierProvider}
					mediaOptions={mediaOptions}
					onExternalImageLoaded={this.onExternalImageLoaded}
					isViewOnly={
						this.reactComponentProps.pluginInjectionApi?.editorViewMode?.sharedState.currentState()
							?.mode === 'view'
					}
					pluginInjectionApi={this.reactComponentProps.pluginInjectionApi}
				/>
			);
		};
	};

	renderMediaNodeWithProviders = ({ contextIdentifierProvider }: Providers): React.JSX.Element => {
		const { pluginInjectionApi } = this.reactComponentProps;

		return (
			<MediaNodeWithProviders
				pluginInjectionApi={pluginInjectionApi}
				innerComponent={this.renderMediaNodeWithState(contextIdentifierProvider)}
			/>
		);
	};

	render(): React.JSX.Element {
		const { providerFactory } = this.reactComponentProps;

		return (
			<WithProviders
				providers={['contextIdentifierProvider']}
				providerFactory={providerFactory}
				renderNode={this.renderMediaNodeWithProviders}
			/>
		);
	}

	destroy() {
		if (this.resizeListenerBinding) {
			this.resizeListenerBinding();
		}
		super.destroy();
	}
}

export const ReactMediaNode =
	(
		portalProviderAPI: PortalProviderAPI,
		eventDispatcher: EventDispatcher,
		providerFactory: ProviderFactory,
		mediaOptions: MediaOptions = {},
		pluginInjectionApi: ExtractInjectionAPI<MediaNextEditorPluginType> | undefined,
	) =>
	(node: PMNode, view: EditorView, getPos: getPosHandler) => {
		return new MediaNodeView(node, view, getPos, portalProviderAPI, eventDispatcher, {
			eventDispatcher,
			providerFactory,
			mediaOptions,
			pluginInjectionApi,
		}).init();
	};
