import type { NodeSpec } from '@atlaskit/editor-prosemirror/model';

import { status as statusFactory } from '../../next-schema/generated/nodeTypes';
import { uuid } from '../../utils/uuid';
import type { AnnotationMarkDefinition } from '../marks/annotation';

const NEWLINE_REGEX = /\n/u;

/**
 * @name status_node
 */
export interface StatusDefinition {
	attrs: {
		/**
		 * @pattern "^(neutral|purple|blue|red|yellow|green|#[0-9a-fA-F]{6})$"
		 */
		color: string;
		localId?: string;
		/**
		 * Supported values are bold, subtle, and mixedCase
		 */
		style?: string;
		/**
		 // eslint-disable-next-line eslint-plugin-jsdoc/check-tag-names
		 * @minLength 1
		 */
		text: string;
	};
	/**
	 // eslint-disable-next-line eslint-plugin-jsdoc/check-tag-names
	 * @stage 0
	 */
	marks?: Array<AnnotationMarkDefinition>;
	type: 'status';
}

export const status: NodeSpec = statusFactory({
	parseDOM: [
		{
			tag: 'span[data-node-type="status"]',
			getAttrs: (domNode) => {
				// eslint-disable-next-line @atlaskit/editor/no-as-casting
				const dom = domNode as HTMLElement;

				// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
				const textContent = dom.textContent!.replace(NEWLINE_REGEX, '').trim();

				// Prefer data-text attribute over textContent
				// When NodeView DOM is copied, inner text content may not be preserved
				const text = dom.getAttribute('data-text') || textContent;

				return {
					text,
					color: dom.getAttribute('data-color'),
					localId: uuid.generate(),
					style: dom.getAttribute('data-style'),
				};
			},
		},
	],
	toDOM(node) {
		const { text, color, localId, style } = node.attrs;
		const attrs = {
			'data-node-type': 'status',
			'data-color': color,
			'data-local-id': localId,
			'data-style': style,
			contenteditable: 'false',
		};
		return ['span', attrs, text];
	},
});
