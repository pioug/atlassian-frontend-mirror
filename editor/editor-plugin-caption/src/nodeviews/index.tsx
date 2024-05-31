import React from 'react';

import type { EventDispatcher } from '@atlaskit/editor-common/event-dispatcher';
import type { LegacyPortalProviderAPI } from '@atlaskit/editor-common/portal-provider';
import type {
	ForwardRef,
	ReactComponentProps,
	shouldUpdate,
} from '@atlaskit/editor-common/react-node-view';
import { SelectionBasedNodeView } from '@atlaskit/editor-common/selection-based-node-view';
import { type PortalProviderAPI } from '@atlaskit/editor-common/src/portal';
import type {
	ExtractInjectionAPI,
	getPosHandler,
	getPosHandlerNode,
} from '@atlaskit/editor-common/types';
import { Caption } from '@atlaskit/editor-common/ui';
import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import { getBooleanFF } from '@atlaskit/platform-feature-flags';

import type { CaptionPlugin } from '../types';

export class CaptionNodeView extends SelectionBasedNodeView {
	private selected = this.insideSelection();
	private cleanupEditorDisabledListener?: () => void;
	pluginInjectionApi?: ExtractInjectionAPI<CaptionPlugin>;

	constructor(
		node: PMNode,
		view: EditorView,
		getPos: getPosHandler,
		portalProviderAPI: LegacyPortalProviderAPI | PortalProviderAPI,
		eventDispatcher: EventDispatcher,
		reactComponentProps: ReactComponentProps,
		reactComponent?: React.ComponentType<React.PropsWithChildren<unknown>>,
		hasContext: boolean = false,
		viewShouldUpdate?: shouldUpdate,
		hasIntlContext: boolean = false,
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
			hasContext,
			viewShouldUpdate,
			hasIntlContext,
		);
		this.pluginInjectionApi = pluginInjectionApi;
		if (getBooleanFF('platform.editor.live-view.disable-editing-in-view-mode_fi1rx')) {
			this.handleEditorDisabledChanged();
		}
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
		if (getBooleanFF('platform.editor.live-view.disable-editing-in-view-mode_fi1rx')) {
			dom.setAttribute(
				'contenteditable',
				this.pluginInjectionApi?.editorDisabled?.sharedState.currentState()?.editorDisabled
					? 'false'
					: 'true',
			);
		}
		return { dom };
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

	render(_props: never, forwardRef: ForwardRef) {
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
	portalProviderAPI: LegacyPortalProviderAPI | PortalProviderAPI,
	eventDispatcher: EventDispatcher,
	pluginInjectionApi: ExtractInjectionAPI<CaptionPlugin> | undefined,
) {
	return (node: PMNode, view: EditorView, getPos: getPosHandler) => {
		const hasIntlContext = true;
		return new CaptionNodeView(
			node,
			view,
			getPos as getPosHandlerNode,
			portalProviderAPI,
			eventDispatcher,
			{},
			undefined,
			undefined,
			undefined,
			hasIntlContext,
			pluginInjectionApi,
		).init();
	};
}
