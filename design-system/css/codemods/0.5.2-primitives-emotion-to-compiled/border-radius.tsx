/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::aac51b10fd4c84e2b653aff461a93b73>>
 * @codegenCommand afm workspace @atlaskit/primitives codegen-styles
 * @codegenDependency ../../../tokens/src/artifacts/tokens-raw/atlassian-shape.tsx <<SignedSource::419cf7fccef8a341df2ce9890e3cdad2>>
 */
import { token } from '@atlaskit/tokens';

export const borderRadiusMap: {
	'radius.xsmall': 'var(--ds-radius-xsmall)';
	'radius.small': 'var(--ds-radius-small)';
	'radius.medium': 'var(--ds-radius-medium)';
	'radius.large': 'var(--ds-radius-large)';
	'radius.xlarge': 'var(--ds-radius-xlarge)';
	'radius.xxlarge': 'var(--ds-radius-xxlarge)';
	'radius.full': 'var(--ds-radius-full)';
	'radius.tile': 'var(--ds-radius-tile)';
} = {
	'radius.xsmall': token('radius.xsmall', '2px'),
	'radius.small': token('radius.small', '3px'),
	'radius.medium': token('radius.medium', '6px'),
	'radius.large': token('radius.large', '8px'),
	'radius.xlarge': token('radius.xlarge', '12px'),
	'radius.xxlarge': token('radius.xxlarge', '16px'),
	'radius.full': token('radius.full', '9999px'),
	'radius.tile': token('radius.tile', '25%'),
};

export type BorderRadius = keyof typeof borderRadiusMap;
