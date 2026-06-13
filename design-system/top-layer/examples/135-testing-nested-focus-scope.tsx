import React, { useCallback, useRef, useState } from 'react';

import { getAriaForTrigger } from '@atlaskit/top-layer/get-aria-for-trigger';
import { Popover } from '@atlaskit/top-layer/popover';
import { useAnchorPosition } from '@atlaskit/top-layer/use-anchor-position';
import { usePopoverId } from '@atlaskit/top-layer/use-popover-id';

/**
 * Outer dialog with a nested manual-mode popover inside its content.
 * Used to verify that the outer's `getFocusables` does NOT return the
 * inner's focusables - the inner button stays in the inner scope even
 * when the inner popover is open.
 *
 * Both the outer and inner use `useToggledPopover`. The inner passes
 * `mode: 'manual'` so the hook returns a popover wiring shape without
 * `onClose` (light dismiss is disabled in manual mode).
 */
function InnerManualPopover(): React.ReactNode {
	const [isOpen, setIsOpen] = useState(false);
	const triggerRef = useRef<HTMLButtonElement>(null);
	const popoverRef = useRef<HTMLDivElement>(null);
	const popoverId = usePopoverId();
	const toggle = useCallback(() => setIsOpen((previous) => !previous), []);

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
				data-testid="inner-trigger"
				onClick={toggle}
				{...getAriaForTrigger({ role: 'dialog', isOpen, popoverId: popoverId })}
			>
				Inner trigger
			</button>
			<Popover
				ref={popoverRef}
				id={popoverId}
				role="dialog"
				label="Inner"
				mode="manual"
				isOpen={isOpen}
			>
				<div data-testid="inner-popover">
					<button type="button" data-testid="inner-button">
						Inner action
					</button>
				</div>
			</Popover>
		</>
	);
}

export default function TestingNestedFocusScope(): React.ReactNode {
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
				{...getAriaForTrigger({ role: 'dialog', isOpen, popoverId: popoverId })}
				type="button"
				data-testid="outer-trigger"
			>
				Open outer
			</button>
			<Popover
				ref={popoverRef}
				id={popoverId}
				isOpen={isOpen}
				onClose={close}
				role="dialog"
				label="Outer"
			>
				<div data-testid="outer-popover">
					<button type="button" data-testid="outer-button-a">
						Outer A
					</button>
					<InnerManualPopover />
					<button type="button" data-testid="outer-button-b">
						Outer B
					</button>
				</div>
			</Popover>
		</div>
	);
}
