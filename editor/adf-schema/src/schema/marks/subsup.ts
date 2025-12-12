import type { MarkSpec, Mark } from '@atlaskit/editor-prosemirror/model';
import { subsup as subsupFactory } from '../../next-schema/generated/markTypes';

export interface SubSupAttributes {
	type: 'sub' | 'sup';
}

/**
 * @name subsup_mark
 */
export interface SubSupDefinition {
	attrs: SubSupAttributes;
	type: 'subsup';
}

export interface SubSupMark extends Mark {
	attrs: SubSupAttributes;
}

function getAttrFromVerticalAlign(node: string) {
	if (node === 'sub') {
		return { type: 'sub' };
	}
	if (node === 'super') {
		return { type: 'sup' };
	}
	return false;
}

export const subsup: MarkSpec = subsupFactory({
	parseDOM: [
		{ tag: 'sub', attrs: { type: 'sub' } },
		{ tag: 'sup', attrs: { type: 'sup' } },
		{
			// Special case for pasting from Google Docs
			// Google Docs uses vertical align to denote subscript and super script
			style: 'vertical-align=super',
			getAttrs: (node: string) => getAttrFromVerticalAlign(node),
		},
		{
			style: 'vertical-align=sub',
			getAttrs: (node: string) => getAttrFromVerticalAlign(node),
		},
	],
	toDOM(mark) {
		return [mark.attrs.type];
	},
});
