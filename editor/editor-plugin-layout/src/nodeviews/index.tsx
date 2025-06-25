import React, { useCallback } from 'react';

import { type EventDispatcher } from '@atlaskit/editor-common/event-dispatcher';
import { type GuidelineConfig } from '@atlaskit/editor-common/guideline';
import {
	useSharedPluginState,
	sharedPluginStateHookMigratorFactory,
} from '@atlaskit/editor-common/hooks';
import { type PortalProviderAPI } from '@atlaskit/editor-common/portal';
import ReactNodeView from '@atlaskit/editor-common/react-node-view';
import { BreakoutResizer, ignoreResizerMutations } from '@atlaskit/editor-common/resizer';
import { type ExtractInjectionAPI, type getPosHandlerNode } from '@atlaskit/editor-common/types';
import { useSharedPluginStateSelector } from '@atlaskit/editor-common/use-shared-plugin-state-selector';
import {
	DOMSerializer,
	Schema,
	type DOMOutputSpec,
	type Node as PMNode,
} from '@atlaskit/editor-prosemirror/model';
import { type EditorView } from '@atlaskit/editor-prosemirror/view';
import { editorExperiment } from '@atlaskit/tmp-editor-statsig/experiments';

import { type LayoutPlugin } from '../layoutPluginType';
import { selectIntoLayout } from '../pm-plugins/utils';
import { type LayoutPluginOptions } from '../types';

type LayoutSectionViewProps = {
	node: PMNode;
	view: EditorView;
	getPos: getPosHandlerNode;
	portalProviderAPI: PortalProviderAPI;
	eventDispatcher: EventDispatcher;
	pluginInjectionApi?: ExtractInjectionAPI<LayoutPlugin>;
	options: LayoutPluginOptions;
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

const useSharedState = sharedPluginStateHookMigratorFactory(
	(api: ExtractInjectionAPI<LayoutPlugin> | undefined) => {
		const editorDisabled = useSharedPluginStateSelector(api, 'editorDisabled.editorDisabled');
		return { editorDisabled };
	},
	(api: ExtractInjectionAPI<LayoutPlugin> | undefined) => {
		const { editorDisabledState } = useSharedPluginState(api, ['editorDisabled']);
		return { editorDisabled: editorDisabledState?.editorDisabled };
	},
);

const LayoutBreakoutResizer = ({
	pluginInjectionApi,
	forwardRef,
	getPos,
	view,
	parentRef,
}: {
	view: EditorView;
	getPos: getPosHandlerNode;
	pluginInjectionApi?: ExtractInjectionAPI<LayoutPlugin>;
	forwardRef: ForwardRef;
	parentRef?: HTMLElement;
}) => {
	const { editorDisabled } = useSharedState(pluginInjectionApi);
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

	if (interactionState === 'hasNotHadInteraction') {
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
			parentRef={parentRef}
			editorAnalyticsApi={pluginInjectionApi?.analytics?.actions}
			displayGuidelines={
				editorExperiment('single_column_layouts', true) ? displayGuidelines : undefined
			}
			displayGapCursor={displayGapCursor}
			onResizeStart={() => {
				selectIntoCurrentLayout();
			}}
			dynamicFullWidthGuidelineOffset={layoutDynamicFullWidthGuidelineOffset}
		/>
	);
};

type ForwardRef = (ref: HTMLElement | null) => void;

const toDOM = () =>
	[
		'div',
		{ class: 'layout-section-container' },
		['div', { 'data-layout-section': true }, 0],
	] as DOMOutputSpec;

/**
 *
 */
export class LayoutSectionView extends ReactNodeView<LayoutSectionViewProps> {
	options: LayoutPluginOptions;
	layoutDOM?: HTMLElement;
	isEmpty?: boolean;

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
	 * @example
	 */
	constructor(props: {
		node: PMNode;
		view: EditorView;
		getPos: getPosHandlerNode;
		portalProviderAPI: PortalProviderAPI;
		eventDispatcher: EventDispatcher;
		pluginInjectionApi: ExtractInjectionAPI<LayoutPlugin>;
		options: LayoutPluginOptions;
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
	}

	/**
	 * getContentDOM
	 * @example
	 * @returns
	 */
	getContentDOM() {
		const { dom: container, contentDOM } = DOMSerializer.renderSpec(document, toDOM()) as {
			dom: HTMLElement;
			contentDOM?: HTMLElement;
		};

		// Ignored via go/ees005
		// eslint-disable-next-line @atlaskit/editor/no-as-casting
		this.layoutDOM = container.querySelector('[data-layout-section]') as HTMLElement;
		this.layoutDOM.setAttribute('data-column-rule-style', this.node.attrs.columnRuleStyle);
		this.layoutDOM.setAttribute('data-empty-layout', Boolean(this.isEmpty).toString());

		return { dom: container, contentDOM };
	}

	/**
	 * setDomAttrs
	 * @param node
	 * @param element
	 * @example
	 */
	setDomAttrs(node: PMNode, element: HTMLElement): void {
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
	render(props: LayoutSectionViewProps, forwardRef: ForwardRef) {
		this.isEmpty = isEmptyLayout(this.node);
		if (this.layoutDOM) {
			this.layoutDOM.setAttribute('data-empty-layout', Boolean(this.isEmpty).toString());
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
	ignoreMutation(mutation: MutationRecord | { type: 'selection'; target: Node }) {
		return ignoreResizerMutations(mutation);
	}
}
