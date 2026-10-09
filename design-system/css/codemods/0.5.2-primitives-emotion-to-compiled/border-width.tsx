/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::7cdb9fba904c3ac54bf1c429a821ffc2>>
 * @codegenCommand afm workspace @atlaskit/primitives codegen-styles
 * @codegenDependency ../../../tokens/src/artifacts/tokens-raw/atlassian-shape.tsx <<SignedSource::419cf7fccef8a341df2ce9890e3cdad2>>
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
