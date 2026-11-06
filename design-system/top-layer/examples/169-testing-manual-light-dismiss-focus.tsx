import React, { type ReactNode, useRef, useState } from 'react';

import { Popover } from '@atlaskit/top-layer/popover/popover';
import { useManualLightDismiss } from '@atlaskit/top-layer/use-manual-light-dismiss';

/**
 * Test fixture: an outside press on a manual popover with `useManualLightDismiss` does not return
 * focus, as with native light dismiss.
 *
 * - "Press without focus" cancels `mousedown`, so the press leaves focus inside the popover.
 * - "Outside input" takes focus on a press in every browser, unlike a button on macOS.
 */
export default function TestingManualLightDismissFocus(): ReactNode {
	const [isOpen, setIsOpen] = useState(false);
	const popoverRef = useRef<HTMLDivElement>(null);
	useManualLightDismiss({ popoverRef, isOpen, onClose: () => setIsOpen(false) });
	return (
		<div>
			<button type="button" data-testid="trigger" onClick={() => setIsOpen(true)}>
				Open
			</button>
			<button
				type="button"
				data-testid="press-without-focus"
				// Stands in for an element that keeps focus where it is on press.
				onMouseDown={(event) => event.preventDefault()}
			>
				Press without focus
			</button>
			<input data-testid="outside-input" aria-label="Outside input" />
			<Popover ref={popoverRef} mode="manual" isOpen={isOpen} testId="popover">
				<button type="button" data-testid="inside">
					Inside
				</button>
			</Popover>
		</div>
	);
}
