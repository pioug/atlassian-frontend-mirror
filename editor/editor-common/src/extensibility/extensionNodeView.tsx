import React from 'react';

import type { ADFEntity } from '@atlaskit/adf-utils/types';
import type { Node as PmNode } from '@atlaskit/editor-prosemirror/model';
import type {
	Decoration,
	DecorationSource,
	EditorView,
	NodeView,
} from '@atlaskit/editor-prosemirror/view';
import { fg } from '@atlaskit/platform-feature-flags';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';

import { isSSR } from '../core-utils';
import type { EventDispatcher } from '../event-dispatcher';
import type { ExtensionHandlers } from '../extensions';
import type { PortalProviderAPI } from '../portal';
import type { ProviderFactory } from '../provider-factory';
import type { ForwardRef, getPosHandler, ProsemirrorGetPosHandler } from '../react-node-view';
import ReactNodeView from '../react-node-view';
import type { EditorAppearance } from '../types';

import { Extension } from './Extension';
import { ExtensionNodeWrapper } from './ExtensionNodeWrapper';
import type {
	ExtensionsPluginInjectionAPI,
	MacroInteractionDesignFeatureFlags,
	GetPMNodeHeight,
} from './types';

interface ExtensionNodeViewOptions {
	appearance?: EditorAppearance;
	getExtensionHeight?: GetPMNodeHeight;
}

interface ReactExtensionNodeProps {
	extensionHandlers: ExtensionHandlers;
	extensionNodeViewOptions?: ExtensionNodeViewOptions;
	macroInteractionDesignFeatureFlags?: MacroInteractionDesignFeatureFlags;
	pluginInjectionApi: ExtensionsPluginInjectionAPI;
	providerFactory: ProviderFactory;
	rendererExtensionHandlers?: ExtensionHandlers;
	showLivePagesBodiedMacrosRendererView?: (node: ADFEntity) => boolean;
	showUpdatedLivePages1PBodiedExtensionUI?: (node: ADFEntity) => boolean;
}

// getInlineNodeViewProducer is a new api to use instead of ReactNodeView
// when creating inline node views, however, it is difficult to test the impact
// on selections when migrating inlineExtension to use the new api.
// The ReactNodeView api will be visited in the second phase of the selections
// project whilst investigating block nodes. We will revisit the Extension node view there too.
export class ExtensionNode<AdditionalParams = unknown> extends ReactNodeView<
	ReactExtensionNodeProps & AdditionalParams
> {
	/**
	 * Track whether we found and are reusing SSR'd DOM.
	 * When true, we skip React Portal rendering on first init to preserve SSR content.
	 */
	private didReuseSsrDom = false;

	/**
	 * Track whether this is the first init call.
	 * SSR content preservation only happens on the very first init.
	 */
	private isFirstInit = true;

	ignoreMutation(mutation: MutationRecord | { target: Node; type: 'selection' }): boolean {
		// Extensions can perform async operations that will change the DOM.
		// To avoid having their tree rebuilt, we need to ignore the mutation
		// for atom based extensions if its not a layout, we need to give
		// children a chance to recalc
		return (
			this.node.type.isAtom ||
			(mutation.type !== 'selection' && mutation.attributeName !== 'data-layout')
		);
	}

	// Reserve height by setting a minimum height for the extension node view element
	createDomRef(): HTMLElement {
		if (!fg('confluence_connect_macro_preset_height')) {
			// Try to reuse SSR'd DOM node on first init only
			// This preserves SSR content and avoids TTVC mutations during hydration
			if (
				!isSSR() &&
				this.isFirstInit &&
				this.node.type.name === 'extension' &&
				this.node.attrs.extensionKey === 'toc' &&
				expValEquals('platform_editor_hydration_skip_react_portal', 'isEnabled', true)
			) {
				const ssrElement = this.findSSRElement();
				if (ssrElement) {
					this.didReuseSsrDom = true;
					return ssrElement;
				}
			}
			return super.createDomRef();
		}
		if (!this.node.isInline) {
			const htmlElement = document.createElement('div');
			const extensionHeight =
				this.reactComponentProps?.extensionNodeViewOptions?.getExtensionHeight?.(this.node);
			if (extensionHeight) {
				htmlElement.style.setProperty('min-height', `${extensionHeight}px`);
			}
			return htmlElement;
		}

		const htmlElement = document.createElement('span');
		return htmlElement;
	}

	/**
	 * Cache for SSR element lookup to avoid repeated DOM queries.
	 * undefined = not yet searched, null = searched but not found, HTMLElement = found
	 */
	private cachedSsrElement: HTMLElement | undefined | null;

	/**
	 * Attempts to find an existing SSR'd DOM element for this extension node by extensionKey and localId
	 * which should uniquely identify the
	 * extension node within the editor content.
	 *
	 * @returns The SSR'd element if found, otherwise null
	 */
	private findSSRElement(): HTMLElement | null {
		if (this.cachedSsrElement !== undefined) {
			return this.cachedSsrElement || null;
		}

		const extensionKey = this.node.attrs.extensionKey;
		const localId = this.node.attrs.localId;
		const editorDom = this.view.dom;

		if (extensionKey && localId) {
			const selector = `[extensionkey="${extensionKey}"][localid="${localId}"]`;
			const element = editorDom.querySelector(selector);
			if (element && element instanceof HTMLElement) {
				this.cachedSsrElement = element;
				return element;
			}
		}

		this.cachedSsrElement = null;
		return null;
	}

	/**
	 * Override init() to skip React Portal rendering on first init if we're reusing SSR'd DOM.
	 * This preserves the SSR content without React unnecessarily re-rendering it.
	 */
	init() {
		if (!expValEquals('platform_editor_hydration_skip_react_portal', 'isEnabled', true)) {
			super.init();
		} else {
			if (
				!isSSR() &&
				this.node.type.name === 'extension' &&
				this.node.attrs.extensionKey === 'toc'
			) {
				const ssrElement = this.findSSRElement();
				const shouldSkipInitRender = ssrElement !== null;
				super.init(shouldSkipInitRender);
				if (shouldSkipInitRender) {
					this.isFirstInit = false;
				}
			} else {
				super.init();
			}
		}

		return this;
	}

	update(
		node: PmNode,
		decorations: ReadonlyArray<Decoration>,
		_innerDecorations?: DecorationSource,
		validUpdate: (currentNode: PmNode, newNode: PmNode) => boolean = () => true,
	): boolean {
		// Remove extensionNodeWrapper aka span.relative if we previously reused SSR DOM
		// control is back to React afterwards
		if (
			this.didReuseSsrDom &&
			expValEquals('platform_editor_hydration_skip_react_portal', 'isEnabled', true)
		) {
			const ssrElement = this.findSSRElement();
			if (ssrElement) {
				const extensionNodeWrapper = ssrElement.querySelector(
					'[data-testId="extension-node-wrapper"]',
				);
				if (extensionNodeWrapper) {
					extensionNodeWrapper.remove();
				}
				this.didReuseSsrDom = false;
			}
		}

		return super.update(node, decorations, _innerDecorations, validUpdate);
	}

	/**
	 * When interacting with input elements inside an extension's body, the events
	 * bubble up to the editor and get handled by it. This almost always gets in the way
	 * of being able to actually interact with said input in the extension, i.e.
	 * typing inside a text field (in an extension body) will print the text in the editor
	 * content area instead. This change prevents the editor view from trying to handle these events,
	 * when the target of the event is an input element, so the extension can.
	 */
	stopEvent(event: Event): boolean {
		if (fg('forge-ui-extensionnodeview-stop-event-for-textarea')) {
			return (
				event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement
			);
		}

		return event.target instanceof HTMLInputElement;
	}

	getContentDOM():
		| {
				contentDOM: HTMLDivElement;
				dom: HTMLDivElement;
		  }
		| {
				contentDOM?: undefined;
				dom: HTMLDivElement;
		  }
		| undefined {
		if (this.node.isInline) {
			return;
		}

		if (this.didReuseSsrDom) {
			return;
		}

		const contentDomWrapper = document.createElement('div');
		contentDomWrapper.className = `${this.node.type.name}-content-dom-wrapper`;

		const isBodiedExtension = this.node.type.name === 'bodiedExtension';
		const showMacroInteractionDesignUpdates =
			this.reactComponentProps?.macroInteractionDesignFeatureFlags
				?.showMacroInteractionDesignUpdates;

		if (
			isBodiedExtension &&
			showMacroInteractionDesignUpdates &&
			expValEquals('platform_editor_bodiedextension_layoutshift_fix', 'isEnabled', true)
		) {
			// Create outer wrapper to hold space for the lozenge
			const outerWrapper = document.createElement('div');
			outerWrapper.className = `${this.node.type.name}-content-outer-wrapper`;

			// Create inner wrapper to position inner content
			const innerWrapper = document.createElement('div');
			innerWrapper.className = `${this.node.type.name}-content-inner-wrapper`;

			innerWrapper.appendChild(contentDomWrapper);
			outerWrapper.appendChild(innerWrapper);
			return { dom: outerWrapper, contentDOM: contentDomWrapper };
		}

		return { dom: contentDomWrapper };
	}

	render(
		props: {
			extensionHandlers: ExtensionHandlers;
			// referentiality plugin won't utilise appearance just yet
			extensionNodeViewOptions?: ExtensionNodeViewOptions;
			macroInteractionDesignFeatureFlags?: MacroInteractionDesignFeatureFlags;
			pluginInjectionApi: ExtensionsPluginInjectionAPI;
			providerFactory: ProviderFactory;
			rendererExtensionHandlers?: ExtensionHandlers;
			showLivePagesBodiedMacrosRendererView?: (node: ADFEntity) => boolean;
			showUpdatedLivePages1PBodiedExtensionUI?: (node: ADFEntity) => boolean;
		},
		forwardRef: ForwardRef,
	): React.JSX.Element {
		// If we reused SSR'd DOM on first init, don't render React Portal
		// The SSR content is already perfect and doesn't need re-rendering
		if (this.didReuseSsrDom && this.isFirstInit) {
			return null as unknown as React.JSX.Element;
		}

		return (
			<ExtensionNodeWrapper
				nodeType={this.node.type.name}
				macroInteractionDesignFeatureFlags={props.macroInteractionDesignFeatureFlags}
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
