/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { useRef, useState } from 'react';

import { jsx } from '@compiled/react';

import { cssMap } from '@atlaskit/css';
import { token } from '@atlaskit/tokens';
import { Popover } from '@atlaskit/top-layer/popover';
import { useSimpleLightDismiss } from '@atlaskit/top-layer/use-simple-light-dismiss';

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
 * Test fixture for `useSimpleLightDismiss`.
 *
 * A manual popover that uses the hook for Escape and click-outside dismiss.
 * Displays the close reason when dismissed.
 */
export default function TestingSimpleLightDismiss() {
	const [isOpen, setIsOpen] = useState(false);
	const [closeReason, setCloseReason] = useState<string | null>(null);
	const [closeCount, setCloseCount] = useState(0);
	const popoverRef = useRef<HTMLDivElement>(null);

	useSimpleLightDismiss({
		popoverRef,
		isOpen,
		onClose: ({ reason }) => {
			setCloseReason(reason);
			setCloseCount((c) => c + 1);
			setIsOpen(false);
		},
	});

	return (
		<div css={styles.wrapper}>
			<button
				type="button"
				data-testid="trigger"
				onClick={() => {
					setIsOpen(true);
					setCloseReason(null);
				}}
			>
				Open popover
			</button>
			<Popover
				ref={popoverRef}
				role="dialog"
				mode="manual"
				isOpen={isOpen}
				label="Light dismiss popover"
			>
				<div data-testid="popover-content" css={styles.content}>
					Manual popover with simple light dismiss
					<button type="button" data-testid="inner-button">
						Inner button
					</button>
				</div>
			</Popover>
			<button type="button" data-testid="outside-button">
				Outside button
			</button>
			{closeReason && <div data-testid="close-reason">{closeReason}</div>}
			<div data-testid="close-count">{closeCount}</div>
		</div>
	);
}
