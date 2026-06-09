import React, { useCallback, useRef, useState } from 'react';

import { getAriaForTrigger } from '@atlaskit/top-layer/get-aria-for-trigger';
import { Popover } from '@atlaskit/top-layer/popover';
import { useAnchorPosition } from '@atlaskit/top-layer/use-anchor-position';
import { usePopoverId } from '@atlaskit/top-layer/use-popover-id';

/**
 * Test fixture for WCAG 3.2.1 On Focus:
 * When the popover is dismissed and focus returns to the trigger,
 * the popover must NOT re-open. This verifies that focus-return
 * does not trigger a context change.
 */
export default function TestingFocusReturnNoReopen(): React.ReactNode {
	const [isOpen, setIsOpen] = useState(false);
	const [openCount, setOpenCount] = useState(0);
	const [closeCount, setCloseCount] = useState(0);
	const triggerRef = useRef<HTMLButtonElement>(null);
	const popoverRef = useRef<HTMLDivElement>(null);
	const popoverId = usePopoverId();
	const toggle = useCallback(() => setIsOpen((previous) => !previous), []);
	const close = useCallback(() => {
		setIsOpen(false);
		setCloseCount((previous) => previous + 1);
	}, []);

	useAnchorPosition({
		anchorRef: triggerRef,
		popoverRef,
		placement: { edge: 'end' },
	});

	return (
		<div>
			<div data-testid="open-count">{openCount}</div>
			<div data-testid="close-count">{closeCount}</div>
			<button
				ref={triggerRef}
				type="button"
				data-testid="popover-trigger"
				onClick={toggle}
				onFocus={() => setOpenCount((previous) => previous + 1)}
				{...getAriaForTrigger({ role: 'dialog', isOpen: isOpen, popoverId: popoverId })}
			>
				Open
			</button>
			<Popover
				ref={popoverRef}
				id={popoverId}
				role="dialog"
				label="Focus return test"
				isOpen={isOpen}
				onClose={close}
			>
				<div data-testid="popover-content">
					<button type="button" data-testid="inner-button">
						Inner button
					</button>
				</div>
			</Popover>
		</div>
	);
}
