/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { type ReactNode, useContext, useEffect, useRef } from 'react';

import { cssMap, jsx } from '@atlaskit/css';
import mergeRefs from '@atlaskit/ds-lib/merge-refs';
import { Popper, type Placement as PopperPlacement } from '@atlaskit/popper';

import { SpotlightContext } from '../../controllers/context';
import type { BackEvent, DismissEvent, DoneEvent, NextEvent, Placement } from '../../types';
import { useFocusWithin } from '../../utils/use-focus-within';
import { useOnClickOutside } from '../../utils/use-on-click-outside';
import { useOnEscape } from '../../utils/use-on-escape';

const styles = cssMap({
	root: {
		zIndex: 700,
	},
});

/**
 * Taken from `@atlaskit/popper`
 */
type Offset = [number | null | undefined, number | null | undefined];

/**
 * The `transform: rotate(45deg);` styles used to rotate the `Caret` component result in the corners of
 * the caret extending beyond the bounding box (by roughly 2px). So, apply an offset to ensure
 * the caret points to the very edge of the target element.
 *
 * Note: `@atlaskit/popper` maps the offset to the placement, so we only need to define `[0, 2]` and
 * the offset will get correctly rotated depending on the placement.
 */
const defaultOffset: Offset = [0, 2];

interface BasePopoverContentProps {
	/**
	 * A `testId` prop is provided for specified elements, which is a unique
	 * string that appears as a data attribute `data-testid` in the rendered code,
	 * serving as a hook for automated tests
	 */
	testId?: string;

	/**
	 * The position in relation to the target the content should be shown at.
	 */
	placement: Placement;

	/**
	 * Controls whether or not `PopoverContent` is visible. Defaults to `true`.
	 */
	isVisible?: boolean;

	/**
	 * Controls whether the 'dismiss' action is invoked when the user clicks outside the content. Defaults to `true`.
	 */
	shouldDismissOnClickOutside?: boolean;

	/**
	 * Spotlights can be dismissed by:
	 * - Clicking the `SpotlightDismissControl`
	 * - Clicking any DOM element outside the spotlight (if `shouldDismissOnClickOutside === true`)
	 * - Pressing the Escape key
	 *
	 * These events align to the React.MouseEvent<HTMLButtonElement, MouseEvent>, MouseEvent, and KeyboardEvent events respectively.
	 * Defaults to `true`.
	 */
	dismiss: (event: DismissEvent) => void;

	/**
	 * Invoked when the user clicks `SpotlightSecondaryAction`. If an `onClick` handler is provided to `SpotlightSecondaryAction`
	 * then that takes precedence, and `back` will be ignored.
	 */
	back?: (event: BackEvent) => void;


	/**
	 * Distance the spotlight should be offset from the target in the format of [along, away] (units in px).
	 * Defaults to [0, 2] - which means the spotlight will be 2px away from the edge of the target specified
	 * by the `placement` prop.
	 */
	offset?: Offset;

	/**
	 * The content to be rendered in `PopoverContent`. This is intended to be a `SpotlightCard`.
	 */
	children: ReactNode;
}

export type PopoverContentProps = BasePopoverContentProps &
	(
		| {
			/**
			 * Invoked when the user clicks `SpotlightPrimaryAction` in a tour.
			 * If an `onClick` handler is provided to `SpotlightPrimaryAction` then that takes precedence,
			 * and `next` will be ignored.
			 *
			 * If `next` is passed to `PopoverContent`, then `done` cannot be passed. This will result in a type error.
			 */
			next: (event: NextEvent) => void;

			/**
			 * Invoked when the user clicks `SpotlightPrimaryAction`.
			 * If an `onClick` handler is provided to SpotlightPrimaryAction then that takes precedence,
			 * and `done` will be ignored.
			 *
			 * If `done` is passed to PopoverContent, then `next` cannot be passed. This will result in a type error.
			 */
			done?: never;
		}
		| {
			done: (event: DoneEvent) => void;
			next?: never;
		}
		| {
			next?: never;
			done?: never;
		}
	);

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
export const PopoverContent = (props: PopoverContentProps) => {
	const {
		children,
		placement,
		isVisible = true,
		shouldDismissOnClickOutside = true,
		dismiss,
		back,
		testId,
		offset = defaultOffset,
	} = props;

	/**
	 * A user should only be able to pass a `done` or a `next`. Not both.
	 * The type is set up as a discriminant union. So, we need a typeguard
	 * here to destructure it properly.
	 */
	const done = 'done' in props ? props.done : undefined;
	const next = 'next' in props ? props.next : undefined;
	const updateRef = useRef<() => Promise<any>>(() => new Promise(() => undefined));
	const ref = useRef<HTMLDivElement>();
	const { heading, popoverContent, card, primaryAction, secondaryAction } =
		useContext(SpotlightContext);
	const focusWithin = useFocusWithin(popoverContent.ref);

	useEffect(() => {
		popoverContent.setRef(ref);
	}, [ref, popoverContent]);

	useEffect(() => {
		if (!done && !next) {
			return;
		}

		if (done) {
			primaryAction.setAction(done);
			return;
		} else if (next) {
			primaryAction.setAction(next);
			return;
		}
	}, [done, next, primaryAction]);

	useEffect(() => {
		popoverContent.setDismiss(dismiss);
	}, [dismiss, popoverContent]);

	useEffect(() => {
		if (!back) {
			return;
		}

		secondaryAction.setAction(back);
	}, [back, secondaryAction]);

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
