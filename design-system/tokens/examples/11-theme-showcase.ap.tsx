/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import { useEffect, useState } from 'react';

import { cssMap, type CSSProperties, jsx } from '@compiled/react';

import { Label } from '@atlaskit/form/label/default';
import StarStarredIcon from '@atlaskit/icon/core/star-starred';
import type { NewCoreIconProps } from '@atlaskit/icon/types';
import { Flex } from '@atlaskit/primitives/compiled/flex';
import Select from '@atlaskit/select/default';
import { token } from '@atlaskit/tokens';
import { setGlobalTheme } from '@atlaskit/tokens/set-global-theme';
import type { ThemeState } from '@atlaskit/tokens/theme-state';

const iconSpacingStyles = cssMap({
	space050: {
		paddingBlock: token('space.050'),
		paddingInline: token('space.050'),
	},
});

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
		search: {
			color: token('color.text'),
			backgroundColor: token('color.background.input'),
			border: `1px solid ${token('color.border.input.search')}`,
			hoverBackgroundColor: token('color.background.input.hovered'),
			activeBackgroundColor: token('color.background.input.pressed'),
			iconColor: token('color.icon.subtle'),
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

const backgroundColorCssVar = '--background-color';
const hoverBackgroundColorCssVar = '--hover-background-color';
const activeBackgroundColorCssVar = '--active-background-color';

const styles = cssMap({
	container: {
		margin: '2em',
		backgroundColor: token('elevation.surface'),
	},
	row: {
		display: 'flex',
		gap: '1em',
	},
	box: {
		display: 'flex',
		boxSizing: 'border-box',
		width: '100%',
		maxWidth: '200px',
		minHeight: '100px',
		padding: '1em',
		alignItems: 'center',
		borderRadius: token('radius.small', '3px'),
		marginBlockStart: '1em',
		textAlign: 'left',
		backgroundColor: `var(${backgroundColorCssVar})`,
		'&:hover': {
			backgroundColor: `var(${hoverBackgroundColorCssVar})`,
			cursor: 'pointer',
		},
		'&:active': {
			backgroundColor: `var(${activeBackgroundColorCssVar})`,
		},
	},
});

const themeSelectOptions = [
	{ label: 'Light Theme', value: 'light', colorMode: 'light' },
	{ label: 'Dark Theme', value: 'dark', colorMode: 'dark' },
	{
		label: 'UNSAFE Test Light Theme',
		value: 'UNSAFE-test-light',
		colorMode: 'light',
	},
	{
		label: 'UNSAFE Test Dark Theme',
		value: 'UNSAFE-test-dark',
		colorMode: 'dark',
	},
] as const;

const Box = ({ text, style }: { text: string; style: Record<string, string> }) => (
	<button
		type="button"
		css={styles.box}
		style={
			{
				border: style.border,
				color: style.color,
				[backgroundColorCssVar]: style.backgroundColor,
				[hoverBackgroundColorCssVar]: style.hoverBackgroundColor,
				[activeBackgroundColorCssVar]: style.activeBackgroundColor,
			} as CSSProperties
		}
	>
		<Flex xcss={iconSpacingStyles.space050}>
			<StarStarredIcon label="Star icon" color={style.iconColor as NewCoreIconProps['color']} />
		</Flex>
		{text}
	</button>
);

export default (): JSX.Element => {
	const [selectedTheme, setSelectedTheme] = useState<Partial<ThemeState>>({
		light: 'light',
		dark: 'dark',
		colorMode: 'light',
	});

	useEffect(() => {
		setGlobalTheme(selectedTheme);
		// oxlint-disable-next-line react-hooks/exhaustive-deps -- only re-apply when theme or color mode changes
	}, [selectedTheme.light, selectedTheme.colorMode]);

	return (
		<div css={styles.container}>
			<h2>Semantic tokens</h2>
			<div>
				<Label htmlFor="theme-select">Theme</Label>
				<Select
					inputId="theme-select"
					spacing="compact"
					options={themeSelectOptions}
					value={themeSelectOptions.find((option) => option.value === selectedTheme.light)}
					onChange={(selection) => {
						const nextTheme = themeSelectOptions.find(
							(option) => option.value === selection?.value,
						);
						if (nextTheme) {
							setSelectedTheme({ ...selectedTheme, light: nextTheme.value });
						}
					}}
				/>
			</div>
			<div data-testid="tokens">
				{Object.entries(variantStyles).map(([key, subVariantStyles]) => (
					<div key={key} css={styles.row}>
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
		</div>
	);
};
