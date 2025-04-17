/**
 * @jsxRuntime classic
 * @jsx jsx
 */

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';

import AtlassianIcon from '@atlaskit/icon/glyph/emoji/atlassian';
import { setGlobalTheme, token } from '@atlaskit/tokens';

import { useVrGlobalTheme } from './utils/use-vr-global-theme';

const variantStyles = {
	brand: {
		bold: {
			color: token('color.text.inverse'),
			backgroundColor: token('color.background.brand.bold'),
			border: `1px solid ${token('color.border.brand')}`,
			hoverBackgroundColor: token('color.background.brand.bold.hovered'),
			activeBackgroundColor: token('color.background.brand.bold.pressed'),
			iconColor: token('color.icon.inverse'),
		},
	},
	information: {
		bold: {
			color: token('color.text.inverse'),
			backgroundColor: token('color.background.information.bold'),
			border: `1px solid ${token('color.border.information')}`,
			hoverBackgroundColor: token('color.background.information.bold.hovered'),
			activeBackgroundColor: token('color.background.information.bold.pressed'),
			iconColor: token('color.icon.inverse'),
		},
		default: {
			color: token('color.text.information'),
			backgroundColor: token('color.background.information'),
			border: `1px solid ${token('color.border.information')}`,
			hoverBackgroundColor: token('color.background.information.hovered'),
			activeBackgroundColor: token('color.background.information.pressed'),
			iconColor: token('color.icon.information'),
		},
	},
	input: {
		default: {
			color: token('color.text'),
			backgroundColor: token('color.background.input'),
			border: `1px solid ${token('color.border.input')}`,
			hoverBackgroundColor: token('color.background.input.hovered'),
			activeBackgroundColor: token('color.background.input.pressed'),
			iconColor: token('color.icon'),
		},
		placeholder: {
			color: token('color.text.subtlest'),
			backgroundColor: token('color.background.input'),
			border: `1px solid ${token('color.border.input')}`,
			hoverBackgroundColor: token('color.background.input.hovered'),
			activeBackgroundColor: token('color.background.input.pressed'),
			iconColor: token('color.icon'),
		},
	},
	neutral: {
		bold: {
			color: token('color.text.inverse'),
			backgroundColor: token('color.background.neutral.bold'),
			border: `1px solid ${token('color.border')}`,
			hoverBackgroundColor: token('color.background.neutral.bold.hovered'),
			activeBackgroundColor: token('color.background.neutral.bold.pressed'),
			iconColor: token('color.icon.inverse'),
		},
		default: {
			color: token('color.text'),
			backgroundColor: token('color.background.neutral'),
			border: `1px solid ${token('color.border')}`,
			hoverBackgroundColor: token('color.background.neutral.hovered'),
			activeBackgroundColor: token('color.background.neutral.pressed'),
			iconColor: token('color.icon'),
		},
		subtle: {
			color: token('color.text'),
			backgroundColor: token('color.background.neutral.subtle'),
			border: `1px solid ${token('color.border')}`,
			hoverBackgroundColor: token('color.background.neutral.subtle.hovered'),
			activeBackgroundColor: token('color.background.neutral.subtle.pressed'),
			iconColor: token('color.icon'),
		},
	},
	success: {
		bold: {
			color: token('color.text.inverse'),
			backgroundColor: token('color.background.success.bold'),
			border: `1px solid ${token('color.border.success')}`,
			hoverBackgroundColor: token('color.background.success.bold.hovered'),
			activeBackgroundColor: token('color.background.success.bold.pressed'),
			iconColor: token('color.icon.inverse'),
		},
		default: {
			color: token('color.text.success'),
			backgroundColor: token('color.background.success'),
			border: `1px solid ${token('color.border.success')}`,
			hoverBackgroundColor: token('color.background.success.hovered'),
			activeBackgroundColor: token('color.background.success.pressed'),
			iconColor: token('color.icon.success'),
		},
	},
	danger: {
		bold: {
			color: token('color.text.inverse'),
			backgroundColor: token('color.background.danger.bold'),
			border: `1px solid ${token('color.border.danger')}`,
			hoverBackgroundColor: token('color.background.danger.bold.hovered'),
			activeBackgroundColor: token('color.background.danger.bold.pressed'),
			iconColor: token('color.icon.inverse'),
		},
		default: {
			color: token('color.text.danger'),
			backgroundColor: token('color.background.danger'),
			border: `1px solid ${token('color.border.danger')}`,
			hoverBackgroundColor: token('color.background.danger.hovered'),
			activeBackgroundColor: token('color.background.danger.pressed'),
			iconColor: token('color.icon.danger'),
		},
	},
	warning: {
		bold: {
			color: token('color.text.warning.inverse'),
			backgroundColor: token('color.background.warning.bold'),
			border: `1px solid ${token('color.border.warning')}`,
			hoverBackgroundColor: token('color.background.warning.bold.hovered'),
			activeBackgroundColor: token('color.background.warning.bold.pressed'),
			iconColor: token('color.icon.warning.inverse'),
		},
		default: {
			color: token('color.text.warning'),
			backgroundColor: token('color.background.warning'),
			border: `1px solid ${token('color.border.warning')}`,
			hoverBackgroundColor: token('color.background.warning.hovered'),
			activeBackgroundColor: token('color.background.warning.pressed'),
			iconColor: token('color.icon.warning'),
		},
	},
	discovery: {
		bold: {
			color: token('color.text.inverse'),
			backgroundColor: token('color.background.discovery.bold'),
			border: `1px solid ${token('color.border.discovery')}`,
			hoverBackgroundColor: token('color.background.discovery.bold.hovered'),
			activeBackgroundColor: token('color.background.discovery.bold.pressed'),
			iconColor: token('color.icon.inverse'),
		},
		default: {
			color: token('color.text.discovery'),
			backgroundColor: token('color.background.discovery'),
			border: `1px solid ${token('color.border.discovery')}`,
			hoverBackgroundColor: token('color.background.discovery.hovered'),
			activeBackgroundColor: token('color.background.discovery.pressed'),
			iconColor: token('color.icon.discovery'),
		},
	},
};

const containerStyles = css({
	margin: '2em',
});

const rowStyles = css({
	display: 'flex',
	gap: '1em',
});

const boxStyles = css({
	display: 'flex',
	boxSizing: 'border-box',
	width: '100%',
	maxWidth: '200px',
	minHeight: '100px',
	padding: '1em',
	alignItems: 'center',
	borderRadius: token('border.radius.100', '3px'),
	marginBlockStart: '1em',
	textAlign: 'left',
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors -- Ignored via go/DSP-18766
	':hover': {
		cursor: 'pointer',
	},
});

const Box = ({ text, style }: { text: string; style: Record<string, string> }) => (
	<button
		type="button"
		css={[
			boxStyles,
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766
			css({
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
				backgroundColor: style.backgroundColor,
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
				border: style.border,
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
				color: style.color,
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/ui-styling-standard/no-unsafe-selectors -- Ignored via go/DSP-18766
				':hover': { backgroundColor: style.hoverBackgroundColor },
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/ui-styling-standard/no-unsafe-selectors -- Ignored via go/DSP-18766
				':active': { backgroundColor: style.activeBackgroundColor },
			}),
		]}
	>
		<AtlassianIcon label="Atlassian logo" primaryColor={style.iconColor} />
		{text}
	</button>
);

export default () => {
	useVrGlobalTheme();

	return (
		<div css={containerStyles}>
			<h2>Semantic tokens</h2>
			<div data-testid="tokens">
				{Object.entries(variantStyles).map(([key, subVariantStyles]) => (
					<div key={key} css={rowStyles}>
						{Object.entries(subVariantStyles).map(([subKey, styles]) => (
							<Box
								key={key + subKey}
								// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
								style={styles}
								text={`${key}.${subKey}`}
							/>
						))}
					</div>
				))}
			</div>
			<button type="button" onClick={() => setGlobalTheme({ colorMode: 'light' })}>
				light
			</button>
			<button type="button" onClick={() => setGlobalTheme({ colorMode: 'dark' })}>
				dark
			</button>
		</div>
	);
};
