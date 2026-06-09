import React, { useCallback } from 'react';

import type { IntlShape } from 'react-intl';

import { isSSR, isSSRStreaming } from '@atlaskit/editor-common/core-utils';
import type { EventDispatcher } from '@atlaskit/editor-common/event-dispatcher';
import type { GuidelineConfig } from '@atlaskit/editor-common/guideline';
import { useSharedPluginStateWithSelector } from '@atlaskit/editor-common/hooks';
import type { NamedPluginStatesFromInjectionAPI } from '@atlaskit/editor-common/hooks';
import type { PortalProviderAPI } from '@atlaskit/editor-common/portal';
import ReactNodeView, { NodeViewContentHole } from '@atlaskit/editor-common/react-node-view';
import { BreakoutResizer, ignoreResizerMutations } from '@atlaskit/editor-common/resizer';
import type { ExtractInjectionAPI, getPosHandlerNode } from '@atlaskit/editor-common/types';
import { useSharedPluginStateSelector } from '@atlaskit/editor-common/use-shared-plugin-state-selector';
import { DOMSerializer } from '@atlaskit/editor-prosemirror/model';
import type { Schema, DOMOutputSpec, Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import { fg } from '@atlaskit/platform-feature-flags';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';
import { editorExperiment } from '@atlaskit/tmp-editor-statsig/experiments';

import type { LayoutPlugin } from '../layoutPluginType';
import { selectIntoLayout } from '../pm-plugins/utils';
import type { LayoutPluginOptions } from '../types';
import { LayoutSSRReactContextsProvider } from '../ui/LayoutSSRReactContextsProvider';

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

const layoutDynamicFullWidthGuidelineOffset = 16;

const isEmptyParagraph = (node?: PMNode | null): boolean => {
	return !!node && node.type.name === 'paragraph' && !node.childCount;
};

const isBreakoutAvailable = (schema: Schema) => {
	return Boolean(schema.marks.breakout);
};

const isEmptyLayout = (node?: PMNode) => {
	if (!node) {
		return false;
	}
	// fast check
	// each column should have size 2 from layoutcolumn and 2 from empty paragraph
	if (node.content.size / node.childCount !== 4) {
		return false;
	}

	let isEmpty = true;

	node.content.forEach((maybelayoutColumn) => {
		if (
			maybelayoutColumn.type.name !== 'layoutColumn' ||
			maybelayoutColumn.childCount > 1 ||
			!isEmptyParagraph(maybelayoutColumn.firstChild)
		) {
			isEmpty = false;
			return;
		}
	});

	return isEmpty;
};

const selector = (
	states: NamedPluginStatesFromInjectionAPI<ExtractInjectionAPI<LayoutPlugin>, 'editorDisabled'>,
) => {
	return {
		editorDisabled: states.editorDisabledState?.editorDisabled,
	};
};

const LayoutBreakoutResizer = ({
	pluginInjectionApi,
	forwardRef,
	getPos,
	view,
	parentRef,
}: {
	forwardRef: ForwardRef;
	getPos: getPosHandlerNode;
	parentRef?: HTMLElement;
	pluginInjectionApi?: ExtractInjectionAPI<LayoutPlugin>;
	view: EditorView;
}) => {
	const { editorDisabled } = useSharedPluginStateWithSelector(
		pluginInjectionApi,
		['editorDisabled'],
		selector,
	);
	const interactionState = useSharedPluginStateSelector(
		pluginInjectionApi,
		'interaction.interactionState',
	);

	const getEditorWidth = () => {
		return pluginInjectionApi?.width?.sharedState.currentState();
	};

	const displayGapCursor = useCallback(
		(toggle: boolean) => {
			return (
				pluginInjectionApi?.core?.actions.execute(
					pluginInjectionApi?.selection?.commands.displayGapCursor(toggle),
				) ?? false
			);
		},
		[pluginInjectionApi],
	);

	const displayGuidelines = useCallback(
		(guidelines: GuidelineConfig[]) => {
			pluginInjectionApi?.guideline?.actions?.displayGuideline(view)({
				guidelines,
			});
		},
		[pluginInjectionApi, view],
	);

	// we want to hide the floating toolbar for other nodes.
	// e.g. info panel inside the current layout section
	const selectIntoCurrentLayout = useCallback(() => {
		const pos = getPos();
		if (pos === undefined) {
			return;
		}
		// put the selection into the first column of the layout
		selectIntoLayout(view, pos, 0);
	}, [getPos, view]);

	if (
		interactionState === 'hasNotHadInteraction' &&
		!expValEquals('platform_editor_breakout_interaction_rerender', 'isEnabled', true)
	) {
		return null;
	}

	return (
		<BreakoutResizer
			getRef={forwardRef}
			getPos={getPos}
			editorView={view}
			nodeType="layoutSection"
			getEditorWidth={getEditorWidth}
			disabled={
				editorExperiment('platform_editor_breakout_resizing', true)
					? true
					: editorDisabled === true || !isBreakoutAvailable(view.state.schema)
			}
			hidden={
				interactionState === 'hasNotHadInteraction' &&
				expValEquals('platform_editor_breakout_interaction_rerender', 'isEnabled', true)
			}
			parentRef={parentRef}
			editorAnalyticsApi={pluginInjectionApi?.analytics?.actions}
			displayGuidelines={
				editorExperiment('single_column_layouts', true) ? displayGuidelines : undefined
			}
			displayGapCursor={displayGapCursor}
			// eslint-disable-next-line @atlassian/perf-linting/no-unstable-inline-props -- Ignored via go/ees017 (to be fixed)
			onResizeStart={() => {
				selectIntoCurrentLayout();
			}}
			dynamicFullWidthGuidelineOffset={layoutDynamicFullWidthGuidelineOffset}
		/>
	);
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
		if (isSSR() && isSSRStreaming()) {
			return (
				<LayoutSSRReactContextsProvider intl={this.intl}>
					<NodeViewContentHole ref={forwardRef} />
				</LayoutSSRReactContextsProvider>
			);
		}

		if (expValEquals('platform_editor_breakout_resizing', 'isEnabled', true)) {
			return null;
		}

		return (
			<LayoutBreakoutResizer
				pluginInjectionApi={props.pluginInjectionApi}
				forwardRef={forwardRef}
				getPos={props.getPos}
				view={props.view}
				parentRef={this.layoutDOM}
			/>
		);
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
