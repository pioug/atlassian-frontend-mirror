import React, { useCallback, useRef, useState } from 'react';

import { getAriaForTrigger } from '@atlaskit/top-layer/get-aria-for-trigger';
import { Popover } from '@atlaskit/top-layer/popover/popover';
import type {
	TAnchoredPlacementOptions,
	TPopoverCloseReason,
} from '@atlaskit/top-layer/popover/types';
import { useAnchoredPopover } from '@atlaskit/top-layer/use-anchored-popover';
import { usePopoverId } from '@atlaskit/top-layer/use-popover-id';

function SecondPopover({ shouldAnimate }: { shouldAnimate: boolean }): React.ReactNode {
	const [isOpen, setIsOpen] = useState(false);
	const triggerRef = useRef<HTMLButtonElement>(null);
	const popoverRef = useRef<HTMLDivElement>(null);
	const popoverId = usePopoverId();
	const toggle = useCallback(() => setIsOpen((previous) => !previous), []);
	const close = useCallback(() => setIsOpen(false), []);

	const placement: TAnchoredPlacementOptions = {
		axis: 'inline',
		edge: shouldAnimate ? 'overlap-start' : 'end',
	};
	useAnchoredPopover({
		anchorRef: triggerRef,
		popoverRef,
		placement,
		isOpen,
	});

	return (
		<>
			<button
				ref={triggerRef}
				onClick={toggle}
				{...getAriaForTrigger({ role: 'dialog', isOpen: isOpen, popoverId: popoverId })}
				type="button"
				data-testid="second-trigger"
			>
				Open second
			</button>
			<Popover
				ref={popoverRef}
				id={popoverId}
				isOpen={isOpen}
				onClose={close}
				role="dialog"
				label="Second"
				shouldAnimate={shouldAnimate}
				placement={placement}
			>
				<div data-testid="second-popover">Second popover</div>
			</Popover>
		</>
	);
}

export default function TestingNestedPopovers(): React.ReactNode {
	const shouldAnimate = new URLSearchParams(window.location.search).get('animate') === 'true';
	const [isOpen, setIsOpen] = useState(false);
	const [firstCloseReason, setFirstCloseReason] = useState<TPopoverCloseReason | null>(null);
	const triggerRef = useRef<HTMLButtonElement>(null);
	const popoverRef = useRef<HTMLDivElement>(null);
	const popoverId = usePopoverId();
	const toggle = useCallback(() => setIsOpen((previous) => !previous), []);
	const close = useCallback(({ reason }: { reason: TPopoverCloseReason }) => {
		setIsOpen(false);
		setFirstCloseReason(reason);
	}, []);

	useAnchoredPopover({
		anchorRef: triggerRef,
		popoverRef,
		placement: { edge: 'end' },
		isOpen,
	});

	return (
		<div>
			{firstCloseReason && <div data-testid="first-close-reason">{firstCloseReason}</div>}
			<button
				ref={triggerRef}
				onClick={toggle}
				{...getAriaForTrigger({ role: 'dialog', isOpen: isOpen, popoverId: popoverId })}
				type="button"
				data-testid="first-trigger"
			>
				Open first
			</button>
			<Popover
				ref={popoverRef}
				id={popoverId}
				isOpen={isOpen}
				onClose={close}
				role="dialog"
				label="First"
				shouldAnimate={shouldAnimate}
				placement={{ edge: 'end' }}
			>
				<div data-testid="first-popover">
					First popover
					<SecondPopover shouldAnimate={shouldAnimate} />
				</div>
			</Popover>
			<button type="button" data-testid="outside-target">
				Outside
			</button>
		</div>
	);
}
