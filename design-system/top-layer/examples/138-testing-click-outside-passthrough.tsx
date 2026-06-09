import React, { useCallback, useRef, useState } from 'react';

import { getAriaForTrigger } from '@atlaskit/top-layer/get-aria-for-trigger';
import { Popover } from '@atlaskit/top-layer/popover';
import { useAnchorPosition } from '@atlaskit/top-layer/use-anchor-position';
import { usePopoverId } from '@atlaskit/top-layer/use-popover-id';

export default function TestingClickOutsidePassthrough(): React.ReactNode {
	const [closeCount, setCloseCount] = useState(0);
	const [outsideClickCount, setOutsideClickCount] = useState(0);

	const [isOpen, setIsOpen] = useState(false);
	const triggerRef = useRef<HTMLButtonElement>(null);
	const popoverRef = useRef<HTMLDivElement>(null);
	const popoverId = usePopoverId();
	const toggle = useCallback(() => setIsOpen((previous) => !previous), []);
	const close = useCallback(() => {
		setIsOpen(false);
		setCloseCount((previous) => previous + 1);
	}, []);

	useAnchorPosition({
		anchorRef: triggerRef,
		popoverRef,
		placement: { edge: 'end' },
	});

	return (
		<div>
			<div data-testid="close-count">{closeCount}</div>
			<div data-testid="outside-click-count">{outsideClickCount}</div>
			<button ref={triggerRef} onClick={toggle} {...getAriaForTrigger({ role: 'dialog', isOpen, popoverId: popoverId })} type="button" data-testid="popover-trigger">
				Open
			</button>
			<Popover ref={popoverRef} id={popoverId} isOpen={isOpen} onClose={close} role="dialog" label="Click passthrough test">
				<div data-testid="popover-content">Popover content</div>
			</Popover>
			<button
				type="button"
				data-testid="outside-button"
				onClick={() => setOutsideClickCount((previous) => previous + 1)}
			>
				Outside button
			</button>
		</div>
	);
}
