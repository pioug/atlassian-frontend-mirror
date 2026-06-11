import React, { useCallback, useRef, useState } from 'react';

import { getAriaForTrigger } from '@atlaskit/top-layer/get-aria-for-trigger';
import { Popover } from '@atlaskit/top-layer/popover';
import { useAnchorPosition } from '@atlaskit/top-layer/use-anchor-position';
import { usePopoverId } from '@atlaskit/top-layer/use-popover-id';

/**
 * Test fixture for focus restoration when trigger is removed.
 * WCAG 2.4.3 Focus Order: when the trigger element is removed from the DOM
 * after the popup closes, focus should not fall to <body>.
 */
function PopoverWithRemovableTrigger({
	onCloseCount,
	onRemove,
}: {
	onCloseCount: () => void;
	onRemove: () => void;
}): React.ReactNode {
	const [isOpen, setIsOpen] = useState(false);
	const triggerRef = useRef<HTMLButtonElement>(null);
	const popoverRef = useRef<HTMLDivElement>(null);
	const popoverId = usePopoverId();
	const toggle = useCallback(() => setIsOpen((previous) => !previous), []);
	const close = useCallback(() => {
		setIsOpen(false);
		onCloseCount();
	}, [onCloseCount]);

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
				type="button"
				data-testid="popup-trigger"
				onClick={toggle}
				{...getAriaForTrigger({ role: 'dialog', isOpen, popoverId: popoverId })}
			>
				Open popup
			</button>
			<Popover
				ref={popoverRef}
				id={popoverId}
				role="dialog"
				label="Trigger removal test"
				isOpen={isOpen}
				onClose={close}
			>
				<div data-testid="popover-content">
					<button type="button" data-testid="remove-trigger-button" onClick={onRemove}>
						Remove trigger and close
					</button>
				</div>
			</Popover>
		</>
	);
}

export default function TestingFocusReturnRef(): React.ReactNode {
	const [showTrigger, setShowTrigger] = useState(true);
	const [closeCount, setCloseCount] = useState(0);

	const handleCloseCount = useCallback(() => {
		setCloseCount((previous) => previous + 1);
	}, []);

	const handleRemove = useCallback(() => {
		setShowTrigger(false);
	}, []);

	return (
		<div>
			<div data-testid="close-count">{closeCount}</div>
			<div data-testid="trigger-visible">{showTrigger ? 'yes' : 'no'}</div>
			{showTrigger ? (
				<PopoverWithRemovableTrigger
					onCloseCount={handleCloseCount}
					onRemove={handleRemove}
				/>
			) : null}
			<button type="button" data-testid="fallback-target">
				Fallback focus target
			</button>
		</div>
	);
}
