/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::e652bb770b0f835445d139bf6da7fa80>>
 * @codegenCommand yarn workspace @atlaskit/primitives codegen-styles
 * @codegenDependency ../../../tokens/src/artifacts/tokens-raw/atlassian-light.tsx <<SignedSource::4e25079e2363933fae45ad0f1e9c123b>>
 */
import { token } from '@atlaskit/tokens';

export const shadowMap: {
	'elevation.shadow.overflow': 'var(--ds-shadow-overflow)';
	'elevation.shadow.overflow.perimeter': 'var(--ds-shadow-overflow-perimeter)';
	'elevation.shadow.overflow.spread': 'var(--ds-shadow-overflow-spread)';
	'elevation.shadow.overlay': 'var(--ds-shadow-overlay)';
	'elevation.shadow.raised': 'var(--ds-shadow-raised)';
} = {
	'elevation.shadow.overflow': token(
		'elevation.shadow.overflow',
		'0px 0px 8px #1E1F21, 0px 0px 1px #1E1F21',
	),
	'elevation.shadow.overflow.perimeter': token('elevation.shadow.overflow.perimeter', '#1E1F211f'),
	'elevation.shadow.overflow.spread': token('elevation.shadow.overflow.spread', '#1E1F2129'),
	'elevation.shadow.overlay': token(
		'elevation.shadow.overlay',
		'0px 8px 12px #1E1F21, 0px 0px 1px #1E1F21',
	),
	'elevation.shadow.raised': token(
		'elevation.shadow.raised',
		'0px 1px 1px #1E1F21, 0px 0px 1px #1E1F21',
	),
} as const;

export type Shadow = keyof typeof shadowMap;
