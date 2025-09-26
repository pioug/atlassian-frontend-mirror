/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React, { type CSSProperties, forwardRef } from 'react';

import { cssMap, jsx } from '@atlaskit/css';
import { type BackgroundColor, Box, Inline } from '@atlaskit/primitives/compiled';
import { N0, N500, N700, R400, Y300 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

const CSS_VAR_TEXT_COLOR = '--banner-text-color';

const inlineStyles = cssMap({ root: { minWidth: '0px' } });

const textStyles = cssMap({
	root: {
		// @ts-expect-error
		color: `var(${CSS_VAR_TEXT_COLOR})`,
		font: token('font.body'),
		fontWeight: token('font.weight.medium'),
		overflow: 'hidden',
		textOverflow: 'ellipsis',
		whiteSpace: 'nowrap',
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'a, a:visited, a:hover, a:focus, a:active': {
			color: 'currentColor',
			textDecoration: 'underline',
		},
	},
});

const backgroundColors: Record<Appearance, BackgroundColor> = {
	warning: 'color.background.warning.bold',
	error: 'color.background.danger.bold',
	announcement: 'color.background.neutral.bold',
};

const tokenBackgroundColors: Record<Appearance, string> = {
	warning: token('color.background.warning.bold', Y300),
	error: token('color.background.danger.bold', R400),
	announcement: token('color.background.neutral.bold', N500),
};

const tokenTextColors: Record<Appearance, string> = {
	warning: token('color.text.warning.inverse', N700),
	error: token('color.text.inverse', N0),
	announcement: token('color.text.inverse', N0),
};

type Appearance = 'warning' | 'error' | 'announcement';

const containerStyles = cssMap({
	root: {
		height: '3rem',
		alignItems: 'center',
		display: 'flex',
	},
});

const iconWrapperStyles = cssMap({
	root: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		width: '1.5rem',
		height: '1.5rem', // This matches Icon's "medium" size, without this the (line-)height is greater than that of the Icon
		flexShrink: '0',
	},
});

export interface BannerProps {
	/**
	 * Visual style to be used for the banner
	 */
	appearance?: Appearance;
	/**
	 * Content to be shown next to the icon. Typically text content but can contain links.
	 */
	children?: React.ReactNode;
	/**
	 * Icon to be shown left of the main content. Typically an Atlaskit [@atlaskit/icon](packages/design-system/icon)
	 */
	icon?: React.ReactElement;
	/**
	 * A `testId` prop is provided for specified elements, which is a unique string that appears as a data attribute `data-testid` in the rendered code, serving as a hook for automated tests
	 */
	testId?: string;
}

/**
 * __Banner__
 *
 * A banner displays a prominent message at the top of the screen.
 *
 * - [Examples](https://atlassian.design/components/banner/examples)
 * - [Code](https://atlassian.design/components/banner/code)
 * - [Usage](https://atlassian.design/components/banner/usage)
 */
const Banner: React.ForwardRefExoticComponent<
	React.PropsWithoutRef<BannerProps> & React.RefAttributes<HTMLDivElement>
> = forwardRef<HTMLDivElement, BannerProps>(
	({ appearance = 'warning', children, icon, testId }, ref) => {
		const appearanceType = appearance in backgroundColors ? appearance : 'warning';

		return (
			<Box
				xcss={containerStyles.root}
				backgroundColor={backgroundColors[appearanceType]}
				padding="space.150"
				testId={testId}
				ref={ref}
				role="alert"
			>
				<Inline space="space.050" alignBlock="center" alignInline="start" xcss={inlineStyles.root}>
					{icon ? (
						<Box
							as="span"
							xcss={iconWrapperStyles.root}
							style={{
								fill: tokenBackgroundColors[appearanceType],
								color: tokenTextColors[appearanceType],
							}}
						>
							{icon}
						</Box>
					) : null}
					<span
						style={
							{
								[CSS_VAR_TEXT_COLOR]: tokenTextColors[appearanceType],
							} as CSSProperties
						}
						css={textStyles.root}
					>
						{children}
					</span>
				</Inline>
			</Box>
		);
	},
);

export default Banner;
