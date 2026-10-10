import React from 'react';

import type { IntlShape } from 'react-intl';

import type { PortalProviderAPI } from '@atlaskit/editor-common/common';
import type { EventDispatcher } from '@atlaskit/editor-common/event-dispatcher';
import { isSSR } from '@atlaskit/editor-common/is-ssr';
import ReactNodeView, { NodeViewContentHole } from '@atlaskit/editor-common/react-node-view';
import { ignoreResizerMutations } from '@atlaskit/editor-common/resizer/BreakoutResizer';
import type { getPosHandlerNode } from '@atlaskit/editor-common/types/editor-plugin';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types/next-editor-plugin';
import { DOMSerializer } from '@atlaskit/editor-prosemirror/model';
import type { DOMOutputSpec, Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import { fg } from '@atlaskit/platform-feature-flags/fg';

import type { LayoutPlugin } from '../layoutPluginType';
import type { LayoutPluginOptions } from '../types';
import { LayoutSSRReactContextsProvider } from '../ui/LayoutSSRReactContextsProvider';
import { isEmptyLayout } from './utils';

type LayoutSectionViewProps = {
	eventDispatcher: EventDispatcher;
	getPos: getPosHandlerNode;
	intl?: IntlShape;
	node: PMNode;
	options: LayoutPluginOptions;
	pluginInjectionApi?: ExtractInjectionAPI<LayoutPlugin>;
	portalProviderAPI: PortalProviderAPI;
	view: EditorView;
};

type ForwardRef = (ref: HTMLElement | null) => void;

const toDOM = (node: PMNode) =>
	[
		'div',
		{ class: 'layout-section-container' },
		[
			'div',
			{
				'data-layout-section': true,
				...(fg('platform_editor_adf_with_localid') && { 'data-local-id': node.attrs.localId }),
			},
			0,
		],
	] as DOMOutputSpec;

/**
 *
 */
export class LayoutSectionView extends ReactNodeView<LayoutSectionViewProps> {
	options: LayoutPluginOptions;
	layoutDOM?: HTMLElement;
	isEmpty?: boolean;
	private intl?: IntlShape;

	/**
	 * constructor
	 * @param props
	 * @param props.node
	 * @param props.view
	 * @param props.getPos
	 * @param props.portalProviderAPI
	 * @param props.eventDispatcher
	 * @param props.pluginInjectionApi
	 * @param props.options
	 * @param props.intl
	 * @example
	 */
	constructor(props: {
		eventDispatcher: EventDispatcher;
		getPos: getPosHandlerNode;
		intl?: IntlShape;
		node: PMNode;
		options: LayoutPluginOptions;
		pluginInjectionApi: ExtractInjectionAPI<LayoutPlugin>;
		portalProviderAPI: PortalProviderAPI;
		view: EditorView;
	}) {
		super(
			props.node,
			props.view,
			props.getPos,
			props.portalProviderAPI,
			props.eventDispatcher,
			props,
		);
		this.isEmpty = isEmptyLayout(this.node);
		this.options = props.options;
		this.intl = props.intl;
	}

	/**
	 * getContentDOM
	 * @example
	 * @returns
	 */
	getContentDOM(): {
		contentDOM: HTMLElement | undefined;
		dom: HTMLElement;
	} {
		// Build the layout DOM via the schema's toDOM spec. This is the same
		// path used in both CSR and SSR — the only SSR-specific concern is
		// re-attaching `contentDOM` (= the `[data-layout-section]` element)
		// after the portal's renderToStaticMarkup + innerHTML write detaches
		// it. We handle that by stamping `data-ssr-content-dom-ref` on the
		// outer container so `ReactNodeView.init()` can find a re-attach
		// target inside `domRef` after the portal write.
		const { dom: container, contentDOM } = DOMSerializer.renderSpec(document, toDOM(this.node)) as {
			contentDOM?: HTMLElement;
			dom: HTMLElement;
		};

		// Ignored via go/ees005
		// eslint-disable-next-line @atlaskit/editor/no-as-casting
		this.layoutDOM = container.querySelector('[data-layout-section]') as HTMLElement;
		this.layoutDOM.setAttribute('data-column-rule-style', this.node.attrs.columnRuleStyle);
		this.layoutDOM.setAttribute('data-empty-layout', Boolean(this.isEmpty).toString());
		if (fg('platform_editor_adf_with_localid')) {
			this.layoutDOM.setAttribute('data-local-id', this.node.attrs.localId);
		}

		// SSR streaming re-attach note:
		// In SSR, `init()` appends `container` into `domRef`; the portal's
		// renderToStaticMarkup + innerHTML write then wipes `domRef`,
		// detaching the entire subtree (with PM-serialized children inside
		// `[data-layout-section]`). React's `render()` emits a
		// `<NodeViewContentHole/>` placeholder inside `domRef`; the SSR
		// re-attach logic in `init()` finds it via `[data-ssr-content-dom-ref]`
		// and calls `_handleRef`, which appends `contentDOMWrapper` (the
		// detached `container`) back inside the placeholder. The end result
		// is `domRef > NodeViewContentHole > layout-section-container >
		// [data-layout-section] > [data-layout-column] children` — the
		// layout DOM contract is preserved.

		return { dom: container, contentDOM };
	}

	/**
	 * setDomAttrs
	 * @param node
	 * @param element
	 * @example
	 */
	setDomAttrs(node: PMNode, _element: HTMLElement): void {
		if (this.layoutDOM) {
			this.layoutDOM.setAttribute('data-column-rule-style', node.attrs.columnRuleStyle);
		}
	}

	/**
	 * render
	 * @param props
	 * @param forwardRef
	 * @example
	 * @returns
	 */
	render(props: LayoutSectionViewProps, forwardRef: ForwardRef): React.JSX.Element | null {
		this.isEmpty = isEmptyLayout(this.node);
		if (this.layoutDOM) {
			this.layoutDOM.setAttribute('data-empty-layout', Boolean(this.isEmpty).toString());
		}

		// SSR streaming path: render only a `<NodeViewContentHole/>` placeholder
		// so ReactNodeView.init()'s SSR re-attach logic can find the marker
		// (`data-ssr-content-dom-ref`) and re-append the detached
		// contentDOMWrapper — which is the FULL layout structure
		// (`layout-section-container > [data-layout-section] > children`) built
		// in `getContentDOM` via DOMSerializer.renderSpec. This avoids
		// duplicating layout structure between getContentDOM and render(), which
		// previously caused an extra wrapping div between `[data-layout-section]`
		// and the `[data-layout-column]` children and broke the flex layout.
		//
		// The BreakoutResizer is intentionally omitted in SSR — it relies on
		// browser-only APIs and contributes no useful static markup. The
		// LayoutSSRReactContextsProvider wraps the placeholder to inject the
		// editor's IntlShape, defending against any descendants that call
		// `useIntl()` during renderToStaticMarkup.
		if (isSSR()) {
			return (
				<LayoutSSRReactContextsProvider intl={this.intl}>
					<NodeViewContentHole ref={forwardRef} />
				</LayoutSSRReactContextsProvider>
			);
		}

		return null;
	}

	/**
	 * ignoreMutation
	 * @param mutation
	 * @example
	 * @returns
	 */
	ignoreMutation(mutation: MutationRecord | { target: Node; type: 'selection' }): boolean {
		return ignoreResizerMutations(mutation);
	}
}
