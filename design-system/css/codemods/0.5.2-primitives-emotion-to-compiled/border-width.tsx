/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::9cc07267bf53de18206960d38ce91e77>>
 * @codegenCommand afm workspace @atlaskit/primitives codegen-styles
 * @codegenDependency ../../../tokens/src/artifacts/tokens-raw/atlassian-shape.tsx <<SignedSource::8817f4073995e5dc9c2bb766316632d6>>
 */
import { token } from '@atlaskit/tokens';

export const borderWidthMap: {
	'border.width': 'var(--ds-border-width)';
	'border.width.selected': 'var(--ds-border-width-selected)';
	'border.width.focused': 'var(--ds-border-width-focused)';
} = {
	'border.width': token('border.width', '1px'),
	'border.width.selected': token('border.width.selected', '2px'),
	'border.width.focused': token('border.width.focused', '2px'),
};

export type BorderWidth = keyof typeof borderWidthMap;
