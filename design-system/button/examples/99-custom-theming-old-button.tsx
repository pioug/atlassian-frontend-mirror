/* eslint-disable @atlaskit/design-system/consistent-css-prop-usage */
/**
 * @jsxRuntime classic
 * @jsx jsx
 */
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { type CSSObject, jsx } from '@emotion/react';

import {
	ButtonGroup,
	CustomThemeButton,
	Theme,
	type ThemeProps,
	type ThemeTokens,
} from '@atlaskit/button';
import AddIcon from '@atlaskit/icon/glyph/editor/add';
import * as colors from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

function ourTheme(
	currentTheme: (props: ThemeProps) => ThemeTokens,
	themeProps: ThemeProps,
): ThemeTokens {
	const { buttonStyles, ...rest } = currentTheme(themeProps);
	return {
		buttonStyles: {
			...buttonStyles,
			...baseStyles,
			...extract(themeProps),
		},
		...rest,
	};
}

function Example() {
	return (
		<div css={{ margin: token('space.250', '20px') }} aria-live="polite">
			<h3 css={{ marginBottom: token('space.200', '16px') }}>ADG Button</h3>
			<ButtonGroup>
				<CustomThemeButton iconBefore={<AddIcon label="" />}>Button</CustomThemeButton>
				<CustomThemeButton appearance="primary">Button</CustomThemeButton>
				<CustomThemeButton appearance="warning">Button</CustomThemeButton>
			</ButtonGroup>

			<h3 css={{ marginBottom: token('space.200', '16px') }}>Themed Button</h3>
			<ButtonGroup>
				<CustomThemeButton
					// eslint-disable-next-line @repo/internal/react/no-unsafe-overrides
					theme={ourTheme}
					iconBefore={<AddIcon label="" />}
				>
					Button
				</CustomThemeButton>
				{/* eslint-disable-next-line @repo/internal/react/no-unsafe-overrides */}
				<CustomThemeButton theme={ourTheme} appearance="primary">
					Button
				</CustomThemeButton>
				{/* eslint-disable-next-line @repo/internal/react/no-unsafe-overrides */}
				<CustomThemeButton theme={ourTheme} appearance="primary" isLoading>
					Button
				</CustomThemeButton>
				{/* eslint-disable-next-line @repo/internal/react/no-unsafe-overrides */}
				<CustomThemeButton theme={ourTheme} isDisabled>
					Button
				</CustomThemeButton>
			</ButtonGroup>

			<h3 css={{ marginBottom: token('space.200', '16px') }}>Themed using Theme.Provider</h3>
			<Theme.Provider value={ourTheme}>
				<ButtonGroup>
					<CustomThemeButton iconBefore={<AddIcon label="" />}>Button</CustomThemeButton>
					<CustomThemeButton appearance="primary">Button</CustomThemeButton>
					<CustomThemeButton appearance="primary" isLoading>
						Button
					</CustomThemeButton>
					<CustomThemeButton isDisabled>Button</CustomThemeButton>
				</ButtonGroup>
			</Theme.Provider>
		</div>
	);
}

export default () => <Example />;

const baseStyles: CSSObject = {
	border: 'none',
	padding: `0px ${token('space.200', '16px')}`,
	borderRadius: '15px',
	fontWeight: token('font.weight.bold'),
};

const customTheme = {
	default: {
		background: {
			default: '#657982',
			hover: '#5D717A',
			active: '#546871',
		},
		color: {
			default: '#FFFFFF',
			hover: '#FFFFFF',
			active: '#FFFFFF',
		},
		boxShadow: {
			default: `1px 2px 0 0 ${colors.N40A}`,
			hover: `1px 2px 0 0 ${colors.N50A}`,
			active: '0px 0px 0 0',
		},
		transform: {
			default: 'initial',
			active: 'translateY(2px) translateX(1px)',
		},
		transition: {
			default:
				'background 0.1s ease-out, box-shadow 0.1s cubic-bezier(0.47, 0.03, 0.49, 1.38) transform:0.1s',
			active:
				'background 0s ease-out, box-shadow 0s cubic-bezier(0.47, 0.03, 0.49, 1.38) transform:0s',
		},
	},
	primary: {
		background: {
			default: '#0080A4',
			hover: '#006E8A',
			active: '#007998',
		},
		boxShadow: {
			default: `1px 2px 0 0 ${colors.N40A}`,
			hover: `1px 2px 0 0 ${colors.N50A}`,
			active: '0px 0px 0 0',
		},
		transform: {
			default: 'initial',
			active: 'translateY(2px) translateX(1px)',
		},
		transition: {
			default:
				'background 0.1s ease-out, box-shadow 0.1s cubic-bezier(0.47, 0.03, 0.49, 1.38) transform:0.1s',
			active:
				'background 0s ease-out, box-shadow 0s cubic-bezier(0.47, 0.03, 0.49, 1.38) transform:0s',
		},
	},
};

function extract({ mode, appearance = 'default', state }: ThemeProps): CSSObject | undefined {
	// @ts-ignore
	const root = customTheme[appearance];

	if (!root) {
		return undefined;
	}
	return Object.keys(root).reduce((acc: { [index: string]: string }, val) => {
		let node = root;
		[val, state, mode].forEach((item = '') => {
			if (!node[item]) {
				return undefined;
			}
			if (typeof node[item] !== 'object') {
				acc[val] = node[item];
				return undefined;
			}
			node = node[item];
			return undefined;
		});
		return acc;
	}, {});
}
