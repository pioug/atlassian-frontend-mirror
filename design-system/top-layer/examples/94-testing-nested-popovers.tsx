import React, { useCallback, useRef, useState } from 'react';

import { getAriaForTrigger } from '@atlaskit/top-layer/get-aria-for-trigger';
import { Popover } from '@atlaskit/top-layer/popover';
import { useAnchorPosition } from '@atlaskit/top-layer/use-anchor-position';
import { usePopoverId } from '@atlaskit/top-layer/use-popover-id';

function SecondPopover(): React.ReactNode {
	const [isOpen, setIsOpen] = useState(false);
	const triggerRef = useRef<HTMLButtonElement>(null);
	const popoverRef = useRef<HTMLDivElement>(null);
	const popoverId = usePopoverId();
	const toggle = useCallback(() => setIsOpen((previous) => !previous), []);
	const close = useCallback(() => setIsOpen(false), []);

	useAnchorPosition({
		anchorRef: triggerRef,
		popoverRef,
		placement: { axis: 'inline', edge: 'end' },
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
			>
				<div data-testid="second-popover">Second popover</div>
			</Popover>
		</>
	);
}

export default function TestingNestedPopovers(): React.ReactNode {
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
		<div>
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
			>
				<div data-testid="first-popover">
					First popover
					<SecondPopover />
				</div>
			</Popover>
		</div>
	);
}
