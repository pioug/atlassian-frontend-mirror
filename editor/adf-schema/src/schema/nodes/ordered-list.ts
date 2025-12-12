import { uuid } from '../../utils';
import { orderedList as orderedListFactory } from '../../next-schema/generated/nodeTypes';

export const orderedListSelector = '.ak-ol';

export const orderedList = orderedListFactory({
	parseDOM: [{ tag: 'ol' }],
	toDOM() {
		const attrs = {
			class: orderedListSelector.substr(1),
		};
		return ['ol', attrs, 0];
	},
});

export const orderedListWithLocalId = orderedListFactory({
	parseDOM: [{ tag: 'ol', getAttrs: () => ({ localId: uuid.generate() }) }],
	toDOM(node) {
		const attrs = {
			class: orderedListSelector.substr(1),
			'data-local-id': node?.attrs?.localId || undefined,
		};
		return ['ol', attrs, 0];
	},
});

// resolve "start" to a safe, 0+ integer, otherwise return undefined
// Note: Any changes to this function should also be made to "resolveOrder"
// in packages/editor/editor-common/src/utils/list.ts
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const resolveStart = (start: any): number | undefined => {
	const num = Number(start);
	if (Number.isNaN(num)) {
		return;
	}
	if (num < 0) {
		return;
	}
	return Math.floor(Math.max(num, 0));
};

export const orderedListWithOrder = orderedListFactory({
	parseDOM: [
		{
			tag: 'ol',
			getAttrs: (domNode) => {
				// eslint-disable-next-line @atlaskit/editor/no-as-casting
				const dom = domNode as HTMLElement;
				const startDOMAttr = dom.getAttribute('start');
				if (startDOMAttr) {
					const start = resolveStart(startDOMAttr);
					if (typeof start === 'number') {
						return { order: start };
					}
				}
				return null;
			},
		},
	],
	toDOM(node) {
		const start = resolveStart(node?.attrs?.order);
		const attrs = {
			start: typeof start === 'number' ? String(start) : undefined,
			class: orderedListSelector.substr(1),
		};
		return ['ol', attrs, 0];
	},
});

export const orderedListWithOrderAndLocalId = orderedListFactory({
	parseDOM: [
		{
			tag: 'ol',
			getAttrs: (domNode) => {
				// eslint-disable-next-line @atlaskit/editor/no-as-casting
				const dom = domNode as HTMLElement;
				const startDOMAttr = dom.getAttribute('start');
				const localId = uuid.generate();
				if (startDOMAttr) {
					const start = resolveStart(startDOMAttr);
					if (typeof start === 'number') {
						return { order: start, localId };
					}
				}
				return { localId };
			},
		},
	],
	toDOM(node) {
		const start = resolveStart(node?.attrs?.order);
		const attrs = {
			start: typeof start === 'number' ? String(start) : undefined,
			class: orderedListSelector.substr(1),
			'data-local-id': node?.attrs?.localId || undefined,
		};
		return ['ol', attrs, 0];
	},
});
