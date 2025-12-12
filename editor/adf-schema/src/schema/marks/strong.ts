import type { MarkSpec, DOMOutputSpec } from '@atlaskit/editor-prosemirror/model';
import { strong as strongFactory } from '../../next-schema/generated/markTypes';

/**
 * @name strong_mark
 */
export interface StrongDefinition {
	type: 'strong';
}

const strongDOM: DOMOutputSpec = ['strong'];
export const strong: MarkSpec = strongFactory({
	parseDOM: [
		{ tag: 'strong' },
		// This works around a Google Docs misbehavior where
		// pasted content will be inexplicably wrapped in `<b>`
		// tags with a font-weight normal.
		{
			tag: 'b',
			getAttrs(node) {
				// eslint-disable-next-line @atlaskit/editor/no-as-casting
				const element = node as HTMLElement;
				return element.style.fontWeight !== 'normal' && null;
			},
		},
		{
			tag: 'span',
			getAttrs(node) {
				// eslint-disable-next-line @atlaskit/editor/no-as-casting
				const element = node as HTMLElement;
				const { fontWeight } = element.style;
				return (
					typeof fontWeight === 'string' &&
					(fontWeight === 'bold' ||
						fontWeight === 'bolder' ||
						// @ts-ignore TS1501: This regular expression flag is only available when targeting 'es6' or later.
						/^(bold(er)?|[5-9]\d{2,})$/u.test(fontWeight)) &&
					null
				);
			},
		},
	],
	toDOM() {
		return strongDOM;
	},
});
