import React, { useCallback, useRef, useState } from 'react';

import { getAriaForTrigger } from '@atlaskit/top-layer/get-aria-for-trigger';
import { Popover } from '@atlaskit/top-layer/popover';
import { useAnchorPosition } from '@atlaskit/top-layer/use-anchor-position';
import { usePopoverId } from '@atlaskit/top-layer/use-popover-id';

/**
 * Test fixture for tabbing through form fields inside a popup.
 * WCAG 2.1.1 Keyboard: all form fields inside a popup must be
 * reachable and operable via keyboard (Tab navigation).
 */
export default function TestingFormInPopup(): React.ReactNode {
	const [isOpen, setIsOpen] = useState(false);
	const [submitted, setSubmitted] = useState(false);
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
			<div data-testid="submitted">{submitted ? 'yes' : 'no'}</div>
			<button
				ref={triggerRef}
				type="button"
				data-testid="popup-trigger"
				onClick={toggle}
				{...getAriaForTrigger({ role: 'dialog', isOpen, popoverId: popoverId })}
			>
				Open form popup
			</button>
			<Popover
				ref={popoverRef}
				id={popoverId}
				role="dialog"
				label="Form popup"
				isOpen={isOpen}
				onClose={close}
			>
				<div data-testid="popover-content">
					<form
						onSubmit={(event) => {
							event.preventDefault();
							setSubmitted(true);
						}}
					>
						<label htmlFor="field-1">Name</label>
						<input id="field-1" type="text" data-testid="form-input-1" />
						<label htmlFor="field-select">Category</label>
						<select id="field-select" data-testid="form-select">
							<option value="a">Option A</option>
							<option value="b">Option B</option>
						</select>
						<label htmlFor="field-2">Description</label>
						<input id="field-2" type="text" data-testid="form-input-2" />
						<button type="submit" data-testid="form-submit">
							Submit
						</button>
					</form>
				</div>
			</Popover>
		</div>
	);
}
