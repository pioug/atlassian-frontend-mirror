import React, { useCallback, useRef, useState } from 'react';

import { Dialog } from '@atlaskit/top-layer/dialog';
import { getAriaForTrigger } from '@atlaskit/top-layer/get-aria-for-trigger';
import { Popover } from '@atlaskit/top-layer/popover';
import { useAnchorPosition } from '@atlaskit/top-layer/use-anchor-position';
import { usePopoverId } from '@atlaskit/top-layer/use-popover-id';

function PopoverInDialog(): React.ReactNode {
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

	return (
		<>
			<button
				ref={triggerRef}
				onClick={toggle}
				{...getAriaForTrigger({ role: 'menu', isOpen: isOpen, popoverId: popoverId })}
				type="button"
				data-testid="popover-trigger"
			>
				Open popover
			</button>
			<Popover
				ref={popoverRef}
				id={popoverId}
				isOpen={isOpen}
				onClose={close}
				role="menu"
				label="Actions"
			>
				<div data-testid="popover-content">
					<button type="button" role="menuitem">
						Action one
					</button>
					<button type="button" role="menuitem">
						Action two
					</button>
				</div>
			</Popover>
		</>
	);
}

export default function TestingPopoverInDialog(): React.ReactNode {
	const [isOpen, setIsOpen] = useState(false);

	const handleClose = useCallback(() => {
		setIsOpen(false);
	}, []);

	return (
		<div>
			<button type="button" data-testid="dialog-trigger" onClick={() => setIsOpen(true)}>
				Open dialog
			</button>
			<Dialog onClose={handleClose} isOpen={isOpen} label="Dialog with popover" testId="dialog">
				<button type="button" aria-label="Close" onClick={() => setIsOpen(false)}>
					&#x2715;
				</button>
				<PopoverInDialog />
			</Dialog>
		</div>
	);
}
