import { ignoreResizerMutations } from '@atlaskit/editor-common/resizer';
import { DOMSerializer } from '@atlaskit/editor-prosemirror/model';
import type { DOMOutputSpec, Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import type { NodeView } from '@atlaskit/editor-prosemirror/view';
import { fg } from '@atlaskit/platform-feature-flags/fg';

import { isEmptyLayout } from './utils';

const toDOM = (node: PMNode, isEmpty?: boolean): DOMOutputSpec => {
	const computedEmpty = isEmpty ?? isEmptyLayout(node);

	return [
		'div',
		{ class: 'layoutSectionView-content-wrap' },
		[
			'div',
			{ class: 'layout-section-container' },
			[
				'div',
				{
					'data-layout-section': true,
					// `?? ''` keeps unset attributes out of the DOM as `"null"`, which adf-schema's`parseDOM`
					// reads back as a truthy string.
					'data-column-rule-style': node.attrs.columnRuleStyle ?? '',
					'data-empty-layout': String(computedEmpty),
					...(fg('platform_editor_adf_with_localid') && {
						'data-local-id': node.attrs.localId ?? '',
					}),
				},
				0,
			],
		],
	];
};

/**
 * Requires `platform_editor_breakout_resizing` as well as
 * `platform_editor_vanilla_node_views_phase1`, because it cannot render the
 * React `<BreakoutResizer>` the old view mounts when that experiment is off.
 *
 * Also used for SSR, where it needs no `NodeViewContentHole` /
 * `data-ssr-content-dom-ref` handling — that exists only because the React
 * portal overwrites `container.innerHTML`.
 */
export class LayoutSectionView implements NodeView {
	dom: HTMLElement;
	contentDOM: HTMLElement;
	private node: PMNode;
	private isEmpty: boolean | undefined;

	constructor(node: PMNode) {
		const isEmpty = fg('platform_editor_vanilla_node_views_patch_1')
			? isEmptyLayout(node)
			: undefined;
		const { dom, contentDOM } = DOMSerializer.renderSpec(document, toDOM(node, isEmpty)) as {
			contentDOM: HTMLElement;
			dom: HTMLElement;
		};

		this.dom = dom;
		this.contentDOM = contentDOM;
		this.node = node;
		this.isEmpty = isEmpty;
	}

	update(node: PMNode): boolean {
		if (node.attrs.columnRuleStyle !== this.node.attrs.columnRuleStyle) {
			this.contentDOM.setAttribute('data-column-rule-style', node.attrs.columnRuleStyle ?? '');
		}

		const isEmpty = isEmptyLayout(node);
		if (fg('platform_editor_vanilla_node_views_patch_1')) {
			// Cache isEmpty so update() does not call isEmptyLayout on the previous node.
			if (isEmpty !== this.isEmpty) {
				this.contentDOM.setAttribute('data-empty-layout', String(isEmpty));
				this.isEmpty = isEmpty;
			}
		} else if (isEmpty !== isEmptyLayout(this.node)) {
			this.contentDOM.setAttribute('data-empty-layout', String(isEmpty));
		}

		if (fg('platform_editor_adf_with_localid') && node.attrs.localId !== this.node.attrs.localId) {
			this.contentDOM.setAttribute('data-local-id', node.attrs.localId ?? '');
		}

		this.node = node;
		return true;
	}

	ignoreMutation(mutation: MutationRecord | { target: Node; type: 'selection' }): boolean {
		return ignoreResizerMutations(mutation);
	}
}
