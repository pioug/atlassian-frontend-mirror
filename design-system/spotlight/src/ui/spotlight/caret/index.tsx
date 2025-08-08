/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import { forwardRef } from 'react';

import { cssMap, jsx } from '@atlaskit/css';
import { token } from '@atlaskit/tokens';

const styles = cssMap({
	root: {
		width: '16px',
		height: '16px',
		transform: 'rotate(45deg)',
		backgroundColor: token('color.background.neutral.bold'),
	},
});

export interface CaretProps {
	/**
	 * A `testId` prop is provided for specified elements, which is a unique
	 * string that appears as a data attribute `data-testid` in the rendered code,
	 * serving as a hook for automated tests
	 */
	testId?: string;
}
/**
 * __Caret__
 *
 * A `Caret` is a purely visual pointer displayed on the edge of a spotlight, which points to the target element.
 *
 */
export const Caret = forwardRef<HTMLDivElement, CaretProps>(({ testId }: CaretProps, ref) => {
	return <div data-testid={testId} ref={ref} css={styles.root}></div>;
});
