/**
 * @jsxRuntime classic
 * @jsx jsx
 */
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx } from '@emotion/react';

import { Box, xcss } from '@atlaskit/primitives';

const navigationFooterStyles = xcss({
	display: 'block',
	paddingTop: 'space.100',
	paddingRight: 'space.100',
	paddingBottom: 'space.100',
	paddingLeft: 'space.100',
	paddingBlockStart: 'space.300',
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
		<Box xcss={navigationFooterStyles} data-navheader>
			{children}
		</Box>
	);
};

export default NavigationHeader;
