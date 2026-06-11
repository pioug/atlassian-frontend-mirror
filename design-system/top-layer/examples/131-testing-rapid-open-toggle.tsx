import React, { useCallback, useRef, useState } from 'react';

import { getAriaForTrigger } from '@atlaskit/top-layer/get-aria-for-trigger';
import { Popover } from '@atlaskit/top-layer/popover';
import { useAnchorPosition } from '@atlaskit/top-layer/use-anchor-position';
import { usePopoverId } from '@atlaskit/top-layer/use-popover-id';

/**
 * Controlled-`isOpen` popover with an external rapid-toggle button. Drives
 * a rapid `open -> close -> open` sequence inside a single frame to
 * exercise the RAF cancel + element-identity guard in `useInitialFocus`.
 */
export default function TestingRapidOpenToggle(): React.ReactNode {
	const [seq, setSeq] = useState(0);
	const [isOpen, setIsOpen] = useState(false);
	const triggerRef = useRef<HTMLButtonElement>(null);
	const popoverRef = useRef<HTMLDivElement>(null);
	const popoverId = usePopoverId();
	const toggle = useCallback(() => setIsOpen((previous) => !previous), []);
	const close = useCallback(() => setIsOpen(false), []);

	useAnchorPosition({
		anchorRef: triggerRef,
		popoverRef,
		placement: { edge: 'end' },
		isOpen,
	});

	function rapidToggle() {
		// Fire three state updates in a row - React batches them into a
		// single render, but if any of them missed the cancel, the queued
		// RAF from the first open would focus the wrong popover instance.
		setSeq((previous) => previous + 1);
		setSeq((previous) => previous + 1);
		setSeq((previous) => previous + 1);
		toggle();
	}

	return (
		<div>
			<button type="button" data-testid="rapid-toggle" onClick={rapidToggle}>
				Rapid toggle
			</button>
			<button ref={triggerRef} onClick={toggle} {...getAriaForTrigger({ role: 'dialog', isOpen, popoverId: popoverId })} type="button" data-testid="popover-trigger">
				Open popover
			</button>
			<Popover ref={popoverRef} id={popoverId} isOpen={isOpen} onClose={close} role="dialog" label={`Rapid toggle ${seq}`}>
				<div data-testid="popover-content">
					<button type="button" data-testid="popover-button">
						Inner action
					</button>
				</div>
			</Popover>
			<button type="button" data-testid="outside-button">
				Outside
			</button>
		</div>
	);
}
