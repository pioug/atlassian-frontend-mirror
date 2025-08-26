/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import { forwardRef, useContext } from 'react';

import { cssMap, jsx } from '@atlaskit/css';
import { token } from '@atlaskit/tokens';

import { SpotlightContext } from '../../../controllers/context';

const styles = cssMap({
	root: {
		width: '15px',
		height: '15px',
		transform: 'rotate(45deg)',
		backgroundColor: token('color.background.neutral.bold'),
	},
	'top-start': {
		borderBottomRightRadius: '1px',
	},
	'top-end': {
		borderBottomRightRadius: '1px',
	},
	'bottom-start': {
		borderTopLeftRadius: '1px',
	},
	'bottom-end': {
		borderTopLeftRadius: '1px',
	},
	'right-start': {
		borderBottomLeftRadius: '1px',
	},
	'right-end': {
		borderBottomLeftRadius: '1px',
	},
	'left-start': {
		borderTopRightRadius: '1px',
	},
	'left-end': {
		borderTopRightRadius: '1px',
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
	const { placement } = useContext(SpotlightContext);

	return <div data-testid={testId} ref={ref} css={[styles.root, styles[placement]]}></div>;
});
