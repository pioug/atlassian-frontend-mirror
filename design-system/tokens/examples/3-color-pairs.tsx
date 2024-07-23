/**
 * @jsxRuntime classic
 * @jsx jsx
 */

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';

import { token } from '../src';

import { useVrGlobalTheme } from './utils/use-vr-global-theme';

const colorPairs = [
	{
		background: token('color.background.accent.blue.subtlest'),
		text: token('color.text'),
	},
	{
		background: token('color.background.accent.blue.subtler'),
		text: token('color.text'),
	},
	{
		background: token('color.background.accent.blue.subtle'),
		text: token('color.text.accent.blue.bolder'),
	},
	{
		background: token('color.background.accent.blue.bolder'),
		text: token('color.text.inverse'),
	},
	{
		background: token('color.background.accent.red.subtlest'),
		text: token('color.text'),
	},
	{
		background: token('color.background.accent.red.subtler'),
		text: token('color.text'),
	},
	{
		background: token('color.background.accent.red.subtle'),
		text: token('color.text.accent.red.bolder'),
	},
	{
		background: token('color.background.accent.red.bolder'),
		text: token('color.text.inverse'),
	},
	{
		background: token('color.background.accent.orange.subtlest'),
		text: token('color.text'),
	},
	{
		background: token('color.background.accent.orange.subtler'),
		text: token('color.text'),
	},
	{
		background: token('color.background.accent.orange.subtle'),
		text: token('color.text.accent.orange.bolder'),
	},
	{
		background: token('color.background.accent.orange.bolder'),
		text: token('color.text.inverse'),
	},
	{
		background: token('color.background.accent.yellow.subtlest'),
		text: token('color.text'),
	},
	{
		background: token('color.background.accent.yellow.subtler'),
		text: token('color.text'),
	},
	{
		background: token('color.background.accent.yellow.subtle'),
		text: token('color.text.accent.yellow.bolder'),
	},
	{
		background: token('color.background.accent.yellow.bolder'),
		text: token('color.text.inverse'),
	},
	{
		background: token('color.background.accent.green.subtlest'),
		text: token('color.text'),
	},
	{
		background: token('color.background.accent.green.subtler'),
		text: token('color.text'),
	},
	{
		background: token('color.background.accent.green.subtle'),
		text: token('color.text.accent.green.bolder'),
	},
	{
		background: token('color.background.accent.green.bolder'),
		text: token('color.text.inverse'),
	},
	{
		background: token('color.background.accent.teal.subtlest'),
		text: token('color.text'),
	},
	{
		background: token('color.background.accent.teal.subtler'),
		text: token('color.text'),
	},
	{
		background: token('color.background.accent.teal.subtle'),
		text: token('color.text.accent.teal.bolder'),
	},
	{
		background: token('color.background.accent.teal.bolder'),
		text: token('color.text.inverse'),
	},
	{
		background: token('color.background.accent.purple.subtlest'),
		text: token('color.text'),
	},
	{
		background: token('color.background.accent.purple.subtler'),
		text: token('color.text'),
	},
	{
		background: token('color.background.accent.purple.subtle'),
		text: token('color.text.accent.purple.bolder'),
	},
	{
		background: token('color.background.accent.purple.bolder'),
		text: token('color.text.inverse'),
	},
	{
		background: token('color.background.accent.magenta.subtlest'),
		text: token('color.text'),
	},
	{
		background: token('color.background.accent.magenta.subtler'),
		text: token('color.text'),
	},
	{
		background: token('color.background.accent.magenta.subtle'),
		text: token('color.text.accent.magenta.bolder'),
	},
	{
		background: token('color.background.accent.magenta.bolder'),
		text: token('color.text.inverse'),
	},
	{
		background: token('color.background.accent.gray.subtlest'),
		text: token('color.text'),
	},
	{
		background: token('color.background.accent.gray.subtler'),
		text: token('color.text'),
	},
	{
		background: token('color.background.accent.gray.subtle'),
		text: token('color.text.accent.gray.bolder'),
	},
	{
		background: token('color.background.accent.gray.bolder'),
		text: token('color.text.inverse'),
	},
	{
		background: token('color.background.disabled'),
		text: token('color.text'),
	},
	{
		background: token('color.background.inverse.subtle'),
		text: token('color.text'),
	},
	{
		background: token('color.background.inverse.subtle.hovered'),
		text: token('color.text'),
	},
	{
		background: token('color.background.inverse.subtle.pressed'),
		text: token('color.text'),
	},
	{
		background: token('color.background.input'),
		text: token('color.text'),
	},
	{
		background: token('color.background.input.hovered'),
		text: token('color.text'),
	},
	{
		background: token('color.background.input.pressed'),
		text: token('color.text'),
	},
	{
		background: token('color.background.neutral'),
		text: token('color.text'),
	},
	{
		background: token('color.background.neutral.hovered'),
		text: token('color.text'),
	},
	{
		background: token('color.background.neutral.pressed'),
		text: token('color.text'),
	},
	{
		background: token('color.background.neutral.subtle'),
		text: token('color.text'),
	},
	{
		background: token('color.background.neutral.subtle.hovered'),
		text: token('color.text'),
	},
	{
		background: token('color.background.neutral.subtle.pressed'),
		text: token('color.text'),
	},
	{
		background: token('color.background.neutral.bold'),
		text: token('color.text.inverse'),
	},
	{
		background: token('color.background.neutral.bold.hovered'),
		text: token('color.text.inverse'),
	},
	{
		background: token('color.background.neutral.bold.pressed'),
		text: token('color.text.inverse'),
	},
	{
		background: token('color.background.brand.bold'),
		text: token('color.text.inverse'),
	},
	{
		background: token('color.background.brand.bold.hovered'),
		text: token('color.text.inverse'),
	},
	{
		background: token('color.background.brand.bold.pressed'),
		text: token('color.text.inverse'),
	},
	{
		background: token('color.background.selected'),
		text: token('color.text.selected'),
	},
	{
		background: token('color.background.selected.hovered'),
		text: token('color.text.selected'),
	},
	{
		background: token('color.background.selected.pressed'),
		text: token('color.text.selected'),
	},
	{
		background: token('color.background.selected.bold'),
		text: token('color.text.inverse'),
	},
	{
		background: token('color.background.selected.bold.hovered'),
		text: token('color.text.inverse'),
	},
	{
		background: token('color.background.selected.bold.pressed'),
		text: token('color.text.inverse'),
	},
	{
		background: token('color.background.danger'),
		text: token('color.text'),
	},
	{
		background: token('color.background.danger.hovered'),
		text: token('color.text'),
	},
	{
		background: token('color.background.danger.pressed'),
		text: token('color.text'),
	},
	{
		background: token('color.background.danger.bold'),
		text: token('color.text.inverse'),
	},
	{
		background: token('color.background.danger.bold.hovered'),
		text: token('color.text.inverse'),
	},
	{
		background: token('color.background.danger.bold.pressed'),
		text: token('color.text.inverse'),
	},
	{
		background: token('color.background.warning'),
		text: token('color.text'),
	},
	{
		background: token('color.background.warning.hovered'),
		text: token('color.text'),
	},
	{
		background: token('color.background.warning.pressed'),
		text: token('color.text'),
	},
	{
		background: token('color.background.warning.bold'),
		text: token('color.text.warning.inverse'),
	},
	{
		background: token('color.background.warning.bold.hovered'),
		text: token('color.text.warning.inverse'),
	},
	{
		background: token('color.background.warning.bold.pressed'),
		text: token('color.text.warning.inverse'),
	},
	{
		background: token('color.background.success'),
		text: token('color.text'),
	},
	{
		background: token('color.background.success.hovered'),
		text: token('color.text'),
	},
	{
		background: token('color.background.success.pressed'),
		text: token('color.text'),
	},
	{
		background: token('color.background.success.bold'),
		text: token('color.text.inverse'),
	},
	{
		background: token('color.background.success.bold.hovered'),
		text: token('color.text.inverse'),
	},
	{
		background: token('color.background.success.bold.pressed'),
		text: token('color.text.inverse'),
	},
	{
		background: token('color.background.discovery'),
		text: token('color.text'),
	},
	{
		background: token('color.background.discovery.hovered'),
		text: token('color.text'),
	},
	{
		background: token('color.background.discovery.pressed'),
		text: token('color.text'),
	},
	{
		background: token('color.background.discovery.bold'),
		text: token('color.text.inverse'),
	},
	{
		background: token('color.background.discovery.bold.hovered'),
		text: token('color.text.inverse'),
	},
	{
		background: token('color.background.discovery.bold.pressed'),
		text: token('color.text.inverse'),
	},
	{
		background: token('color.background.information'),
		text: token('color.text'),
	},
	{
		background: token('color.background.information.hovered'),
		text: token('color.text'),
	},
	{
		background: token('color.background.information.pressed'),
		text: token('color.text'),
	},
	{
		background: token('color.background.information.bold'),
		text: token('color.text.inverse'),
	},
	{
		background: token('color.background.information.bold.hovered'),
		text: token('color.text.inverse'),
	},
	{
		background: token('color.background.information.bold.pressed'),
		text: token('color.text.inverse'),
	},
	{
		background: token('elevation.surface'),
		text: token('color.text'),
	},
	{
		background: token('elevation.surface.sunken'),
		text: token('color.text'),
	},
	{
		background: token('elevation.surface.raised'),
		text: token('color.text'),
	},
	{
		background: token('elevation.surface.overlay'),
		text: token('color.text'),
	},
];

const containerStyles = css({
	margin: '2em',
	fontSize: '14px',
	lineHeight: '20px',
});

const boxStyles = css({
	display: 'flex',
	boxSizing: 'border-box',
	minHeight: '100px',
	margin: '0.5em',
	padding: '1em',
	border: 'none',
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	borderRadius: token('border.radius.100'),
	fontSize: 'inherit',
	textAlign: 'left',
});

const varToToken = (tokenString: string) =>
	`color.${tokenString.substring(9, tokenString.length - 1).replace(/\-/g, '.')}`;

const Box = ({ background, text }: { background: string; text: string }) => (
	<div
		css={[
			boxStyles,
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766
			css({
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
				backgroundColor: background,
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
				color: text,
			}),
		]}
	>
		{varToToken(text)} on {varToToken(background)}
	</div>
);

export default () => {
	useVrGlobalTheme();

	return (
		<div css={containerStyles}>
			<h1>Color Pairs</h1>
			{/* eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766 */}
			<div style={{ display: 'flex', flexDirection: 'column' }}>
				{colorPairs.map(({ background, text }, key) => (
					<Box key={key} background={background} text={text} />
				))}
			</div>
		</div>
	);
};
