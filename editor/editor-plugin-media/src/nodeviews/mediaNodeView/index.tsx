import React from 'react';

import type { MediaADFAttrs } from '@atlaskit/adf-schema';
import type { EventDispatcher } from '@atlaskit/editor-common/event-dispatcher';
import {
	type NamedPluginStatesFromInjectionAPI,
	sharedPluginStateHookMigratorFactory,
	useSharedPluginState,
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
import type {
	ExtractInjectionAPI,
	EditorContainerWidth as WidthPluginState,
} from '@atlaskit/editor-common/types';
import { useSharedPluginStateSelector } from '@atlaskit/editor-common/use-shared-plugin-state-selector';
import type { SharedInteractionState } from '@atlaskit/editor-plugin-interaction';
import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import type { Decoration, EditorView } from '@atlaskit/editor-prosemirror/view';
import { getAttrsFromUrl } from '@atlaskit/media-client';

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
	width?: WidthPluginState;
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
		widthState: undefined,
	};
};

const useSharedState = sharedPluginStateHookMigratorFactory(
	(pluginInjectionApi: ExtractInjectionAPI<MediaNextEditorPluginType> | undefined) => {
		return useSharedPluginStateWithSelector(pluginInjectionApi, ['media'], selector);
	},
	(pluginInjectionApi: ExtractInjectionAPI<MediaNextEditorPluginType> | undefined) => {
		const { widthState, mediaState } = useSharedPluginState(pluginInjectionApi, ['width', 'media']);
		return {
			mediaProvider: mediaState?.mediaProvider,
			widthState,
		};
	},
);

const MediaNodeWithProviders = ({
	pluginInjectionApi,
	innerComponent,
}: MediaNodeWithProvidersProps) => {
	const { mediaProvider, widthState } = useSharedState(pluginInjectionApi);
	const interactionState = useSharedPluginStateSelector(
		pluginInjectionApi,
		'interaction.interactionState',
	);
	return innerComponent({
		width: widthState, // Remove when platform_editor_usesharedpluginstatewithselector is cleaned up
		mediaProvider: mediaProvider ? Promise.resolve(mediaProvider) : undefined,
		interactionState,
	});
};

function isMediaDecorationSpec(decoration: Decoration): decoration is Decoration {
	return decoration.spec.type !== undefined && decoration.spec.selected !== undefined;
}

class MediaNodeView extends SelectionBasedNodeView<MediaNodeViewProps> {
	private isSelected = false;

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

	onExternalImageLoaded = (dimensions: { height: number; width: number; }) => {
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

	renderMediaNodeWithState = (contextIdentifierProvider?: Promise<ContextIdentifierProvider>) => {
		return ({
			width: editorWidth,
			mediaProvider,
			interactionState,
		}: MediaNodeWithPluginStateComponentProps) => {
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

			// mediaSingle defines the max dimensions, so we don't need to constrain twice.
			const maxDimensions = {
				width: `100%`,
				height: `100%`,
			};

			const originalDimensions = {
				width,
				height,
			};

			const isSelectedAndInteracted =
				this.nodeInsideSelection() && interactionState !== 'hasNotHadInteraction';

			return (
				<MediaNode
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
				/>
			);
		};
	};

	renderMediaNodeWithProviders = ({ contextIdentifierProvider }: Providers) => {
		const { pluginInjectionApi } = this.reactComponentProps;

		return (
			<MediaNodeWithProviders
				pluginInjectionApi={pluginInjectionApi}
				innerComponent={this.renderMediaNodeWithState(contextIdentifierProvider)}
			/>
		);
	};

	render() {
		const { providerFactory } = this.reactComponentProps;

		return (
			<WithProviders
				providers={['contextIdentifierProvider']}
				providerFactory={providerFactory}
				renderNode={this.renderMediaNodeWithProviders}
			/>
		);
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
		return new MediaNodeView(
			node,
			view,
			getPos,
			portalProviderAPI,
			eventDispatcher,
			{
				eventDispatcher,
				providerFactory,
				mediaOptions,
				pluginInjectionApi,
			},
			undefined,
			undefined,
			// @portal-render-immediately
			true,
		).init();
	};
