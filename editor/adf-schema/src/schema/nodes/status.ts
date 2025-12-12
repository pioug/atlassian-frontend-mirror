import { uuid } from '../../utils/uuid';
import type { AnnotationMarkDefinition } from '../marks/annotation';
import { status as statusFactory } from '../../next-schema/generated/nodeTypes';

/**
 * @name status_node
 */
export interface StatusDefinition {
	attrs: {
		color: 'neutral' | 'purple' | 'blue' | 'red' | 'yellow' | 'green';
		localId?: string;
		/**
		 * Supported values are bold and subtle
		 */
		style?: string;
		/**
		 * @minLength 1
		 */
		text: string;
	};
	/**
	 * @stage 0
	 */
	marks?: Array<AnnotationMarkDefinition>;
	type: 'status';
}

export const status = statusFactory({
	parseDOM: [
		{
			tag: 'span[data-node-type="status"]',
			getAttrs: (domNode) => {
				// eslint-disable-next-line @atlaskit/editor/no-as-casting
				const dom = domNode as HTMLElement;
				return {
					// @ts-ignore TS1501: This regular expression flag is only available when targeting 'es6' or later.
					// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
					text: dom.textContent!.replace(/\n/u, '').trim(),
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
