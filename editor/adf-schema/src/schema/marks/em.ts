import type { MarkSpec, DOMOutputSpec } from '@atlaskit/editor-prosemirror/model';
import { em as emFactory } from '../../next-schema/generated/markTypes';

/**
 * @name em_mark
 */
export interface EmDefinition {
	type: 'em';
}

const emDOM: DOMOutputSpec = ['em'];
export const em: MarkSpec = emFactory({
	parseDOM: [{ tag: 'i' }, { tag: 'em' }, { style: 'font-style=italic' }],
	toDOM() {
		return emDOM;
	},
});
