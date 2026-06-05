import React from 'react';

import { RawIntlProvider, type IntlShape } from 'react-intl';

import { getDocument } from '@atlaskit/browser-apis';
import { isSSR, isSSRStreaming } from '@atlaskit/editor-common/core-utils';
import type { EventDispatcher } from '@atlaskit/editor-common/event-dispatcher';
import type { PortalProviderAPI } from '@atlaskit/editor-common/portal';
import type {
	ForwardRef,
	ReactComponentProps,
	shouldUpdate,
} from '@atlaskit/editor-common/react-node-view';
import { NodeViewContentHole } from '@atlaskit/editor-common/react-node-view';
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
	private intl?: IntlShape;

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
		intl?: IntlShape,
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
		this.intl = intl;
		this.handleEditorDisabledChanged();
	}

	createDomRef(): HTMLElement {
		const domRef = (getDocument() ?? document).createElement('figcaption');
		domRef.setAttribute('data-caption', 'true');
		return domRef;
	}

	getContentDOM(): {
		dom: HTMLDivElement;
	} {
		const dom = (getDocument() ?? document).createElement('div');
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
	ignoreMutation(mutation: MutationRecord | { target: Node; type: 'selection' }): boolean {
		if (!this.contentDOM) {
			return true;
		}
		return !this.contentDOM.contains(mutation.target) && mutation.type !== 'selection';
	}

	handleEditorDisabledChanged(): void {
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
		const children = (
			<Caption selected={this.insideSelection()} hasContent={this.node.content.childCount > 0}>
				<NodeViewContentHole ref={forwardRef} />
			</Caption>
		);

		if (!this.intl || !isSSR() || !isSSRStreaming()) {
			return children;
		}

		return <RawIntlProvider value={this.intl}>{children}</RawIntlProvider>;
	}

	viewShouldUpdate(nextNode: PMNode): boolean {
		if (this.node.childCount !== nextNode.childCount) {
			return true;
		}

		const newSelected = this.insideSelection();
		const selectedStateChange = this.selected !== newSelected;
		this.selected = newSelected;

		return selectedStateChange;
	}

	destroy(): void {
		if (this.cleanupEditorDisabledListener) {
			this.cleanupEditorDisabledListener();
		}
		this.cleanupEditorDisabledListener = undefined;
	}
}

/** Creates a caption node view for use with ProseMirror. */
export default function captionNodeView(
	portalProviderAPI: PortalProviderAPI,
	eventDispatcher: EventDispatcher,
	pluginInjectionApi: ExtractInjectionAPI<CaptionPlugin> | undefined,
	intl?: IntlShape,
) {
	return (node: PMNode, view: EditorView, getPos: getPosHandler): CaptionNodeView => {
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
			intl,
		).init();
	};
}
