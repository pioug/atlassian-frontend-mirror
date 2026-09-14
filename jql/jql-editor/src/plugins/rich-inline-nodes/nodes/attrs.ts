import { type AttributeSpec } from '@atlaskit/editor-prosemirror/model';

export type RichInlineNodeAttrs = Record<
	'assets' | 'goal' | 'lozengeWithAvatar' | 'project' | 'team' | 'user',
	{ [name: string]: AttributeSpec }
>;

const baseRichInlineNodeAttrs: { [name: string]: AttributeSpec } = {
	id: {},
	name: {},
	fieldName: {},
};

export const richInlineNodeAttrs: RichInlineNodeAttrs = {
	assets: baseRichInlineNodeAttrs,
	goal: baseRichInlineNodeAttrs,
	lozengeWithAvatar: baseRichInlineNodeAttrs,
	project: baseRichInlineNodeAttrs,
	team: baseRichInlineNodeAttrs,
	user: baseRichInlineNodeAttrs,
};
