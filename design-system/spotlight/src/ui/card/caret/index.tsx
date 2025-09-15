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
		position: 'relative',
		zIndex: 700,
		width: '15px',
		height: '15px',
		transform: 'rotate(45deg)',
		backgroundColor: token('color.background.neutral.bold'),
	},
	'top-start': {
		borderEndEndRadius: '1px',
	},
	'top-end': {
		borderEndEndRadius: '1px',
	},
	'bottom-start': {
		borderStartStartRadius: '1px',
	},
	'bottom-end': {
		borderStartStartRadius: '1px',
	},
	'right-start': {
		borderEndStartRadius: '1px',
	},
	'right-end': {
		borderEndStartRadius: '1px',
	},
	'left-start': {
		borderStartEndRadius: '1px',
	},
	'left-end': {
		borderStartEndRadius: '1px',
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
