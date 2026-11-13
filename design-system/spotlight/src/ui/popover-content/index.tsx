/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { type ReactNode, useContext, useEffect, useLayoutEffect, useRef, useState } from 'react';

import { jsx } from '@atlaskit/css';
import Motion from '@atlaskit/motion/entering/motion';
import { fg } from '@atlaskit/platform-feature-flags/fg';
import { token } from '@atlaskit/tokens';
import { createPopoverCloseEvent } from '@atlaskit/top-layer/popover/create-close-event';
import { Popover } from '@atlaskit/top-layer/popover/popover';
import { useAnchoredPopover } from '@atlaskit/top-layer/use-anchored-popover';
import { useManualLightDismiss } from '@atlaskit/top-layer/use-manual-light-dismiss';

import { SpotlightContext } from '../../controllers/context';
import type { BackEvent, DismissEvent, DoneEvent, NextEvent, Placement } from '../../types';
import { usePositionArea } from '../../utils/use-position-area';
import { getPlacementWithOffset } from './get-placement-with-offset';
type Offset = [number | null | undefined, number | null | undefined];
type Strategy = 'absolute' | 'fixed';

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
	 *
	 */
	offset?: Offset;

	/**
	 * @deprecated Has no effect. Popovers use top-layer positioning.
	 */
	strategy?: Strategy;

	/**
	 * The content to be rendered in `PopoverContent`. This is intended to be a `SpotlightCard`.
	 *
	 * Pass ONE element. It is rendered into a flex-row
	 * host so the viewport cap can reach it, and a fragment's children would become
	 * side-by-side flex items. See `children` on `Popover` in `@atlaskit/top-layer`.
	 */
	children: ReactNode;

	/**
	 * The motion to be applied to the `SpotlightCard`.
	 */
	motion?: React.ComponentType<{ children: ReactNode }> | null;
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

const noopUpdate = () => Promise.resolve();

const DefaultMotion: PopoverContentProps['motion'] = ({ children }: { children: ReactNode }) => (
	<Motion
		enteringAnimation={token('motion.spotlight.enter')}
		exitingAnimation={token('motion.spotlight.exit')}
	>
		{children}
	</Motion>
);

/**
 * __PopoverContent__
 *
 * A `PopoverContent` is the element that is shown as a popover.
 */
export const PopoverContent = (props: PopoverContentProps): JSX.Element | null => {
	/**
	 * This composes the low-level `@atlaskit/top-layer` `Popover` primitive directly
	 * (rather than `@atlaskit/popup` or a higher-level wrapper) for two reasons:
	 *
	 * 1. Spotlight has bespoke positioning, dismiss, and motion requirements that
	 *    are coupled to the surrounding `SpotlightContext` (heading id, card
	 *    placement, primary/secondary actions, etc.). Building on the primitive
	 *    keeps that wiring local to spotlight without leaking into a shared popup.
	 * 2. Spotlight's public API exposes a `dismiss(event)` callback that takes a
	 *    `KeyboardEvent` / `MouseEvent`, while the top-layer primitive surfaces a
	 *    structured `{ reason }`. Bridging that contract here (via
	 *    `createPopoverCloseEvent`) preserves backwards compatibility for existing
	 *    consumers.
	 */
	const {
		children,
		placement,
		motion = DefaultMotion,
		isVisible = true,
		shouldDismissOnClickOutside = true,
		dismiss,
		back,
		testId,
		offset,
	} = props;

	const done = 'done' in props ? props.done : undefined;
	const next = 'next' in props ? props.next : undefined;
	const popoverRef = useRef<HTMLDivElement | null>(null);
	const { heading, popoverContent, card, primaryAction, secondaryAction, target } =
		useContext(SpotlightContext);

	// Tracks the motion that has been committed to the card. This is kept locally rather than read back
	// from `card.motion` so that `PopoverContent` still renders when it is used without a
	// `SpotlightContextProvider` (where `card.setMotion` is a no-op and `card.motion` never updates).
	const [committedMotion, setCommittedMotion] = useState<PopoverContentProps['motion']>();

	const isReady =
		!fg('platform-dst-motion-uplift-spotlight') || !motion || committedMotion === motion;
	const isOpen = isVisible && isReady;

	useAnchoredPopover({
		anchorRef: target.ref,
		popoverRef,
		placement: getPlacementWithOffset({ placement, offset }),
		isOpen,
	});

	useManualLightDismiss({
		popoverRef,
		isOpen,
		onClose: ({ reason }) => {
			if (reason === 'light-dismiss' && !shouldDismissOnClickOutside) {
				return;
			}

			// `createPopoverCloseEvent` is typed as `KeyboardEvent | MouseEvent | Event`
			// for forward-compatibility, but only `escape` / `light-dismiss` are
			// possible here, so the result is always a Keyboard/MouseEvent.
			dismiss(createPopoverCloseEvent({ reason }) as DismissEvent);
		},
	});

	useEffect(() => {
		popoverContent.setRef(popoverRef);
		popoverContent.setUpdate(() => noopUpdate);
	}, [popoverContent]);

	const positionArea = usePositionArea(popoverRef, isOpen);
	useEffect(() => {
		popoverContent.setPositionArea(positionArea);
	}, [popoverContent, positionArea]);

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

	useLayoutEffect(() => {
		card.setPlacement(placement);
		if (motion) {
			card.setMotion(() => motion);
			setCommittedMotion(() => motion);
		}
	}, [placement, card, motion]);

	// Mount the motion wrapper before opening. Adding it afterwards remounts the card
	// and removes the control that just received the dialog's initial focus.
	if (!isReady) {
		return null;
	}

	return (
		<Popover
			ref={popoverRef}
			isOpen={isVisible}
			mode="manual"
			role="dialog"
			labelledBy={heading.id}
			testId={testId}
		>
			{children}
		</Popover>
	);
};
