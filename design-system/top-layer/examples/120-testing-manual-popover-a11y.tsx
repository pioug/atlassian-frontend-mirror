/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { useCallback, useEffect, useRef, useState } from 'react';

import { jsx } from '@compiled/react';
import { bind } from 'bind-event-listener';

import { cssMap } from '@atlaskit/css';
import { token } from '@atlaskit/tokens';
import { Popover } from '@atlaskit/top-layer/popover';

const styles = cssMap({
	wrapper: {
		display: 'flex',
		flexDirection: 'column',
		gap: token('space.200'),
		paddingBlock: token('space.400'),
		paddingInline: token('space.400'),
	},
	content: {
		paddingBlock: token('space.200'),
		paddingInline: token('space.200'),
	},
});

/**
 * Test fixture for manual popover accessibility.
 *
 * Manual popovers do NOT get browser-native Escape handling or light dismiss.
 * This fixture implements Escape and click-outside handling via event listeners
 * to verify that manual popovers can still be made accessible.
 *
 * Uses `mousedown` (not `click`) for outside-click detection to avoid the race
 * condition where the trigger click immediately dismisses the popover.
 */
export default function TestingManualPopoverA11y(): JSX.Element {
	const [isOpen, setIsOpen] = useState(false);
	const [closeReason, setCloseReason] = useState<string | null>(null);
	const popoverRef = useRef<HTMLDivElement>(null);
	const triggerRef = useRef<HTMLButtonElement>(null);

	const handleClose = useCallback((reason: string) => {
		setCloseReason(reason);
		setIsOpen(false);
	}, []);

	useEffect(() => {
		if (!isOpen) {
			return;
		}

		function onKeyDown(event: KeyboardEvent) {
			if (event.key === 'Escape') {
				event.preventDefault();
				handleClose('escape');
			}
		}

		function onMouseDown(event: MouseEvent) {
			const popover = popoverRef.current;
			const trigger = triggerRef.current;
			if (
				popover &&
				!popover.contains(event.target as Node) &&
				trigger &&
				!trigger.contains(event.target as Node)
			) {
				handleClose('click-outside');
			}
		}

		const unbindKeydown = bind(document, { type: 'keydown', listener: onKeyDown });
		const unbindMousedown = bind(document, { type: 'mousedown', listener: onMouseDown });

		return () => {
			unbindKeydown();
			unbindMousedown();
		};
	}, [isOpen, handleClose]);

	return (
		<div css={styles.wrapper}>
			<button
				type="button"
				ref={triggerRef}
				data-testid="trigger"
				onClick={() => {
					setIsOpen(true);
					setCloseReason(null);
				}}
			>
				Open popover
			</button>
			<Popover ref={popoverRef} role="dialog" mode="manual" isOpen={isOpen} label="Manual popover">
				<div data-testid="popover-content" css={styles.content}>
					Manual popover content
					<button type="button" data-testid="inner-button">
						Inner button
					</button>
				</div>
			</Popover>
			<button type="button" data-testid="outside-button">
				Outside button
			</button>
			{closeReason && <div data-testid="close-reason">{closeReason}</div>}
		</div>
	);
}
