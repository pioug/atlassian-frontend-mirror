import React, { Component } from 'react';

import { type ADFEntity } from '@atlaskit/adf-utils/types';
import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';

import type { EventDispatcher } from '../event-dispatcher';
import type { ExtensionHandlers, ReferenceEntity } from '../extensions';
import { ProviderFactory, WithProviders } from '../provider-factory';
import type { Providers } from '../provider-factory';
import type { ProsemirrorGetPosHandler } from '../react-node-view';
import type { EditorAppearance } from '../types';

import { ExtensionComponent } from './ExtensionComponent';
import type { ExtensionsPluginInjectionAPI, MacroInteractionDesignFeatureFlags } from './types';

export interface Props {
	editorView: EditorView;
	node: PMNode;
	getPos: ProsemirrorGetPosHandler;
	providerFactory?: ProviderFactory;
	handleContentDOMRef: (node: HTMLElement | null) => void;
	extensionHandlers: ExtensionHandlers;
	references?: ReferenceEntity[];
	editorAppearance?: EditorAppearance;
	pluginInjectionApi: ExtensionsPluginInjectionAPI;
	eventDispatcher?: EventDispatcher;
	macroInteractionDesignFeatureFlags?: MacroInteractionDesignFeatureFlags;
	showLivePagesBodiedMacrosRendererView?: (node: ADFEntity) => boolean;
	showUpdatedLivePages1PBodiedExtensionUI?: (node: ADFEntity) => boolean;
	rendererExtensionHandlers?: ExtensionHandlers;
}

// Ignored via go/ees005
// eslint-disable-next-line @repo/internal/react/no-class-components, @typescript-eslint/no-explicit-any
export class Extension extends Component<Props, any> {
	static displayName = 'Extension';

	private providerFactory: ProviderFactory;

	constructor(props: Props) {
		super(props);
		this.providerFactory = props.providerFactory || new ProviderFactory();
	}

	componentWillUnmount() {
		if (!this.props.providerFactory) {
			// new ProviderFactory is created if no `providers` has been set
			// in this case when component is unmounted it's safe to destroy this providerFactory
			this.providerFactory.destroy();
		}
	}

	private renderWithProvider = ({ extensionProvider }: Providers) => {
		const {
			node,
			getPos,
			editorView,
			handleContentDOMRef,
			extensionHandlers,
			references,
			editorAppearance,
			pluginInjectionApi,
			eventDispatcher,
			macroInteractionDesignFeatureFlags,
			showLivePagesBodiedMacrosRendererView,
			showUpdatedLivePages1PBodiedExtensionUI,
			rendererExtensionHandlers,
		} = this.props;

		// Extensions are not yet using the new plugin architecture, and the use of the pluginInjectionApi
		// is not type safe in editor-common.
		// @ts-ignore
		const currentState = pluginInjectionApi?.editorViewMode?.sharedState?.currentState();
		const { contentMode, mode } = currentState || {};
		const isLivePageViewMode = contentMode === 'live-view' || mode === 'view';

		return (
			<ExtensionComponent
				editorView={editorView}
				node={node}
				getPos={getPos}
				references={references}
				extensionProvider={extensionProvider}
				handleContentDOMRef={handleContentDOMRef}
				extensionHandlers={extensionHandlers}
				editorAppearance={editorAppearance}
				pluginInjectionApi={pluginInjectionApi}
				eventDispatcher={eventDispatcher}
				macroInteractionDesignFeatureFlags={macroInteractionDesignFeatureFlags}
				showLivePagesBodiedMacrosRendererView={showLivePagesBodiedMacrosRendererView}
				showUpdatedLivePages1PBodiedExtensionUI={showUpdatedLivePages1PBodiedExtensionUI}
				rendererExtensionHandlers={rendererExtensionHandlers}
				isLivePageViewMode={isLivePageViewMode}
			/>
		);
	};

	render() {
		return (
			<WithProviders
				providers={['extensionProvider']}
				providerFactory={this.providerFactory}
				renderNode={this.renderWithProvider}
			/>
		);
	}
}
