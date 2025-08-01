/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React, { useEffect, useRef } from 'react';

import { cssMap, cx, jsx } from '@compiled/react';

import type { LogoProps } from '@atlaskit/logo';
import { fg } from '@atlaskit/platform-feature-flags';
// eslint-disable-next-line @atlaskit/design-system/no-emotion-primitives -- to be migrated to @atlaskit/primitives/compiled – go/akcss
import { Anchor } from '@atlaskit/primitives';
import type {
	IconProps as TempIconProps,
	LogoProps as TempLogoProps,
} from '@atlaskit/temp-nav-app-icons/types';
import { token } from '@atlaskit/tokens';

import { useHasCustomTheme } from '../themed/has-custom-theme-context';

import { LogoRenderer } from './logo-renderer';

const anchorStyles = cssMap({
	root: {
		display: 'flex',
		alignItems: 'center',
		height: '32px',
		borderRadius: token('border.radius.100', '3px'),
	},
	customLogoBorderRadius: {
		borderRadius: token('border.radius.100', '3px'),
	},
	newMargin: {
		// Additional margin is added to the left of the interactive element, to create visual alignment
		// with the app tile icon and the other icon buttons that use normal (non-tile) icons.
		marginInlineStart: token('space.050'),
	},
	// This is the same between app-logo and nav-logo
	newInteractionStates: {
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
	newInteractionStatesCustomTheming: {
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

const sharedIconOrLogoContainerStyles = cssMap({
	root: {
		// Overflow should never occur, but hiding it just in case
		overflow: 'hidden',
		/**
		 * Using a nested selector because we cannot resize the image correctly by only styling the container.
		 *
		 * We could have changed the API to accept a string, and we would render the image ourselves.
		 * But there is no way to prevent makers from rendering the image themselves (even if by accident).
		 *
		 * This seemed like the more robust option.
		 */
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		img: {
			// Using a fixed height and letting the width auto-adjust.
			height: 24,
			maxWidth: 'inherit',
			// The replaced content is scaled to maintain its aspect ratio while fitting within the element's content box.
			// So if the replaced content is too wide, it can display at a smaller height than the element's fixed height.
			objectFit: 'contain',
		},
	},
	appIconTilePaddingFlagged: {
		paddingInline: token('space.050'),
	},
});

const iconContainerStyles = cssMap({
	root: {
		display: 'flex',
		// Max width the icon can display at (a square)
		maxWidth: 24,
		// Using `content-box` sizing because the padding is irrelevant for the maxWidth
		boxSizing: 'content-box',
		paddingInline: token('space.050'),
		'@media (min-width: 64rem)': {
			// '&&' is required to add more CSS specificity to resolve non-deterministic ordering, which can result in
			// both the `icon` and `logo` elements to be displayed at the same time
			// Clean up task: https://jplat.atlassian.net/browse/BLU-4788
			// @ts-ignore
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors
			'&&': {
				display: 'none',
			},
		},
	},
});

const logoContainerStyles = cssMap({
	root: {
		display: 'none',
		// Max width the logo can display at
		maxWidth: 320,
		// Using `content-box` sizing because the padding is irrelevant for the maxWidth
		boxSizing: 'content-box',
		paddingInline: token('space.100'),
		'@media (min-width: 64rem)': {
			// '&&' is required to add more CSS specificity to resolve non-deterministic ordering, which can result in
			// both the `icon` and `logo` elements to be displayed at the same time
			// Clean up task: https://jplat.atlassian.net/browse/BLU-4788
			// @ts-ignore
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors
			'&&': {
				display: 'flex',
			},
		},
	},
});

/**
 * __Custom logo__
 *
 * Custom logo for the top navigation.
 *
 * To provide a responsive experience, it requires both a logo and an icon component.
 * The logo component will be used for large viewports, and the icon component will be used for small viewports.
 */
export const CustomLogo = ({
	href,
	logo,
	icon,
	onClick,
	label,
}: {
	/**
	 * Provide an accessible label, often used by screen readers.
	 */
	label: string;
	/**
	 * The URL to navigate to when the element is clicked.
	 */
	href: string;
	/**
	 * The logo component to render. It will be used for large viewports.
	 */
	logo: ((props: LogoProps) => JSX.Element) | ((props: TempLogoProps) => JSX.Element);
	/**
	 * The icon component to render. It will be used for small viewports.
	 */
	icon: ((props: LogoProps) => JSX.Element) | ((props: TempIconProps) => JSX.Element);
	/**
	 * Handler called on click.
	 */
	onClick?: React.MouseEventHandler<HTMLAnchorElement>;
}) => {
	const ref = useRef<HTMLAnchorElement>(null);

	useEffect(() => {
		if (process.env.NODE_ENV === 'production') {
			return;
		}

		if (!ref.current) {
			return;
		}

		const img = ref.current.querySelector('img');
		if (!img) {
			return;
		}

		/**
		 * We want custom logo components to render the image as the immediate child
		 */
		const hasExpectedStructure = img.parentElement?.parentElement === ref.current;
		/**
		 * We want custom logo components to render only one image
		 */
		const isOnlyChild = img.parentElement?.childElementCount === 1;

		if (!hasExpectedStructure || !isOnlyChild) {
			// eslint-disable-next-line no-console
			console.error('Custom logos should render only a single image tag with no wrappers.');
		}

		if (
			img.getAttribute('width') !== null ||
			img.getAttribute('height') !== null ||
			img.style.width !== '' ||
			img.style.height !== ''
		) {
			// eslint-disable-next-line no-console
			console.error(
				'Do not set explicit dimensions on custom logo images. The container will resize the image to fit.',
			);
		}
	}, []);

	const hasCustomTheme = useHasCustomTheme();

	return (
		<Anchor
			ref={ref}
			aria-label={label}
			href={href}
			// @ts-expect-error - non-standard values for `borderRadius` and the custom theming interaction states
			// eslint-disable-next-line @compiled/no-suppress-xcss
			xcss={cx(
				anchorStyles.root,
				anchorStyles.customLogoBorderRadius,
				anchorStyles.newMargin,
				hasCustomTheme
					? anchorStyles.newInteractionStatesCustomTheming
					: anchorStyles.newInteractionStates,
			)}
			onClick={onClick}
		>
			<div
				css={[
					sharedIconOrLogoContainerStyles.root,
					iconContainerStyles.root,
					fg('platform-team25-app-icon-tiles') &&
						sharedIconOrLogoContainerStyles.appIconTilePaddingFlagged,
				]}
			>
				<LogoRenderer logoOrIcon={icon} />
			</div>
			<div
				css={[
					sharedIconOrLogoContainerStyles.root,
					logoContainerStyles.root,
					fg('platform-team25-app-icon-tiles') &&
						sharedIconOrLogoContainerStyles.appIconTilePaddingFlagged,
				]}
			>
				<LogoRenderer logoOrIcon={logo} />
			</div>
		</Anchor>
	);
};
