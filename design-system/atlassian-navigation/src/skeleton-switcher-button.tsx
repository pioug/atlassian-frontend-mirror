/**
 * @jsxRuntime classic
 * @jsx jsx
 */
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';

import Nav4AppSwitcherIcon from '@atlaskit/icon/core/app-switcher';
import AppSwitcherIcon from '@atlaskit/icon/core/migration/app-switcher';
import { token } from '@atlaskit/tokens';

import { SkeletonIconButton } from './components/SkeletonIconButton';
import { useTheme } from './theme';

export type SkeletonSwitcherButtonProps = {
	/**
	 *  Describes the specific role of this navigation component for users viewing the page with a screen
	 *  reader. Use this to differentiate the buttons from other navigation buttons on a page.
	 */
	label: string;
	/**
	 * A `testId` prop is provided for specified elements,
	 * which is a unique string that appears as a data attribute `data-testid` in the rendered code,
	 * serving as a hook for automated tests.
	 */
	testId?: string;
};

const skeletonSwitcherButtonStyles = css({
	margin: 0,
	// eslint-disable-next-line @atlaskit/design-system/no-physical-properties
	marginRight: token('space.050', '4px'),
	padding: `${token('space.050', '4px')} ${token('space.075', '6px')}`,
	border: 0,
	borderRadius: token('border.radius.circle', '100%'),
	pointerEvents: 'none',
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors -- Ignored via go/DSP-18766
	':focus, :active, :hover': {
		appearance: 'none',
		border: 0,
		outline: 0,
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors -- Ignored via go/DSP-18766
	'&:only-of-type': {
		// eslint-disable-next-line @atlaskit/design-system/no-physical-properties
		marginRight: 0,
	},
	// eslint-disable-next-line @atlaskit/design-system/no-nested-styles, @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'& > span': {
		// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
		lineHeight: 'normal',
	},
	// eslint-disable-next-line @atlaskit/design-system/no-nested-styles, @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'& > img': {
		width: 24,
		height: 24,
		borderRadius: token('border.radius.circle', '100%'),
		verticalAlign: 'middle',
	},
});

/**
 * __Skeleton switcher button__
 *
 * Skeleton buttons are lightweight HTML button elements with CSS that represent
 * their heavier interactive counterparts, for use when elements of the
 * navigation are loaded dynamically. This one represents the AppSwitcher button.
 *
 * - [Examples](https://atlassian.design/components/atlassian-navigation/examples#skeleton-button)
 * - [Code](https://atlassian.design/components/atlassian-navigation/code)
 */
export const SkeletonSwitcherButton = ({ label = '', testId }: SkeletonSwitcherButtonProps) => {
	const theme = useTheme();

	return (
		// eslint-disable-next-line @atlaskit/design-system/no-html-button
		<button
			// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
			style={theme.mode.iconButton.default as React.CSSProperties}
			data-testid={testId}
			css={skeletonSwitcherButtonStyles}
			type="button"
		>
			<AppSwitcherIcon color="currentColor" spacing="spacious" label={label} />
		</button>
	);
};

/**
 * __Nav 4 skeleton switcher button__
 *
 * A nav 4 skeleton switcher button
 */
export const Nav4SkeletonSwitcherButton = ({ label = '', testId }: SkeletonSwitcherButtonProps) => (
	<SkeletonIconButton>
		<Nav4AppSwitcherIcon label={label} spacing="spacious" color={token('color.icon')} />
	</SkeletonIconButton>
);
