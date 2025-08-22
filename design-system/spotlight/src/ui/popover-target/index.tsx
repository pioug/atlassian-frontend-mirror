/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { type ReactNode } from 'react';

import { cssMap, jsx } from '@atlaskit/css';
import { Reference } from '@atlaskit/popper';

const styles = cssMap({
	root: {
		width: 'fit-content',
	},
});

/**
 * __Target__
 *
 * A target is the element that the popover content will be positioned in relation to.
 */
export const PopoverTarget = ({ children }: { children: ReactNode }) => {
	return (
		<Reference>
			{({ ref }) => (
				<div css={styles.root} ref={ref}>
					{children}
				</div>
			)}
		</Reference>
	);
};
