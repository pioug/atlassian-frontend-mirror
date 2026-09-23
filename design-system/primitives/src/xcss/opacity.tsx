/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::dd2c45abe6b4fad449cf3f1f465ae0c7>>
 * @codegenCommand afm workspace @atlaskit/primitives codegen-styles
 * @codegenDependency ../../../tokens/src/artifacts/tokens-raw/atlassian-light.tsx <<SignedSource::d88dceee1459b4e9e492bb497e903575>>
 */
import { token } from '@atlaskit/tokens';

export const opacityMap: {
	'opacity.disabled': 'var(--ds-opacity-disabled)';
	'opacity.loading': 'var(--ds-opacity-loading)';
} = {
	'opacity.disabled': token('opacity.disabled', '0.4'),
	'opacity.loading': token('opacity.loading', '0.2'),
} as const;

export type Opacity = keyof typeof opacityMap;
