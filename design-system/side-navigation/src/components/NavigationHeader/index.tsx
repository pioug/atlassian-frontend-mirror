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
 */
const NavigationHeader = (props: NavigationHeaderProps) => {
	const { children } = props;
	return (
		<Box xcss={styles.navigationFooter} data-navheader>
			{children}
		</Box>
	);
};

export default NavigationHeader;
