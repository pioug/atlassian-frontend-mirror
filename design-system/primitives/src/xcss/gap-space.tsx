/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::aaab37d95b3ad5a410df83f119600eba>>
 * @codegenCommand afm workspace @atlaskit/primitives codegen-styles
 * @codegenDependency ../../../tokens/src/artifacts/tokens-raw/atlassian-spacing.tsx <<SignedSource::d315a72fd47775e37868465c88b3ebfb>>
 */
import { token } from '@atlaskit/tokens';

export const gapSpaceMap: {
	'space.0': 'var(--ds-space-0)';
	'space.025': 'var(--ds-space-025)';
	'space.050': 'var(--ds-space-050)';
	'space.075': 'var(--ds-space-075)';
	'space.100': 'var(--ds-space-100)';
	'space.150': 'var(--ds-space-150)';
	'space.200': 'var(--ds-space-200)';
	'space.250': 'var(--ds-space-250)';
	'space.300': 'var(--ds-space-300)';
	'space.400': 'var(--ds-space-400)';
	'space.500': 'var(--ds-space-500)';
	'space.600': 'var(--ds-space-600)';
	'space.800': 'var(--ds-space-800)';
	'space.1000': 'var(--ds-space-1000)';
	'space.gap.large': 'var(--ds-space-gap-large)';
	'space.gap.medium': 'var(--ds-space-gap-medium)';
	'space.gap.small': 'var(--ds-space-gap-small)';
	'space.gap.xlarge': 'var(--ds-space-gap-xlarge)';
	'space.gap.xsmall': 'var(--ds-space-gap-xsmall)';
	'space.gap.xxlarge': 'var(--ds-space-gap-xxlarge)';
	'space.gap.xxsmall': 'var(--ds-space-gap-xxsmall)';
} = {
	'space.0': token('space.0', '0px'),
	'space.025': token('space.025', '2px'),
	'space.050': token('space.050', '4px'),
	'space.075': token('space.075', '6px'),
	'space.100': token('space.100', '8px'),
	'space.150': token('space.150', '12px'),
	'space.200': token('space.200', '16px'),
	'space.250': token('space.250', '20px'),
	'space.300': token('space.300', '24px'),
	'space.400': token('space.400', '32px'),
	'space.500': token('space.500', '40px'),
	'space.600': token('space.600', '48px'),
	'space.800': token('space.800', '64px'),
	'space.1000': token('space.1000', '80px'),
	'space.gap.large': token('space.gap.large', '12px'),
	'space.gap.medium': token('space.gap.medium', '8px'),
	'space.gap.small': token('space.gap.small', '6px'),
	'space.gap.xlarge': token('space.gap.xlarge', '16px'),
	'space.gap.xsmall': token('space.gap.xsmall', '4px'),
	'space.gap.xxlarge': token('space.gap.xxlarge', '24px'),
	'space.gap.xxsmall': token('space.gap.xxsmall', '2px'),
};

export type GapSpace = keyof typeof gapSpaceMap;
