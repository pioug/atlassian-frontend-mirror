/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React, { useCallback, useRef } from 'react';

import { cssMap, cx, jsx } from '@compiled/react';

import type { LogoProps } from '@atlaskit/logo';
// eslint-disable-next-line @atlaskit/design-system/no-emotion-primitives -- to be migrated to @atlaskit/primitives/compiled – go/akcss
import { Anchor, Inline, Text } from '@atlaskit/primitives';
import { token } from '@atlaskit/tokens';
import Tooltip from '@atlaskit/tooltip';

import { useHasCustomTheme } from '../themed/has-custom-theme-context';

import { LogoRenderer } from './logo-renderer';

const anchorStyles = cssMap({
	root: {
		display: 'flex',
		alignItems: 'center',
		height: '32px',
		borderRadius: '10px',
		flexShrink: 0,
		// '&&' is required to add more CSS specificity to ensure styles take precedence over the default Anchor styles
		// @ts-ignore
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors
		'&&': {
			textDecoration: 'none',
			color: 'inherit',
		},
		// Additional margin is added to the left of the interactive element, to create visual alignment
		// with the app tile icon and the other icon buttons that use normal (non-tile) icons.
		marginInlineStart: token('space.050'),
	},
	// This is the same between app-logo and nav-logo
	interactionStates: {
		'&:hover': {
			backgroundColor: token('color.background.neutral.subtle.hovered'),
		},
		'&:active': {
			// Compiled bug is causing the `&:hover` state to take precedence in Jira
			// Reported to #help-compiled but may not be fixed soon
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-important-styles
			backgroundColor: `${token('color.background.neutral.subtle.pressed')}!important`,
		},
	},
	interactionStatesCustomTheming: {
		'&:hover': {
			backgroundColor: 'var(--ds-top-bar-button-background-hovered)',
		},
		'&:active': {
			// Compiled bug is causing the `&:hover` state to take precedence in Jira
			// Reported to #help-compiled but may not be fixed soon
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-important-styles
			backgroundColor: 'var(--ds-top-bar-button-background-pressed)!important',
		},
	},
});

const logoWrapperStyles = cssMap({
	root: {
		paddingInline: token('space.050'),
	},
});

const iconContainerStyles = cssMap({
	root: {
		// Overflow should never occur, but hiding it just in case
		overflow: 'hidden',
		display: 'flex',
		maxWidth: 24,
	},
});

const logoTextStyles = cssMap({
	root: {
		// Logo text should never wrap or overflow
		width: 'max-content',
		maxWidth: 320,
		userSelect: 'none',
		paddingInlineEnd: token('space.025'),
		display: 'none',
		'@media (min-width: 64rem)': {
			// @ts-ignore
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors
			'&&': {
				display: 'initial',
			},
		},
	},
});

function isTextClamped(element: HTMLElement): boolean {
	// Checking for vertical height rather than horizontal height.
	// When text is "clamped", it's technically being clamped vertically! 🤯
	return element.scrollHeight > element.clientHeight;
}

/**
 * __App logo__
 *
 * The app logo for the top navigation.
 *
 * To provide a responsive experience, label text will render next to an icon at larger viewports.
 */
export const AppLogo = ({
	name,
	label,
	href,
	icon,
	onClick,
}: {
	/**
	 * The name of the app. Will be displayed next to the logo in wider viewports, and is used as an accessible label at smaller viewports.
	 */
	name: string;
	/**
	 * Provide an accessible label, often used by screen readers.
	 * This label should include the name of the app, and if applicable,
	 * the location the user will navigate to on click.
	 */
	label: string;
	/**
	 * The URL to navigate to when the element is clicked.
	 */
	href: string;
	/**
	 * The icon to render.
	 */
	icon: (props: LogoProps) => JSX.Element;
	/**
	 * Handler called on click.
	 */
	onClick?: React.MouseEventHandler<HTMLAnchorElement>;
}) => {
	const ref = useRef<HTMLAnchorElement>(null);
	const nameRef = useRef<HTMLSpanElement | null>(null);

	const hasCustomTheme = useHasCustomTheme();

	/**
	 * Show the tooltip if the name is truncated
	 */
	const canTooltipAppear = useCallback((): boolean => {
		const text = nameRef.current;
		return Boolean(text && isTextClamped(text));
	}, []);

	return (
		<Anchor
			ref={ref}
			aria-label={label}
			href={href}
			// @ts-expect-error - non-standard values for `borderRadius` and the custom theming interaction states
			// eslint-disable-next-line @compiled/no-suppress-xcss
			xcss={cx(
				anchorStyles.root,
				hasCustomTheme
					? anchorStyles.interactionStatesCustomTheming
					: anchorStyles.interactionStates,
			)}
			onClick={onClick}
		>
			<Inline space="space.075" alignBlock="center" xcss={logoWrapperStyles.root}>
				<div css={[iconContainerStyles.root]}>
					<LogoRenderer
						// Top nav always uses the new logo design
						shouldUseNewLogoDesign={true}
						logoOrIcon={icon}
					/>
				</div>
				<span css={logoTextStyles.root}>
					<Tooltip
						content={name}
						position="bottom"
						ignoreTooltipPointerEvents
						hideTooltipOnMouseDown
						// We don't need a duplicate hidden element containing tooltip content
						// as the content of the tooltip matches what is rendered in the nav item.
						isScreenReaderAnnouncementDisabled
						canAppear={canTooltipAppear}
					>
						{(tooltipProps) => (
							<span {...tooltipProps}>
								<Text
									aria-hidden={true}
									color="inherit"
									weight="semibold"
									maxLines={1}
									ref={nameRef}
								>
									{name}
								</Text>
							</span>
						)}
					</Tooltip>
				</span>
			</Inline>
		</Anchor>
	);
};
