import React from 'react';

import { type ADFEntity } from '@atlaskit/adf-utils/types';
import type { Node as PmNode } from '@atlaskit/editor-prosemirror/model';
import type { EditorView, NodeView } from '@atlaskit/editor-prosemirror/view';
import { fg } from '@atlaskit/platform-feature-flags';

import type { EventDispatcher } from '../event-dispatcher';
import type { ExtensionHandlers } from '../extensions';
import type { PortalProviderAPI } from '../portal';
import type { ProviderFactory } from '../provider-factory';
import type { ForwardRef, getPosHandler, ProsemirrorGetPosHandler } from '../react-node-view';
import ReactNodeView from '../react-node-view';
import type { EditorAppearance, ExtensionViewportSize } from '../types';

import { Extension } from './Extension';
import { ExtensionNodeWrapper } from './ExtensionNodeWrapper';
import type { ExtensionsPluginInjectionAPI, MacroInteractionDesignFeatureFlags } from './types';

interface ExtensionNodeViewOptions {
	appearance?: EditorAppearance;
	extensionViewportSizes?: ExtensionViewportSize[];
}

// getInlineNodeViewProducer is a new api to use instead of ReactNodeView
// when creating inline node views, however, it is difficult to test the impact
// on selections when migrating inlineExtension to use the new api.
// The ReactNodeView api will be visited in the second phase of the selections
// project whilst investigating block nodes. We will revisit the Extension node view there too.
export class ExtensionNode extends ReactNodeView {
	ignoreMutation(mutation: MutationRecord | { type: 'selection'; target: Node }) {
		// Extensions can perform async operations that will change the DOM.
		// To avoid having their tree rebuilt, we need to ignore the mutation
		// for atom based extensions if its not a layout, we need to give
		// children a chance to recalc
		return (
			this.node.type.isAtom ||
			(mutation.type !== 'selection' && mutation.attributeName !== 'data-layout')
		);
	}

	/**
	 * When interacting with input elements inside an extension's body, the events
	 * bubble up to the editor and get handled by it. This almost always gets in the way
	 * of being able to actually interact with said input in the extension, i.e.
	 * typing inside a text field (in an extension body) will print the text in the editor
	 * content area instead. This change prevents the editor view from trying to handle these events,
	 * when the target of the event is an input element, so the extension can.
	 *
	 * TODO: PGXT-8180 - write tests https://product-fabric.atlassian.net/browse/PGXT-8180
	 */
	stopEvent(event: Event) {
		return event.target instanceof HTMLInputElement && fg('interactable_in_editor_inputs');
	}

	getContentDOM() {
		if (this.node.isInline) {
			return;
		}

		const dom = document.createElement('div');
		dom.className = `${this.node.type.name}-content-dom-wrapper`;
		return { dom };
	}

	render(
		props: {
			providerFactory: ProviderFactory;
			extensionHandlers: ExtensionHandlers;
			// referentiality plugin won't utilise appearance just yet
			extensionNodeViewOptions?: ExtensionNodeViewOptions;
			pluginInjectionApi: ExtensionsPluginInjectionAPI;
			macroInteractionDesignFeatureFlags?: MacroInteractionDesignFeatureFlags;
			showLivePagesBodiedMacrosRendererView?: (node: ADFEntity) => boolean;
			showUpdatedLivePages1PBodiedExtensionUI?: (node: ADFEntity) => boolean;
			rendererExtensionHandlers?: ExtensionHandlers;
		},
		forwardRef: ForwardRef,
	) {
		return (
			<ExtensionNodeWrapper
				nodeType={this.node.type.name}
				macroInteractionDesignFeatureFlags={props.macroInteractionDesignFeatureFlags}
				extensionId={this.node.attrs.parameters?.extensionId}
				extensionViewportSizes={props.extensionNodeViewOptions?.extensionViewportSizes}
			>
				<Extension
					editorView={this.view}
					node={this.node}
					eventDispatcher={this.eventDispatcher}
					// The getPos arg is always a function when used with nodes
					// the version of the types we use has a union with the type
					// for marks.
					// This has been fixed in later versions of the definitly typed
					// types (and also in prosmirror-views inbuilt types).
					// https://github.com/DefinitelyTyped/DefinitelyTyped/pull/57384
					getPos={this.getPos as ProsemirrorGetPosHandler}
					providerFactory={props.providerFactory}
					handleContentDOMRef={forwardRef}
					extensionHandlers={props.extensionHandlers}
					editorAppearance={props.extensionNodeViewOptions?.appearance}
					pluginInjectionApi={props.pluginInjectionApi}
					macroInteractionDesignFeatureFlags={props.macroInteractionDesignFeatureFlags}
					showLivePagesBodiedMacrosRendererView={props.showLivePagesBodiedMacrosRendererView}
					showUpdatedLivePages1PBodiedExtensionUI={props.showUpdatedLivePages1PBodiedExtensionUI}
					rendererExtensionHandlers={props.rendererExtensionHandlers}
				/>
			</ExtensionNodeWrapper>
		);
	}
}

export default function ExtensionNodeView(
	portalProviderAPI: PortalProviderAPI,
	eventDispatcher: EventDispatcher,
	providerFactory: ProviderFactory,
	extensionHandlers: ExtensionHandlers,
	extensionNodeViewOptions: ExtensionNodeViewOptions,
	pluginInjectionApi: ExtensionsPluginInjectionAPI,
	macroInteractionDesignFeatureFlags?: MacroInteractionDesignFeatureFlags,
	showLivePagesBodiedMacrosRendererView?: (node: ADFEntity) => boolean,
	showUpdatedLivePages1PBodiedExtensionUI?: (node: ADFEntity) => boolean,
	rendererExtensionHandlers?: ExtensionHandlers,
) {
	return (node: PmNode, view: EditorView, getPos: getPosHandler): NodeView => {
		return new ExtensionNode(node, view, getPos, portalProviderAPI, eventDispatcher, {
			providerFactory,
			extensionHandlers,
			extensionNodeViewOptions,
			pluginInjectionApi,
			macroInteractionDesignFeatureFlags,
			showLivePagesBodiedMacrosRendererView,
			showUpdatedLivePages1PBodiedExtensionUI,
			rendererExtensionHandlers,
		}).init();
	};
}
