import React, { useCallback, useRef, useState } from 'react';

import { getAriaForTrigger } from '@atlaskit/top-layer/get-aria-for-trigger';
import { Popover } from '@atlaskit/top-layer/popover';
import { useAnchorPosition } from '@atlaskit/top-layer/use-anchor-position';
import { usePopoverId } from '@atlaskit/top-layer/use-popover-id';

export default function TestingPopoverEscape(): React.ReactNode {
	const [isOpen, setIsOpen] = useState(false);
	const [closedBy, setClosedBy] = useState<string | null>(null);
	const triggerRef = useRef<HTMLButtonElement>(null);
	const popoverRef = useRef<HTMLDivElement>(null);
	const popoverId = usePopoverId();

	const toggle = useCallback(() => {
		setIsOpen((previous) => {
			if (!previous) {
				setClosedBy(null);
			}
			return !previous;
		});
	}, []);

	const close = useCallback(() => {
		setIsOpen(false);
		setClosedBy('light-dismiss');
	}, []);

	useAnchorPosition({
		anchorRef: triggerRef,
		popoverRef,
		placement: { edge: 'end' },
		isOpen,
	});

	return (
		<div>
			{closedBy && <div data-testid="close-reason">{closedBy}</div>}
			<button
				ref={triggerRef}
				type="button"
				data-testid="popover-trigger"
				onClick={toggle}
				{...getAriaForTrigger({ role: 'dialog', isOpen: isOpen, popoverId: popoverId })}
			>
				Open
			</button>
			<Popover
				ref={popoverRef}
				id={popoverId}
				role="dialog"
				label="Escape test"
				isOpen={isOpen}
				onClose={close}
			>
				<div data-testid="popover-content">Press Escape to close</div>
			</Popover>
			<button type="button" data-testid="outside-target">
				Outside
			</button>
		</div>
	);
}
