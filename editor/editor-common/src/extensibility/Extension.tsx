import React, { Component } from 'react';

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
}

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
		} = this.props;

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
