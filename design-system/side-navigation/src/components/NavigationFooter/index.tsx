/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { type ReactNode } from 'react';

import { cssMap, jsx } from '@compiled/react';

import { Box } from '@atlaskit/primitives/compiled';

const styles = cssMap({
	navigationFooter: {
		position: 'relative',
	},
});

export interface NavigationFooterProps {
	children: ReactNode;
}

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
		<Box padding="space.100" paddingBlockEnd="space.200" xcss={styles.navigationFooter}>
			{children}
		</Box>
	);
};

export default NavigationFooter;
