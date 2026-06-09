import React, { useCallback, useRef, useState } from 'react';

import { getAriaForTrigger } from '@atlaskit/top-layer/get-aria-for-trigger';
import { Popover } from '@atlaskit/top-layer/popover';
import { useAnchorPosition } from '@atlaskit/top-layer/use-anchor-position';
import { usePopoverId } from '@atlaskit/top-layer/use-popover-id';

/**
 * Test fixture for verifying DOM order.
 * The popover content should be a DOM sibling of the trigger,
 * NOT rendered to the end of document.body via a portal.
 *
 * This is critical for WCAG 1.3.2 Meaningful Sequence.
 */
export default function TestingDomOrder(): React.ReactNode {
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
		<div data-testid="container">
			<div data-testid="before-content">Content before trigger</div>
			<button
				ref={triggerRef}
				type="button"
				data-testid="popover-trigger"
				onClick={toggle}
				{...getAriaForTrigger({ role: 'dialog', isOpen: isOpen, popoverId: popoverId })}
			>
				Open popover
			</button>
			<Popover
				ref={popoverRef}
				id={popoverId}
				role="dialog"
				label="DOM order test"
				isOpen={isOpen}
				onClose={close}
			>
				<div data-testid="popover-content">Popover content</div>
			</Popover>
			<div data-testid="after-content">Content after trigger</div>
		</div>
	);
}
