/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { type ReactNode, useContext, useEffect, useLayoutEffect, useRef } from 'react';

import { jsx } from '@atlaskit/css';
import { Motion } from '@atlaskit/motion';
import { token } from '@atlaskit/tokens';
import { createPopoverCloseEvent, Popover } from '@atlaskit/top-layer/popover';
import { useAnchorPosition } from '@atlaskit/top-layer/use-anchor-position';
import { useSimpleLightDismiss } from '@atlaskit/top-layer/use-simple-light-dismiss';

import { SpotlightContext } from '../../controllers/context';
import type { DismissEvent } from '../../types';
import { usePositionArea } from '../../utils/use-position-area';

import { getPlacementWithOffset } from './get-placement-with-offset';
import type { PopoverContentProps } from './legacy';

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
export const PopoverContent = (props: PopoverContentProps): JSX.Element => {
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
	 *    consumers as we migrate behind the `platform-dst-top-layer-spotlight` gate.
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

	useAnchorPosition({
		anchorRef: target.ref,
		popoverRef,
		placement: getPlacementWithOffset({ placement, offset }),
		isOpen: isVisible,
	});

	useSimpleLightDismiss({
		popoverRef,
		isOpen: isVisible,
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

	const positionArea = usePositionArea(popoverRef);
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
		}
	}, [placement, card, motion]);

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
