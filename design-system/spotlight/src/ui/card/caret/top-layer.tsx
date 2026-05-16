/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { forwardRef, useContext } from 'react';

import { cssMap, jsx } from '@atlaskit/css';
import { token } from '@atlaskit/tokens';

import { SpotlightContext } from '../../../controllers/context';
import type { Placement } from '../../../types';
import { getResolvedPositionArea } from '../../../utils/get-resolved-position-area';

const styles = cssMap({
	root: {
		backgroundColor: token('color.background.neutral.bold'),
		clipPath: 'polygon(0 0,100% 100%,0 100%)',
		height: '15px',
		position: 'absolute',
		width: '15px',
	},
	'start span-start': {
		insetBlockEnd: token('space.0'),
		insetInlineEnd: token('space.250'),
		transform: 'rotate(315deg)',
	},
	'block-start': {
		insetBlockEnd: token('space.0'),
		// @ts-expect-error
		insetInlineStart: 'calc(50% - 7px)', // half the width of the card, minus half the width of the caret
		transform: 'rotate(315deg)',
	},
	'start span-end': {
		insetBlockEnd: token('space.0'),
		// @ts-expect-error
		insetInlineStart: '21px',
		transform: 'rotate(315deg)',
	},
	'span-start end': {
		insetInlineStart: token('space.0'),
		// @ts-expect-error
		insetBlockEnd: '14px',
		transform: 'rotate(45deg)',
	},
	'span-end end': {
		insetInlineStart: token('space.0'),
		// @ts-expect-error
		insetBlockStart: '19px',
		transform: 'rotate(45deg)',
	},
	'span-start start': {
		insetInlineEnd: token('space.0'),
		// @ts-expect-error
		insetBlockEnd: '14px',
		transform: 'rotate(225deg)',
	},
	'span-end start': {
		insetInlineEnd: token('space.0'),
		// @ts-expect-error
		insetBlockStart: '19px',
		transform: 'rotate(225deg)',
	},
	'end span-start': {
		insetBlockStart: token('space.0'),
		// @ts-expect-error
		insetInlineEnd: '20px',
		transform: 'rotate(135deg)',
	},
	'block-end': {
		insetBlockStart: token('space.0'),
		// @ts-expect-error
		insetInlineStart: 'calc(50% - 7px)', // half the width of the card, minus half the width of the caret
		transform: 'rotate(135deg)',
	},
	'end span-end': {
		insetBlockStart: token('space.0'),
		// @ts-expect-error
		insetInlineStart: '21px',
		transform: 'rotate(135deg)',
	},
});

export interface CaretProps {
	/**
	 * The position in relation to the target the content should be shown at. Overrides `PopoverContent.placement`
	 */
	placement?: Placement;

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
> = forwardRef<HTMLDivElement, CaretProps>(({ placement, testId }: CaretProps, ref) => {
	const { card, popoverContent } = useContext(SpotlightContext);

	const positionArea = getResolvedPositionArea(
		placement || card.placement,
		popoverContent.positionArea,
	);

	return (
		<div
			data-testid={testId}
			ref={ref}
			css={[styles.root, styles[positionArea]]}
			// Growth Pattern Library designs dictate 1px radius. cssMap only allows tokens
			// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop
			style={{ borderEndStartRadius: '1px' }}
		></div>
	);
});
