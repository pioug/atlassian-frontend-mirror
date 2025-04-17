// TODO: remove this once ESLint rule has been fixed
/**
 * @jsxRuntime classic
 * @jsx jsx
 */
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx } from '@emotion/react';

import { Stack } from '@atlaskit/primitives';
import { token } from '@atlaskit/tokens';

import { useVrGlobalTheme } from './utils/use-vr-global-theme';

const headings = [
	{
		name: 'font.heading.xxlarge',
		token: token('font.heading.xxlarge', '12px'),
	},
	{
		name: 'font.heading.xlarge',
		token: token('font.heading.xlarge', '14px'),
	},
	{
		name: 'font.heading.large',
		token: token('font.heading.large', '16px'),
	},
	{
		name: 'font.heading.medium',
		token: token('font.heading.medium', '20px'),
	},
	{
		name: 'font.heading.small',
		token: token('font.heading.small', '24px'),
	},
	{
		name: 'font.heading.xsmall',
		token: token('font.heading.xsmall', '29px'),
	},
	{
		name: 'font.heading.xxsmall',
		token: token('font.heading.xxsmall', '35px'),
	},
];

const fontWeights = [
	{
		name: 'font.weight.regular',
		token: token('font.weight.regular', '400'),
	},
	{
		name: 'font.weight.medium',
		token: token('font.weight.medium', '500'),
	},
	{
		name: 'font.weight.semibold',
		token: token('font.weight.semibold', '600'),
	},
	{
		name: 'font.weight.bold',
		token: token('font.weight.bold', '700'),
	},
];

const fontFamilies = [
	{
		name: 'font.family.heading',
		token: token('font.family.heading', 'sans-serif'),
	},
	{
		name: 'font.family.body',
		token: token('font.family.body', 'sans-serif'),
	},
	{
		name: 'font.family.brand.heading',
		token: token('font.family.brand.heading', 'sans-serif'),
	},
	{
		name: 'font.family.brand.body',
		token: token('font.family.brand.body', 'sans-serif'),
	},
	// Renders differently between local and CI in VR test causing flake.
	// {
	// 	name: 'font.family.code',
	// 	token: token('font.family.code', 'monospace'),
	// },
];

export default () => {
	useVrGlobalTheme();
	return (
		<div data-testid="typography">
			<h1>Headings</h1>
			<Stack space="space.100">
				{headings.map((heading) => (
					<span key={heading.name} style={{ font: heading.token }}>
						{heading.name}
					</span>
				))}
				{/* fallbacks specifically chosen to validate tokens are applied correctly when present and not applied when not */}
			</Stack>

			<h1>Font weight</h1>
			<Stack space="space.100">
				{fontWeights.map((fontWeight) => (
					<span key={fontWeight.name} style={{ fontWeight: fontWeight.token }}>
						{fontWeight.name}
					</span>
				))}
				{/* fallbacks specifically chosen to validate tokens are applied correctly when present and not applied when not */}
			</Stack>

			<h1>Font family</h1>
			<Stack space="space.100">
				{fontFamilies.map((fontFamily) => (
					<span key={fontFamily.name} style={{ fontFamily: fontFamily.token }}>
						{fontFamily.name}
					</span>
				))}
				{/* fallbacks specifically chosen to validate tokens are applied correctly when present and not applied when not */}
			</Stack>
		</div>
	);
};
