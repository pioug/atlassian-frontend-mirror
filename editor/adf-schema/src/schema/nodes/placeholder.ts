import type { NodeSpec } from '@atlaskit/editor-prosemirror/model';
import { placeholder as placeholderFactory } from '../../next-schema/generated/nodeTypes';
import { uuid } from '../../utils/uuid';

/**
 * @name placeholder_node
 */
export interface PlaceholderDefinition {
	attrs: {
		localId?: string;
		text: string;
	};
	type: 'placeholder';
}

export const placeholder: NodeSpec = placeholderFactory({
	parseDOM: [
		{
			tag: 'span[data-placeholder]',
			getAttrs: (dom) => ({
				text:
					// eslint-disable-next-line @atlaskit/editor/no-as-casting, @typescript-eslint/no-non-null-assertion
					(dom as HTMLElement).getAttribute('data-placeholder') ||
					// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
					placeholder.attrs!.text.default,
			}),
		},
	],
	toDOM(node) {
		const { text } = node.attrs;
		const attrs = {
			'data-placeholder': text,
			// Needs to be edtiable for mobile to not close keyboard
			contenteditable: 'true',
		};
		return ['span', attrs, text];
	},
});

export const placeholderWithLocalId: NodeSpec = placeholderFactory({
	parseDOM: [
		{
			tag: 'span[data-placeholder]',
			getAttrs: (dom) => ({
				text:
					// eslint-disable-next-line @atlaskit/editor/no-as-casting, @typescript-eslint/no-non-null-assertion
					(dom as HTMLElement).getAttribute('data-placeholder') ||
					// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
					placeholder.attrs!.text.default,
				localId: uuid.generate(),
			}),
		},
	],
	toDOM(node) {
		const { text } = node.attrs;
		const attrs = {
			'data-placeholder': text,
			// Needs to be edtiable for mobile to not close keyboard
			contenteditable: 'true',
			'data-local-id': node?.attrs?.localId || undefined,
		};
		return ['span', attrs, text];
	},
});
