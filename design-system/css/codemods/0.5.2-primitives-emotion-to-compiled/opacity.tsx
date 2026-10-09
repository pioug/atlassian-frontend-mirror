/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::f768e44d85ca8256730a17510c4d3901>>
 * @codegenCommand afm workspace @atlaskit/primitives codegen-styles
 * @codegenDependency ../../../tokens/src/artifacts/tokens-raw/atlassian-light.tsx <<SignedSource::2d05e18dbb472322c67fd0bc8ec55082>>
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
