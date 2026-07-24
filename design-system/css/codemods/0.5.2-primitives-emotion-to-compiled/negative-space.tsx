/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::5923baf5f82c9d6dd16c8091f43eb91c>>
 * @codegenCommand yarn workspace @atlaskit/primitives codegen-styles
 * @codegenDependency ../../../tokens/src/artifacts/tokens-raw/atlassian-spacing.tsx <<SignedSource::535518e7add48ef24f526d0904f70060>>
 */
import { token } from '@atlaskit/tokens';

export const negativeSpaceMap: {
	'space.negative.025': 'var(--ds-space-negative-025)';
	'space.negative.050': 'var(--ds-space-negative-050)';
	'space.negative.075': 'var(--ds-space-negative-075)';
	'space.negative.100': 'var(--ds-space-negative-100)';
	'space.negative.150': 'var(--ds-space-negative-150)';
	'space.negative.200': 'var(--ds-space-negative-200)';
	'space.negative.250': 'var(--ds-space-negative-250)';
	'space.negative.300': 'var(--ds-space-negative-300)';
	'space.negative.400': 'var(--ds-space-negative-400)';
} = {
	'space.negative.025': token('space.negative.025', '-2px'),
	'space.negative.050': token('space.negative.050', '-4px'),
	'space.negative.075': token('space.negative.075', '-6px'),
	'space.negative.100': token('space.negative.100', '-8px'),
	'space.negative.150': token('space.negative.150', '-12px'),
	'space.negative.200': token('space.negative.200', '-16px'),
	'space.negative.250': token('space.negative.250', '-20px'),
	'space.negative.300': token('space.negative.300', '-24px'),
	'space.negative.400': token('space.negative.400', '-32px'),
};

export type NegativeSpace = keyof typeof negativeSpaceMap;
