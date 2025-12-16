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
		backgroundColor: token('color.background.neutral.bold'),
		clipPath: 'polygon(0 0,100% 100%,0 100%)',
		height: '15px',
		position: 'relative',
		width: '15px',
		zIndex: 700,
	},
	'top-start': {
		transform: 'rotate(315deg)',
	},
	'top-center': {
		transform: 'rotate(315deg)',
	},
	'top-end': {
		transform: 'rotate(315deg)',
	},
	'bottom-start': {
		transform: 'rotate(135deg)',
	},
	'bottom-center': {
		transform: 'rotate(135deg)',
	},
	'bottom-end': {
		transform: 'rotate(135deg)',
	},
	'right-start': {
		transform: 'rotate(45deg)',
	},
	'right-end': {
		transform: 'rotate(45deg)',
	},
	'left-start': {
		transform: 'rotate(225deg)',
	},
	'left-end': {
		transform: 'rotate(225deg)',
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
export const Caret: React.ForwardRefExoticComponent<
	React.PropsWithoutRef<CaretProps> & React.RefAttributes<HTMLDivElement>
> = forwardRef<HTMLDivElement, CaretProps>(({ testId }: CaretProps, ref) => {
	const { card } = useContext(SpotlightContext);

	return (
		<div
			data-testid={testId}
			ref={ref}
			css={[styles.root, styles[card.placement]]}
			// Growth Pattern Library designs dictate 1px radius. cssMap only allows tokens
			// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop
			style={{ borderEndStartRadius: '1px' }}
		></div>
	);
});
