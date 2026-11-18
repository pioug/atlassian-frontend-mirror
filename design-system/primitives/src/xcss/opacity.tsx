/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::6621446fce3c9f1be09625a2be85f32e>>
 * @codegenCommand afm workspace @atlaskit/primitives codegen-styles
 * @codegenDependency ../../../tokens/src/artifacts/tokens-raw/atlassian-light.tsx <<SignedSource::0253a5300db6fd421595dc5a771839ab>>
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
