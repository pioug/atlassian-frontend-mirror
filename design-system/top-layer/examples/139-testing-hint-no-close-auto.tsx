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
		paddingBlock: token('space.800'),
		paddingInline: token('space.800'),
		display: 'flex',
		flexDirection: 'column',
		gap: token('space.200'),
	},
	popoverContent: {
		paddingBlock: token('space.200'),
		paddingInline: token('space.200'),
	},
	hintContent: {
		paddingBlock: token('space.100'),
		paddingInline: token('space.100'),
	},
});

// Hint (tooltip) trigger - click-controlled for test predictability.
// In production, tooltips typically use onMouseEnter/onFocus, but tests
// rely on click to avoid hover/focus timing issues. Wiring onMouseLeave/onBlur
// here would close the hint as Playwright moves the pointer away after a
// click(), masking the actual mode="hint" vs mode="auto" stacking behaviour
// this fixture is designed to exercise.
function HintPopover(): ReactNode {
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
		<Fragment>
			<button
				ref={triggerRef}
				type="button"
				data-testid="hint-trigger"
				aria-describedby={popoverId}
				onClick={toggle}
			>
				Hover for hint
			</button>
			<Popover
				ref={popoverRef}
				id={popoverId}
				role="tooltip"
				label="Hint tooltip"
				mode="hint"
				isOpen={isOpen}
			>
				<div data-testid="hint-popover" css={styles.hintContent}>
					Hint tooltip content
				</div>
			</Popover>
		</Fragment>
	);
}

/**
 * Test fixture for mode="hint" not closing mode="auto" popovers.
 * A hint popover (tooltip) should be able to appear without
 * closing an already-open auto popover.
 *
 * Layout: An auto popover with a hint trigger inside it.
 * The hint opens on hover without closing the auto popover.
 */
export default function TestingHintNoCloseAuto(): ReactNode {
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
		<div css={styles.wrapper}>
			<button ref={triggerRef} onClick={toggle} {...getAriaForTrigger({ role: 'dialog', isOpen, popoverId: popoverId })} type="button" data-testid="auto-trigger">
				Toggle auto popover
			</button>
			<Popover ref={popoverRef} id={popoverId} isOpen={isOpen} onClose={close} role="dialog" label="Auto popover">
				<div data-testid="auto-popover" css={styles.popoverContent}>
					Auto popover content
					<HintPopover />
				</div>
			</Popover>
		</div>
	);
}
