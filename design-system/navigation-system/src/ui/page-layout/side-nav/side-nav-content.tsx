/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { forwardRef, type ReactNode, type Ref } from 'react';

import { jsx } from '@compiled/react';

import { cssMap } from '@atlaskit/css';
import { token } from '@atlaskit/tokens';

/**
 * The main content of the side nav, filling up the middle section. It acts as a scroll container.
 *
 * It will grow to take up the available space in the side nav — this is used to push the footer to the
 * bottom of the side nav.
 */
export const SideNavContent = forwardRef<HTMLDivElement, SideNavContentProps>(_SideNavContent);

// Placing this const below the function breaks Compiled!
const styles = cssMap({
	scrollContainer: {
		flex: 1,
		overflow: 'auto',
	},
	paddingContainer: {
		paddingTop: token('space.150'),
		paddingRight: token('space.150'),
		paddingBottom: token('space.150'),
		paddingLeft: token('space.150'),
	},
});

function _SideNavContent({ children, testId }: SideNavContentProps, ref: Ref<HTMLDivElement>) {
	return (
		/**
		 * We are adding two `div` elements here on purpose. The padding styles are added to a nested element to make sure the padding is included in the scrollable area.
		 * Otherwise we can run into issues with sticky child elements if the padding is added to the scrollable element - as the stick point would include the padding, but
		 * the scrollable area doesn't, so other non-sticky children can be seen above/below the sticky element's stick point.
		 */
		<div css={styles.scrollContainer} ref={ref} data-testid={testId}>
			<div css={styles.paddingContainer}>{children}</div>
		</div>
	);
}

type SideNavContentProps = {
	/**
	 * The content of the layout area.
	 * Should contain side nav menu items.
	 */
	children: ReactNode;
	/**
	 * A unique string that appears as data attribute `data-testid` in the rendered code, serving as a hook for automated tests.
	 */
	testId?: string;
};
