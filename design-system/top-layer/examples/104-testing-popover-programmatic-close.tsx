import React, { useCallback, useRef, useState } from 'react';

import { getAriaForTrigger } from '@atlaskit/top-layer/get-aria-for-trigger';
import { Popover } from '@atlaskit/top-layer/popover';
import { useAnchorPosition } from '@atlaskit/top-layer/use-anchor-position';
import { usePopoverId } from '@atlaskit/top-layer/use-popover-id';

/**
 * Test fixture for programmatic popover close via `hidePopover()`.
 */
export default function TestingPopoverProgrammaticClose(): React.ReactNode {
	const [isOpen, setIsOpen] = useState(false);
	const [closed, setClosed] = useState(false);
	const triggerRef = useRef<HTMLButtonElement>(null);
	const popoverRef = useRef<HTMLDivElement>(null);
	const popoverId = usePopoverId();
	const toggle = useCallback(() => setIsOpen((previous) => !previous), []);
	const close = useCallback(() => {
		setIsOpen(false);
		setClosed(true);
	}, []);

	useAnchorPosition({
		anchorRef: triggerRef,
		popoverRef,
		placement: { edge: 'end' },
		isOpen,
	});

	const handleProgrammaticClose = useCallback(() => {
		popoverRef.current?.hidePopover();
	}, [popoverRef]);

	return (
		<div>
			{closed && <div data-testid="close-indicator">closed</div>}
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
				label="Programmatic close test"
				isOpen={isOpen}
				onClose={close}
			>
				<div data-testid="popover-content">
					<button
						type="button"
						data-testid="programmatic-close-button"
						onClick={handleProgrammaticClose}
					>
						Close programmatically
					</button>
				</div>
			</Popover>
		</div>
	);
}
