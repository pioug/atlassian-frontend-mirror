import React from 'react';

import type { IntlShape } from 'react-intl';

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
	intl?: IntlShape;
	macroInteractionDesignFeatureFlags?: MacroInteractionDesignFeatureFlags;
	pluginInjectionApi: ExtensionsPluginInjectionAPI;
	providerFactory: ProviderFactory;
	rendererExtensionHandlers?: ExtensionHandlers;
	showLivePagesBodiedMacrosRendererView?: (node: ADFEntity) => boolean;
	showUpdatedLivePages1PBodiedExtensionUI?: (node: ADFEntity) => boolean;
}

/**
 * Allowlists of extension keys + layout
 * Currently, only toc with default layout allows to skip React render.
 * Extensions NOT in this list always follow the normal React render path.
 */
const ssrHydrationExtensionAllowlist = ['toc'];
const ssrHydrationLayoutAllowlist = ['default'];

const isSSRHydrationEligible = (node: PmNode): boolean => {
	if (node.type.name !== 'extension') {
		return false;
	}
	const { extensionKey, layout } = node.attrs ?? {};
	if (!ssrHydrationExtensionAllowlist.includes(extensionKey)) {
		return false;
	}
	// Treat a missing layout attr as `default` (the schema default).
	const effectiveLayout = layout ?? 'default';
	return ssrHydrationLayoutAllowlist.includes(effectiveLayout);
};

/**
 * Per-(EditorView, extensionKey + localId) record of which extension identities
 * have already had their initial-hydration init pass. SSR DOM reuse is only valid
 * the very first time an ExtensionNode init runs for a given identity in a given
 * editor — that is the only moment a real SSR-rendered element for that identity
 * can exist in the editor DOM.
 *
 * After the first init, any element matching the SSR selector is the previous
 * node view's React-rendered domRef that ProseMirror has not yet detached (e.g.
 * during DnD / layout resize, where ProseMirror constructs the new node view
 * BEFORE destroying the old one). Reusing it as if it were SSR DOM causes the
 * new node view to skip React rendering and leaves the extension invisible
 * (EDITOR-6613).
 */
const consumedHydrationIdentitiesByEditor = new WeakMap<EditorView, Set<string>>();

const getHydrationIdentityKey = (extensionKey: unknown, localId: unknown): string | null => {
	if (typeof extensionKey !== 'string' || typeof localId !== 'string') {
		return null;
	}
	if (extensionKey === '' || localId === '') {
		return null;
	}
	return `${extensionKey}::${localId}`;
};

const hasHydrationIdentityBeenConsumed = (view: EditorView, identityKey: string): boolean => {
	const consumed = consumedHydrationIdentitiesByEditor.get(view);
	return consumed ? consumed.has(identityKey) : false;
};

const markHydrationIdentityAsConsumed = (view: EditorView, identityKey: string): void => {
	let consumed = consumedHydrationIdentitiesByEditor.get(view);
	if (!consumed) {
		consumed = new Set<string>();
		consumedHydrationIdentitiesByEditor.set(view, consumed);
	}
	consumed.add(identityKey);
};

// getInlineNodeViewProducer is a new api to use instead of ReactNodeView
// when creating inline node views, however, it is difficult to test the impact
// on selections when migrating inlineExtension to use the new api.
// The ReactNodeView api will be visited in the second phase of the selections
// project whilst investigating block nodes. We will revisit the Extension node view there too.
export class ExtensionNode<AdditionalParams = unknown> extends ReactNodeView<
	ReactExtensionNodeProps & AdditionalParams
> {
	/** True between SSR DOM adoption in `createDomRef` and the SSR→React handoff in `update`. */
	private didReuseSsrDom = false;

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

	/** See {@link consumedHydrationIdentitiesByEditor}. Null when attrs are missing → SSR reuse skipped. */
	private getHydrationIdentityKey(): string | null {
		return getHydrationIdentityKey(this.node.attrs?.extensionKey, this.node.attrs?.localId);
	}

	/** True only for the first ExtensionNode of this identity in this editor. See {@link consumedHydrationIdentitiesByEditor}. */
	private isInInitialHydrationWindow(): boolean {
		const identityKey = this.getHydrationIdentityKey();
		if (identityKey === null) {
			return false;
		}
		return !hasHydrationIdentityBeenConsumed(this.view, identityKey);
	}

	// Reserve height by setting a minimum height for the extension node view element
	createDomRef(): HTMLElement {
		if (!fg('confluence_connect_macro_preset_height')) {
			// SSR DOM reuse — see {@link consumedHydrationIdentitiesByEditor}.
			if (
				!isSSR() &&
				isSSRHydrationEligible(this.node) &&
				this.isInInitialHydrationWindow() &&
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

	/** Skip React Portal render on first init when reusing SSR DOM. See {@link consumedHydrationIdentitiesByEditor}. */
	init(): this {
		if (!expValEquals('platform_editor_hydration_skip_react_portal', 'isEnabled', true)) {
			super.init();
		} else {
			const isEligibleForSsrReuse = !isSSR() && isSSRHydrationEligible(this.node);

			if (isEligibleForSsrReuse && this.isInInitialHydrationWindow()) {
				const ssrElement = this.findSSRElement();
				const shouldSkipInitRender = ssrElement !== null;
				super.init(shouldSkipInitRender);
				const identityKey = this.getHydrationIdentityKey();
				if (identityKey !== null) {
					// Close the hydration window — see {@link consumedHydrationIdentitiesByEditor}.
					markHydrationIdentityAsConsumed(this.view, identityKey);
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
					'[data-testid="extension-node-wrapper"]',
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
	 * Prevents ProseMirror from handling events that belong to the extension's React UI.
	 *
	 * For multibodied extensions: the node consists of a React app (e.g. tab bar) that controls
	 * frames, and the editable frames themselves. Events inside frames must reach ProseMirror
	 * for normal editing; events in the surrounding React app (buttons, navigation) are stopped
	 * so ProseMirror doesn't create a NodeSelection on the entire node.
	 *
	 * For other extensions: input/textarea events are stopped so users can interact
	 * with form elements inside the extension body without the editor intercepting them.
	 */
	stopEvent(event: Event): boolean {
		if (this.node.type.name === 'multiBodiedExtension') {
			const target = event.target;
			if (target instanceof Element) {
				if (target.closest('[data-multibodiedextension-frames]')) {
					return false;
				}
				return !!target.closest('[data-multiBodiedExtension-container]');
			}
			return false;
		}

		return event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement;
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
			intl?: IntlShape;
			macroInteractionDesignFeatureFlags?: MacroInteractionDesignFeatureFlags;
			pluginInjectionApi: ExtensionsPluginInjectionAPI;
			providerFactory: ProviderFactory;
			rendererExtensionHandlers?: ExtensionHandlers;
			showLivePagesBodiedMacrosRendererView?: (node: ADFEntity) => boolean;
			showUpdatedLivePages1PBodiedExtensionUI?: (node: ADFEntity) => boolean;
		},
		forwardRef: ForwardRef,
	): React.JSX.Element {
		// While sitting on SSR DOM, skip the React portal — see {@link didReuseSsrDom}.
		if (this.didReuseSsrDom) {
			return null as unknown as React.JSX.Element;
		}

		return (
			<ExtensionNodeWrapper
				intl={props.intl}
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

// eslint-disable-next-line @atlaskit/volt-strict-mode/no-multiple-exports
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
	intl?: IntlShape,
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
			intl,
		}).init();
	};
}
