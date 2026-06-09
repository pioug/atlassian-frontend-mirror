/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { Fragment, type ReactNode, useCallback, useRef, useState } from 'react';

import { jsx } from '@compiled/react';

import { cssMap } from '@atlaskit/css';
import { token } from '@atlaskit/tokens';
import { getAriaForTrigger } from '@atlaskit/top-layer/get-aria-for-trigger';
import { Popover } from '@atlaskit/top-layer/popover';
import { useAnchorPosition } from '@atlaskit/top-layer/use-anchor-position';
import { usePopoverId } from '@atlaskit/top-layer/use-popover-id';

const styles = cssMap({
	wrapper: {
		display: 'flex',
		gap: token('space.200'),
	},
});

type TSiblingPopoverProps = {
	triggerTestId: string;
	contentTestId: string;
	label: string;
	triggerLabel: string;
};

function SiblingPopover({
	triggerTestId,
	contentTestId,
	label,
	triggerLabel,
}: TSiblingPopoverProps): ReactNode {
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
		<Fragment>
			<button ref={triggerRef} onClick={toggle} {...getAriaForTrigger({ role: 'dialog', isOpen, popoverId: popoverId })} type="button" data-testid={triggerTestId}>
				{triggerLabel}
			</button>
			<Popover ref={popoverRef} id={popoverId} isOpen={isOpen} onClose={close} role="dialog" label={label}>
				<div data-testid={contentTestId}>{label} content</div>
			</Popover>
		</Fragment>
	);
}

/**
 * Test fixture for popover="auto" sibling auto-close behavior.
 * WCAG 2.4.3: When a second sibling popover opens, the first should
 * auto-close. This is native popover="auto" behavior: only one
 * non-ancestor auto popover can be open at a time.
 */
export default function TestingSiblingAutoClose(): ReactNode {
	return (
		<div css={styles.wrapper}>
			<SiblingPopover
				triggerTestId="trigger-a"
				contentTestId="popover-a"
				label="Popover A"
				triggerLabel="Open A"
			/>
			<SiblingPopover
				triggerTestId="trigger-b"
				contentTestId="popover-b"
				label="Popover B"
				triggerLabel="Open B"
			/>
		</div>
	);
}
