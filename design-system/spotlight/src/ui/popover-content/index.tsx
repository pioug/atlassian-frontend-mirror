/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { type ReactNode, useContext, useEffect, useRef } from 'react';

import { cssMap, jsx } from '@atlaskit/css';
import mergeRefs from '@atlaskit/ds-lib/merge-refs';
import { Popper, type Placement as PopperPlacement } from '@atlaskit/popper';

import { SpotlightContext } from '../../controllers/context';
import type { DismissEvent, Placement } from '../../types';
import { useFocusWithin } from '../../utils/use-focus-within';
import { useOnClickOutside } from '../../utils/use-on-click-outside';
import { useOnEscape } from '../../utils/use-on-escape';

const styles = cssMap({
	root: {
		zIndex: 700,
	},
});

/**
 * The `transform: rotate(45deg);` styles used to rotate the `Caret` component result in the corners of
 * the caret extending beyond the bounding box (by roughly 2px). So, apply an offset to ensure
 * the caret points to the very edge of the target element.
 *
 * Note: `@atlaskit/popper` maps the offset to the placement, so we only need to define `[0, 2]` and
 * the offset will get correctly rotated depending on the placement.
 */
const offset: [number, number] = [0, 2];

export interface PopoverContentProps {
	/**
	 * A `testId` prop is provided for specified elements, which is a unique
	 * string that appears as a data attribute `data-testid` in the rendered code,
	 * serving as a hook for automated tests
	 */
	testId?: string;
	placement: Placement;
	isVisible?: boolean;
	shouldDismissOnClickOutside?: boolean;
	dismiss: (event: DismissEvent) => void;
	children: ReactNode;
}

/**
 * The Spotlight card can be positioned in many different configurations, but the caret should always point to
 * the center of the target element. `@atlaskit/popper` uses `'top' | 'right' | 'bottom' | 'left'` values for
 * this center alignment along the respective face. So we translate between the Spotlight position, and the
 * Popper position using this map.
 */
const popperPlacementMap: Record<
	Placement,
	Extract<PopperPlacement, 'top' | 'right' | 'bottom' | 'left'>
> = {
	'top-start': 'top',
	'top-center': 'top',
	'top-end': 'top',
	'bottom-start': 'bottom',
	'bottom-center': 'bottom',
	'bottom-end': 'bottom',
	'right-start': 'right',
	'right-end': 'right',
	'left-start': 'left',
	'left-end': 'left',
};

/**
 * __PopoverContent__
 *
 * A `PopoverContent` is the element that is shown as a popover.
 */
export const PopoverContent = ({
	children,
	placement,
	isVisible = true,
	shouldDismissOnClickOutside = true,
	dismiss,
	testId,
}: PopoverContentProps) => {
	const updateRef = useRef<() => Promise<any>>(() => new Promise(() => undefined));
	const ref = useRef<HTMLDivElement>();
	const { heading, popoverContent, card } = useContext(SpotlightContext);
	const focusWithin = useFocusWithin(popoverContent.ref);

	useEffect(() => {
		popoverContent.setRef(ref);
	}, [ref, popoverContent]);

	useEffect(() => {
		popoverContent.setDismiss(dismiss);
	}, [dismiss, popoverContent]);

	useEffect(() => {
		card.setPlacement(placement);
	}, [placement, card]);

	useEffect(() => {
		if (updateRef.current) {
			popoverContent.setUpdate(() => updateRef.current);
		}
	}, [popoverContent]);

	useOnEscape((event: KeyboardEvent) => {
		if (!focusWithin) {
			return;
		}

		popoverContent.dismiss.current(event);
	});

	useOnClickOutside((event: MouseEvent) => {
		if (!shouldDismissOnClickOutside) {
			return;
		}

		popoverContent.dismiss.current(event);
	});

	return (
		<Popper offset={offset} placement={popperPlacementMap[placement]}>
			{({ ref: localRef, style, update }) => {
				if (!isVisible) {
					return;
				}

				updateRef.current = update;

				return (
					<div
						role="dialog"
						data-testid={testId}
						aria-labelledby={heading.id}
						ref={mergeRefs([ref, localRef])}
						// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop
						style={style}
						css={styles.root}
					>
						{children}
					</div>
				);
			}}
		</Popper>
	);
};
