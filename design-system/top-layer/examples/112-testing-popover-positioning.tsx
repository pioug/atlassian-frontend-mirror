/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { type ReactNode, useCallback, useRef, useState } from 'react';

import { jsx } from '@compiled/react';

import { cssMap } from '@atlaskit/css';
import { token } from '@atlaskit/tokens';
import { getAriaForTrigger } from '@atlaskit/top-layer/get-aria-for-trigger';
import { Popover } from '@atlaskit/top-layer/popover/popover';
import { useAnchoredPopover } from '@atlaskit/top-layer/use-anchored-popover';
import { usePopoverId } from '@atlaskit/top-layer/use-popover-id';

const styles = cssMap({
	center: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		height: '100vh',
	},
	content: {
		paddingBlock: token('space.200'),
		paddingInline: token('space.200'),
	},
});

/**
 * Test fixture for positioning verification.
 * Trigger is centered in the viewport so there is space in all directions.
 * Query `?axis=inline&edge=start` to change the placement at runtime.
 *
 * Also accepts `?align=start|center|end`, `?shift=<px>`,
 * `?shiftDirection=forwards|backwards` and `?forceFallback=true`, so one fixture
 * covers the `offset.crossAxisShift` geometry on both positioning paths.
 */
export default function TestingPopoverPositioning(): ReactNode {
	const params = new URLSearchParams(window.location.search);
	const axis = (params.get('axis') ?? 'block') as 'block' | 'inline';
	const edge = (params.get('edge') ?? 'end') as 'start' | 'end';
	const align = (params.get('align') ?? 'center') as 'start' | 'center' | 'end';
	const shift = Number(params.get('shift') ?? 0);
	const shiftDirection = (params.get('shiftDirection') ?? 'forwards') as 'forwards' | 'backwards';
	const shouldForceFallback = params.get('forceFallback') === 'true';

	const [isOpen, setIsOpen] = useState(false);
	const triggerRef = useRef<HTMLButtonElement>(null);
	const popoverRef = useRef<HTMLDivElement>(null);
	const popoverId = usePopoverId();
	const toggle = useCallback(() => setIsOpen((previous) => !previous), []);
	const close = useCallback(() => setIsOpen(false), []);

	useAnchoredPopover({
		anchorRef: triggerRef,
		popoverRef,
		placement: {
			axis,
			edge,
			align,
			offset: { crossAxisShift: { value: shift, direction: shiftDirection } },
		},
		forceFallbackPositioning: shouldForceFallback,
		isOpen,
	});

	return (
		<div css={styles.center}>
			<button
				ref={triggerRef}
				onClick={toggle}
				{...getAriaForTrigger({ role: 'dialog', isOpen, popoverId: popoverId })}
				type="button"
				data-testid="popover-trigger"
			>
				Open
			</button>
			<Popover
				ref={popoverRef}
				id={popoverId}
				isOpen={isOpen}
				onClose={close}
				role="dialog"
				label="Positioned popover"
			>
				<div data-testid="popover-content" css={styles.content}>
					Positioned content
				</div>
			</Popover>
		</div>
	);
}
