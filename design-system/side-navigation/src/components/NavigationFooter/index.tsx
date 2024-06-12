import React, { type ReactNode } from 'react';

import { Box, xcss } from '@atlaskit/primitives';

export interface NavigationFooterProps {
	children: ReactNode;
}

const navigationFooterStyles = xcss({
	position: 'relative',
});

/**
 * __Navigation footer__
 *
 * Allows for customisation of the footer.
 *
 * - [Examples](https://atlassian.design/components/side-navigation/examples#header-and-footer)
 * - [Code](https://atlassian.design/components/side-navigation/code)
 */
const NavigationFooter = ({ children }: NavigationFooterProps) => {
	return (
		<Box padding="space.100" paddingBlockEnd="space.200" xcss={navigationFooterStyles}>
			{children}
		</Box>
	);
};

export default NavigationFooter;
