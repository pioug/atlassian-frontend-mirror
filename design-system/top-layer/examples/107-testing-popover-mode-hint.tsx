import React, { useCallback, useRef, useState } from 'react';

import { getAriaForTrigger } from '@atlaskit/top-layer/get-aria-for-trigger';
import { Popover } from '@atlaskit/top-layer/popover';
import { useAnchorPosition } from '@atlaskit/top-layer/use-anchor-position';
import { usePopoverId } from '@atlaskit/top-layer/use-popover-id';

/**
 * Example for browser tests: Popover with mode="hint".
 * In browsers that do not support popover="hint" (e.g. Safari), the component
 * falls back to popover="auto". The test asserts that fallback in webkit.
 */
export default function TestingPopoverModeHint(): React.ReactNode {
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
		<>
			<button
				ref={triggerRef}
				type="button"
				data-testid="popover-trigger"
				onClick={toggle}
				{...getAriaForTrigger({ role: 'dialog', isOpen, popoverId: popoverId })}
			>
				Open
			</button>
			<Popover
				ref={popoverRef}
				id={popoverId}
				role="dialog"
				label="Test popover"
				mode="hint"
				isOpen={isOpen}
				onClose={close}
			>
				<div data-testid="popover-content">Popover content (mode=hint)</div>
			</Popover>
		</>
	);
}
