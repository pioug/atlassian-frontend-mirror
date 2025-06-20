import React from 'react';

import type { EventDispatcher } from '@atlaskit/editor-common/event-dispatcher';
import {
	sharedPluginStateHookMigratorFactory,
	useSharedPluginState,
} from '@atlaskit/editor-common/hooks';
import { type PortalProviderAPI } from '@atlaskit/editor-common/portal';
import { WithProviders } from '@atlaskit/editor-common/provider-factory';
import type { MediaProvider, ProviderFactory } from '@atlaskit/editor-common/provider-factory';
import ReactNodeView from '@atlaskit/editor-common/react-node-view';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { useSharedPluginStateSelector } from '@atlaskit/editor-common/use-shared-plugin-state-selector';
import type { EditorDisabledPluginState } from '@atlaskit/editor-plugin-editor-disabled';
import type { EditorViewModePluginState } from '@atlaskit/editor-plugin-editor-viewmode';
import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import type { EditorView, NodeView } from '@atlaskit/editor-prosemirror/view';

import type { MediaNextEditorPluginType } from '../mediaPluginType';
import type { ForwardRef, getPosHandler, getPosHandlerNode, MediaOptions } from '../types';
import { useMediaProvider } from '../ui/hooks/useMediaProvider';

import { MediaGroupNext } from './mediaGroupNext';

interface MediaGroupNodeViewProps {
	allowLazyLoading?: boolean;
	isCopyPasteEnabled?: boolean;
	providerFactory: ProviderFactory;
	mediaOptions: MediaOptions;
	pluginInjectionApi: ExtractInjectionAPI<MediaNextEditorPluginType> | undefined;
}

interface RenderFn {
	// remove next two plugin states when cleaning up `platform_editor_usesharedpluginstateselector`
	editorDisabledPlugin?: EditorDisabledPluginState;
	editorViewModePlugin?: EditorViewModePluginState | null;
	editorDisabled?: boolean;
	editorViewMode?: 'view' | 'edit';
	mediaProvider?: MediaProvider | null;
}

interface MediaGroupNodeViewInternalProps {
	renderFn: (props: RenderFn) => JSX.Element | null;
	pluginInjectionApi: ExtractInjectionAPI<MediaNextEditorPluginType> | undefined;
}

const useSharedState = sharedPluginStateHookMigratorFactory(
	(pluginInjectionApi: ExtractInjectionAPI<MediaNextEditorPluginType> | undefined) => {
		const editorDisabled = useSharedPluginStateSelector(
			pluginInjectionApi,
			'editorDisabled.editorDisabled',
		);
		const editorViewMode = useSharedPluginStateSelector(pluginInjectionApi, 'editorViewMode.mode');
		return {
			editorDisabled,
			editorViewMode,
		};
	},
	(pluginInjectionApi: ExtractInjectionAPI<MediaNextEditorPluginType> | undefined) => {
		const { editorDisabledState: editorDisabledPlugin, editorViewModeState: editorViewModePlugin } =
			useSharedPluginState(pluginInjectionApi, ['editorDisabled', 'editorViewMode']);
		return {
			editorDisabled: editorDisabledPlugin?.editorDisabled,
			editorViewMode: editorViewModePlugin?.mode,
		};
	},
);

function MediaGroupNodeViewInternal({
	renderFn,
	pluginInjectionApi,
}: MediaGroupNodeViewInternalProps) {
	const { editorDisabled, editorViewMode } = useSharedState(pluginInjectionApi);

	const mediaProvider = useMediaProvider(pluginInjectionApi);
	return renderFn({
		editorDisabled,
		editorViewMode,
		mediaProvider,
	});
}

class MediaGroupNodeView extends ReactNodeView<MediaGroupNodeViewProps> {
	render(props: MediaGroupNodeViewProps, forwardRef: ForwardRef) {
		const { providerFactory, mediaOptions, pluginInjectionApi } = props;
		const getPos = this.getPos as getPosHandlerNode;

		return (
			<WithProviders
				providers={['contextIdentifierProvider']}
				providerFactory={providerFactory}
				renderNode={({ contextIdentifierProvider }) => {
					const renderFn = ({
						mediaProvider: mediaProviderFromState,
						editorDisabled,
						editorViewMode,
					}: RenderFn) => {
						const mediaProvider = mediaProviderFromState
							? Promise.resolve(mediaProviderFromState)
							: undefined;

						if (!mediaProvider) {
							return null;
						}

						return (
							<MediaGroupNext
								node={this.node}
								getPos={getPos}
								view={this.view}
								forwardRef={forwardRef}
								disabled={editorDisabled}
								allowLazyLoading={mediaOptions.allowLazyLoading}
								mediaProvider={mediaProvider}
								contextIdentifierProvider={contextIdentifierProvider}
								isCopyPasteEnabled={mediaOptions.isCopyPasteEnabled}
								anchorPos={this.view.state.selection.$anchor.pos}
								headPos={this.view.state.selection.$head.pos}
								mediaOptions={mediaOptions}
								editorViewMode={editorViewMode === 'view'}
							/>
						);
					};

					return (
						<MediaGroupNodeViewInternal
							renderFn={renderFn}
							pluginInjectionApi={pluginInjectionApi}
						/>
					);
				}}
			/>
		);
	}
}

export const ReactMediaGroupNode =
	(
		portalProviderAPI: PortalProviderAPI,
		eventDispatcher: EventDispatcher,
		providerFactory: ProviderFactory,
		mediaOptions: MediaOptions = {},
		pluginInjectionApi: ExtractInjectionAPI<MediaNextEditorPluginType> | undefined,
	) =>
	(node: PMNode, view: EditorView, getPos: getPosHandler): NodeView => {
		return new MediaGroupNodeView(node, view, getPos, portalProviderAPI, eventDispatcher, {
			providerFactory,
			mediaOptions,
			pluginInjectionApi,
		}).init();
	};
