/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { type ReactNode, useCallback, useRef, useState } from 'react';

import { jsx } from '@compiled/react';

import { cssMap } from '@atlaskit/css';
import { Text } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';
import { slideAndFade } from '@atlaskit/top-layer/animations';
import { getAriaForTrigger } from '@atlaskit/top-layer/get-aria-for-trigger';
import { Popover } from '@atlaskit/top-layer/popover';
import { PopoverSurface } from '@atlaskit/top-layer/popover-surface';
import { useAnchorPosition } from '@atlaskit/top-layer/use-anchor-position';
import { usePopoverId } from '@atlaskit/top-layer/use-popover-id';

const animation = slideAndFade();

const styles = cssMap({
	wrapper: {
		paddingBlock: token('space.800'),
		paddingInline: token('space.800'),
	},
	content: {
		paddingBlock: token('space.200'),
		paddingInline: token('space.200'),
	},
	counts: {
		display: 'flex',
		gap: token('space.200'),
		marginBlockEnd: token('space.200'),
	},
});

/**
 * Test fixture for animation callback lifecycle.
 * Exposes `onEnterFinish` and `onExitFinish` call counts via data attributes
 * so Playwright tests can assert that callbacks fire at the right point in the
 * animation lifecycle - after real CSS `transitionend` events in a real browser.
 */
export default function TestingAnimationCallbacks(): ReactNode {
	const [enterCount, setEnterCount] = useState(0);
	const [exitCount, setExitCount] = useState(0);

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

	const handleEnterFinish = useCallback(() => {
		setEnterCount((previous) => previous + 1);
	}, []);

	const handleExitFinish = useCallback(() => {
		setExitCount((previous) => previous + 1);
	}, []);

	return (
		<div css={styles.wrapper}>
			<div css={styles.counts}>
				<Text>
					Enter count: <span data-testid="enter-count">{enterCount}</span>
				</Text>
				<Text>
					Exit count: <span data-testid="exit-count">{exitCount}</span>
				</Text>
			</div>
			<button
				ref={triggerRef}
				onClick={toggle}
				{...getAriaForTrigger({ role: 'dialog', isOpen, popoverId: popoverId })}
				type="button"
				data-testid="popover-trigger"
			>
				Toggle
			</button>
			<Popover
				ref={popoverRef}
				id={popoverId}
				isOpen={isOpen}
				onClose={close}
				role="dialog"
				label="Animation callback test"
				animate={animation}
				placement={{ edge: 'end' }}
				onEnterFinish={handleEnterFinish}
				onExitFinish={handleExitFinish}
			>
				<PopoverSurface>
					<div data-testid="popover-content" css={styles.content}>
						Animated content
					</div>
				</PopoverSurface>
			</Popover>
		</div>
	);
}
