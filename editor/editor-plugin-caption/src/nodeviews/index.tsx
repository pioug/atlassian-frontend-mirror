import React from 'react';

import type { EventDispatcher } from '@atlaskit/editor-common/event-dispatcher';
import { type PortalProviderAPI } from '@atlaskit/editor-common/portal';
import type {
	ForwardRef,
	ReactComponentProps,
	shouldUpdate,
} from '@atlaskit/editor-common/react-node-view';
import { SelectionBasedNodeView } from '@atlaskit/editor-common/selection-based-node-view';
import type {
	ExtractInjectionAPI,
	getPosHandler,
	getPosHandlerNode,
} from '@atlaskit/editor-common/types';
import { Caption } from '@atlaskit/editor-common/ui';
import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';

import type { CaptionPlugin } from '../captionPluginType';

export class CaptionNodeView extends SelectionBasedNodeView {
	private selected = this.insideSelection();
	private cleanupEditorDisabledListener?: () => void;
	pluginInjectionApi?: ExtractInjectionAPI<CaptionPlugin>;

	constructor(
		node: PMNode,
		view: EditorView,
		getPos: getPosHandler,
		portalProviderAPI: PortalProviderAPI,
		eventDispatcher: EventDispatcher,
		reactComponentProps: ReactComponentProps,
		reactComponent?: React.ComponentType<React.PropsWithChildren<unknown>>,
		viewShouldUpdate?: shouldUpdate,
		pluginInjectionApi?: ExtractInjectionAPI<CaptionPlugin>,
	) {
		super(
			node,
			view,
			getPos,
			portalProviderAPI,
			eventDispatcher,
			reactComponentProps,
			reactComponent,
			viewShouldUpdate,
		);
		this.pluginInjectionApi = pluginInjectionApi;
		this.handleEditorDisabledChanged();
	}

	createDomRef() {
		const domRef = document.createElement('figcaption');
		domRef.setAttribute('data-caption', 'true');
		return domRef;
	}

	getContentDOM() {
		const dom = document.createElement('div');
		// setting a className prevents PM/Chrome mutation observer from
		// incorrectly deleting nodes
		dom.className = 'caption-wrapper';
		dom.setAttribute(
			'contenteditable',
			this.pluginInjectionApi?.editorDisabled?.sharedState.currentState()?.editorDisabled
				? 'false'
				: 'true',
		);
		return { dom };
	}

	// ED-24114: We need to ignore mutations that are not related to the caption node
	// since these mutations can cause an infinite loop in React 18 when using createRoot
	ignoreMutation(mutation: MutationRecord | { target: Node; type: 'selection' }) {
		if (!this.contentDOM) {
			return true;
		}
		return !this.contentDOM.contains(mutation.target) && mutation.type !== 'selection';
	}

	handleEditorDisabledChanged() {
		if (this.pluginInjectionApi?.editorDisabled) {
			this.cleanupEditorDisabledListener =
				this.pluginInjectionApi.editorDisabled.sharedState.onChange((sharedState) => {
					if (this.contentDOM) {
						this.contentDOM.setAttribute(
							'contenteditable',
							sharedState.nextSharedState.editorDisabled ? 'false' : 'true',
						);
					}
				});
		}
	}

	render(_props: never, forwardRef: ForwardRef): React.JSX.Element {
		return (
			<Caption selected={this.insideSelection()} hasContent={this.node.content.childCount > 0}>
				<div ref={forwardRef} />
			</Caption>
		);
	}

	viewShouldUpdate(nextNode: PMNode) {
		if (this.node.childCount !== nextNode.childCount) {
			return true;
		}

		const newSelected = this.insideSelection();
		const selectedStateChange = this.selected !== newSelected;
		this.selected = newSelected;

		return selectedStateChange;
	}

	destroy() {
		if (this.cleanupEditorDisabledListener) {
			this.cleanupEditorDisabledListener();
		}
		this.cleanupEditorDisabledListener = undefined;
	}
}

export default function captionNodeView(
	portalProviderAPI: PortalProviderAPI,
	eventDispatcher: EventDispatcher,
	pluginInjectionApi: ExtractInjectionAPI<CaptionPlugin> | undefined,
) {
	return (node: PMNode, view: EditorView, getPos: getPosHandler) => {
		return new CaptionNodeView(
			node,
			view,
			getPos as getPosHandlerNode,
			portalProviderAPI,
			eventDispatcher,
			{},
			undefined,
			undefined,
			pluginInjectionApi,
		).init();
	};
}
