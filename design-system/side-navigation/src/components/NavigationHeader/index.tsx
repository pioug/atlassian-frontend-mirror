/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { cssMap, jsx } from '@compiled/react';

import { Box } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

const styles = cssMap({
	navigationFooter: {
		display: 'block',
		paddingBlockEnd: token('space.100'),
		paddingBlockStart: token('space.300'),
		paddingInlineEnd: token('space.100'),
		paddingInlineStart: token('space.100'),
	},
});

/**
 * @deprecated `@atlaskit/side-navigation` is deprecated. Use `@atlaskit/navigation-system` instead.
 */
export interface NavigationHeaderProps {
	children: JSX.Element | JSX.Element[];
}

/**
 * __Navigation header__
 *
 * Allows for customisation of the header.
 *
 * - [Examples](https://atlassian.design/components/side-navigation/examples#header-and-footer)
 * - [Code](https://atlassian.design/components/side-navigation/code)
 *
 * @deprecated `@atlaskit/side-navigation` is deprecated. Use `@atlaskit/navigation-system` instead.
 */
const NavigationHeader: (props: NavigationHeaderProps) => JSX.Element = (
	props: NavigationHeaderProps,
) => {
	const { children } = props;
	return (
		<Box xcss={styles.navigationFooter} data-navheader>
			{children}
		</Box>
	);
};

export default NavigationHeader;
