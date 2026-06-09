import React, { useCallback, useRef, useState } from 'react';

import { getAriaForTrigger } from '@atlaskit/top-layer/get-aria-for-trigger';
import { Popover } from '@atlaskit/top-layer/popover';
import { useAnchorPosition } from '@atlaskit/top-layer/use-anchor-position';
import { usePopoverId } from '@atlaskit/top-layer/use-popover-id';

export default function TestingKeyboardMouseInterleaving(): React.ReactNode {
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
	});

	return (
		<div>
			<div data-testid="status">{isOpen ? 'open' : 'closed'}</div>
			<button
				ref={triggerRef}
				type="button"
				data-testid="trigger"
				onClick={toggle}
				{...getAriaForTrigger({ role: 'dialog', isOpen, popoverId: popoverId })}
			>
				Toggle popover
			</button>
			<Popover
				ref={popoverRef}
				id={popoverId}
				role="dialog"
				label="Interleaving test"
				isOpen={isOpen}
				onClose={close}
			>
				<div data-testid="popover-content">
					<button type="button" data-testid="inner-button">
						Inner action
					</button>
				</div>
			</Popover>
		</div>
	);
}
