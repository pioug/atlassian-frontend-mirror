import { HighlightStyle } from '@codemirror/language';
import { tags } from '@lezer/highlight';

import { token } from '@atlaskit/tokens';

// Based on `platform/packages/design-system/code/src/internal/theme/styles.tsx`
export const highlightStyle = HighlightStyle.define([
	{ tag: tags.meta, color: token('color.text') },
	{ tag: tags.link, textDecoration: 'underline' },
	{
		tag: tags.heading,
		textDecoration: 'underline',
		// Custom syntax styling to match existing styling
		// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
		fontWeight: token('font.weight.bold'),
	},
	{ tag: tags.emphasis, fontStyle: 'italic' },
	{
		tag: tags.strong,
		// Custom syntax styling to match existing styling
		// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
		fontWeight: token('font.weight.bold'),
	},
	{ tag: tags.strikethrough, textDecoration: 'line-through' },
	{
		tag: tags.keyword,
		color: token('color.text.accent.blue'),
		// Custom syntax styling to match existing styling
		// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
		fontWeight: token('font.weight.bold'),
	},
	{
		tag: [tags.atom, tags.bool, tags.url, tags.contentSeparator, tags.labelName],
		color: token('color.text.accent.blue'),
	},
	{
		tag: [tags.literal, tags.inserted],
		color: token('color.text.accent.blue'),
	},
	{ tag: [tags.string, tags.deleted], color: token('color.text.accent.green') },
	{
		tag: [tags.special(tags.string)],
		color: token('color.text.accent.green'),
	},
	{
		tag: [tags.regexp, tags.escape],
		color: token('color.text.accent.teal'),
	},
	{ tag: tags.definition(tags.variableName), color: token('color.text') },
	{ tag: tags.local(tags.variableName), color: token('color.text') },
	{ tag: [tags.typeName, tags.namespace], color: token('color.text.accent.blue') },
	{ tag: tags.className, color: token('color.text.accent.purple') },
	{ tag: [tags.special(tags.variableName), tags.macroName], color: token('color.text') },
	{ tag: tags.definition(tags.propertyName), color: token('color.text') },
	{ tag: tags.comment, color: token('color.text.subtlest'), fontStyle: 'italic' },
	{ tag: tags.invalid, color: token('color.text') },
]);
