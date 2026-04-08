import type { EventDispatcher } from '@atlaskit/editor-common/event-dispatcher';
import type { PortalProviderAPI } from '@atlaskit/editor-common/portal';
import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import { DOMSerializer } from '@atlaskit/editor-prosemirror/model';
import { PluginKey } from '@atlaskit/editor-prosemirror/state';
import type { EditorView, NodeView } from '@atlaskit/editor-prosemirror/view';
import { editorExperiment } from '@atlaskit/tmp-editor-statsig/experiments';

import type { LayoutPlugin } from '../layoutPluginType';
import { LayoutSectionView } from '../nodeviews';
import type { LayoutPluginOptions } from '../types';

export const pluginKey: PluginKey = new PluginKey('layoutResizingPlugin');

/**
 * Minimal node view for layoutColumn that delegates all DOM serialization to the
 * NodeSpec's own toDOM, but overrides ignoreMutation to suppress style attribute
 * mutations from ProseMirror's MutationObserver.
 *
 * This is necessary so that direct inline style mutations during column drag
 * (e.g. setting flex-basis to give real-time visual feedback without dispatching
 * PM transactions) are not "corrected" back by ProseMirror's DOM reconciliation.
 */
class LayoutColumnView implements NodeView {
	dom: HTMLElement;
	contentDOM: HTMLElement;

	constructor(node: PMNode, view: EditorView, getPos: () => number | undefined) {
		// Use the NodeSpec's own toDOM to produce the correct DOM structure and attributes.
		const nodeType = view.state.schema.nodes[node.type.name];

		// Fallback: create a plain div so PM always has a valid DOM node to work with.
		// This path should never be reached in practice — layoutColumn always has a toDOM.
		if (!nodeType.spec.toDOM) {
			const fallbackDiv = document.createElement('div');
			this.dom = fallbackDiv;
			this.contentDOM = fallbackDiv;
			return;
		}

		const { dom, contentDOM } = DOMSerializer.renderSpec(document, nodeType.spec.toDOM(node));

		if (!(dom instanceof HTMLElement) || !(contentDOM instanceof HTMLElement)) {
			const fallbackDiv = document.createElement('div');
			this.dom = fallbackDiv;
			this.contentDOM = fallbackDiv;
			return;
		}

		this.dom = dom;
		this.contentDOM = contentDOM;

		// Stamp the column's index within its parent section onto the DOM element so that
		// column-resize-divider can query columns by index rather than relying on positional
		// order of [data-layout-column] elements (which could break if the DOM structure changes).
		const pos = getPos();
		if (pos !== undefined) {
			const $pos = view.state.doc.resolve(pos);
			this.dom.setAttribute('data-layout-column-index', String($pos.index()));
		}
	}

	ignoreMutation(mutation: MutationRecord | { target: Node; type: 'selection'; }): boolean {
		// Ignore style attribute mutations — these are direct DOM writes during column drag
		// (setting flex-basis for real-time resize feedback). Without this, PM's
		// MutationObserver would immediately revert our style changes.
		return mutation.type === 'attributes' && (mutation as MutationRecord).attributeName === 'style';
	}
}

export default (
	options: LayoutPluginOptions,
	pluginInjectionApi: ExtractInjectionAPI<LayoutPlugin>,
	portalProviderAPI: PortalProviderAPI,
	eventDispatcher: EventDispatcher,
): SafePlugin<undefined> =>
	new SafePlugin<undefined>({
		key: pluginKey,
		props: {
			nodeViews: {
				layoutSection: (node, view, getPos) => {
					return new LayoutSectionView({
						node,
						view,
						getPos,
						portalProviderAPI,
						eventDispatcher,
						pluginInjectionApi,
						options,
					}).init();
				},
				// Only register the column node view when the resize handle experiment is on.
				// It exists solely to suppress style-attribute MutationObserver callbacks
				// during drag, allowing direct flex-basis writes without PM interference.
				...(editorExperiment('platform_editor_layout_column_resize_handle', true)
					? {
							layoutColumn: (node: PMNode, view: EditorView, getPos: () => number | undefined) =>
								new LayoutColumnView(node, view, getPos),
						}
					: {}),
			},
		},
	});
