import React, { useCallback } from 'react';

import { type EventDispatcher } from '@atlaskit/editor-common/event-dispatcher';
import { useSharedPluginState } from '@atlaskit/editor-common/hooks';
import { type PortalProviderAPI } from '@atlaskit/editor-common/portal';
import ReactNodeView from '@atlaskit/editor-common/react-node-view';
import { BreakoutResizer, ignoreResizerMutations } from '@atlaskit/editor-common/resizer';
import { type ExtractInjectionAPI, type getPosHandlerNode } from '@atlaskit/editor-common/types';
import {
	DOMSerializer,
	Schema,
	type DOMOutputSpec,
	type Node as PMNode,
} from '@atlaskit/editor-prosemirror/model';
import { type EditorView } from '@atlaskit/editor-prosemirror/view';
import { fg } from '@atlaskit/platform-feature-flags';

import { type LayoutPlugin } from '../layoutPluginType';
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
	const { editorDisabledState } = useSharedPluginState(pluginInjectionApi, ['editorDisabled']);

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

	return (
		<BreakoutResizer
			getRef={forwardRef}
			getPos={getPos}
			editorView={view}
			nodeType="layoutSection"
			getEditorWidth={getEditorWidth}
			disabled={
				editorDisabledState?.editorDisabled === true || !isBreakoutAvailable(view.state.schema)
			}
			parentRef={parentRef}
			editorAnalyticsApi={pluginInjectionApi?.analytics?.actions}
			displayGapCursor={displayGapCursor}
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

export class LayoutSectionView extends ReactNodeView<LayoutSectionViewProps> {
	options: LayoutPluginOptions;
	layoutDOM?: HTMLElement;
	isEmpty?: boolean;

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
		if (fg('platform_editor_advanced_layouts_post_fix_patch_1')) {
			this.isEmpty = isEmptyLayout(this.node);
		}

		this.options = props.options;
	}

	getContentDOM() {
		const { dom: container, contentDOM } = DOMSerializer.renderSpec(document, toDOM()) as {
			dom: HTMLElement;
			contentDOM?: HTMLElement;
		};

		// Ignored via go/ees005
		// eslint-disable-next-line @atlaskit/editor/no-as-casting
		this.layoutDOM = container.querySelector('[data-layout-section]') as HTMLElement;
		this.layoutDOM.setAttribute('data-column-rule-style', this.node.attrs.columnRuleStyle);
		if (fg('platform_editor_advanced_layouts_post_fix_patch_1')) {
			this.layoutDOM.setAttribute('data-empty-layout', Boolean(this.isEmpty).toString());
		}

		return { dom: container, contentDOM };
	}

	setDomAttrs(node: PMNode, element: HTMLElement): void {
		if (this.layoutDOM) {
			this.layoutDOM.setAttribute('data-column-rule-style', node.attrs.columnRuleStyle);
		}
	}

	render(props: LayoutSectionViewProps, forwardRef: ForwardRef) {
		if (fg('platform_editor_advanced_layouts_post_fix_patch_1')) {
			this.isEmpty = isEmptyLayout(this.node);
			if (this.layoutDOM) {
				this.layoutDOM.setAttribute('data-empty-layout', Boolean(this.isEmpty).toString());
			}
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

	ignoreMutation(mutation: MutationRecord | { type: 'selection'; target: Element }) {
		return ignoreResizerMutations(mutation);
	}
}
