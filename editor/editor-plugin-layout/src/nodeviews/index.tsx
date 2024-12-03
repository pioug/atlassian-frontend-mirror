import React from 'react';

import { type EventDispatcher } from '@atlaskit/editor-common/event-dispatcher';
import { useSharedPluginState } from '@atlaskit/editor-common/hooks';
import { type PortalProviderAPI } from '@atlaskit/editor-common/portal';
import ReactNodeView from '@atlaskit/editor-common/react-node-view';
import { BreakoutResizer, ignoreResizerMutations } from '@atlaskit/editor-common/resizer';
import { type ExtractInjectionAPI, type getPosHandlerNode } from '@atlaskit/editor-common/types';
import {
	type DOMOutputSpec,
	DOMSerializer,
	type Node as PMNode,
} from '@atlaskit/editor-prosemirror/model';
import { type EditorView } from '@atlaskit/editor-prosemirror/view';

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

	return (
		<BreakoutResizer
			getRef={forwardRef}
			getPos={getPos}
			editorView={view}
			nodeType="layoutSection"
			getEditorWidth={getEditorWidth}
			disabled={editorDisabledState?.editorDisabled === true}
			parentRef={parentRef}
			editorAnalyticsApi={pluginInjectionApi?.analytics?.actions}
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
		this.options = props.options;
	}

	getContentDOM() {
		const { dom: container, contentDOM } = DOMSerializer.renderSpec(document, toDOM()) as {
			dom: HTMLElement;
			contentDOM?: HTMLElement;
		};
		this.layoutDOM = container.querySelector('[data-layout-section]') as HTMLElement;
		this.layoutDOM.setAttribute('data-column-rule-style', this.node.attrs.columnRuleStyle);
		return { dom: container, contentDOM };
	}

	setDomAttrs(node: PMNode, element: HTMLElement): void {
		if (this.layoutDOM) {
			this.layoutDOM.setAttribute('data-column-rule-style', node.attrs.columnRuleStyle);
		}
	}

	render(props: LayoutSectionViewProps, forwardRef: ForwardRef) {
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
