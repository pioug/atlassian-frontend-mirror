/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { type ReactNode, useCallback, useRef, useState } from 'react';

import { jsx } from '@compiled/react';

import { cssMap } from '@atlaskit/css';
import { token } from '@atlaskit/tokens';
import { Dialog } from '@atlaskit/top-layer/dialog';
import { Popover } from '@atlaskit/top-layer/popover';
import { useAnchorPosition } from '@atlaskit/top-layer/use-anchor-position';
import { usePopoverId } from '@atlaskit/top-layer/use-popover-id';

/**
 * Test example for the Safari top-layer flex-collapse bug: `Popover` and `Dialog`
 * each render a flex-column card with a scrollable body.
 *
 * The fix (`height: auto`) is applied to `Popover` only, so on WebKit the popover
 * body renders full-height while the dialog body collapses to `0px` (the unfixed
 * dialog behaviour, kept as a manual repro).
 * See `notes/decisions/safari-popover-flex-collapse.md`.
 */
const styles = cssMap({
	card: {
		display: 'flex',
		flexDirection: 'column',
		width: '260px',
		borderWidth: token('border.width'),
		borderStyle: 'solid',
		borderColor: token('color.border.bold'),
		borderRadius: token('radius.small'),
		backgroundColor: token('elevation.surface.overlay'),
	},
	header: {
		paddingBlockStart: token('space.100'),
		paddingInlineEnd: token('space.100'),
		paddingBlockEnd: token('space.100'),
		paddingInlineStart: token('space.100'),
		fontWeight: token('font.weight.semibold'),
		borderBlockEndWidth: token('border.width'),
		borderBlockEndStyle: 'solid',
		borderBlockEndColor: token('color.border'),
	},
	body: {
		flexGrow: 1,
		flexShrink: 1,
		minHeight: 0,
		height: '200px',
		overflow: 'auto',
		paddingBlockStart: token('space.100'),
		paddingInlineEnd: token('space.100'),
		paddingBlockEnd: token('space.100'),
		paddingInlineStart: token('space.100'),
		// Tinted so a collapse to `0px` is obvious in the snapshot.
		backgroundColor: token('color.background.neutral'),
		borderBlockStartWidth: token('border.width'),
		borderBlockStartStyle: 'solid',
		borderBlockStartColor: token('color.border'),
	},
	row: {
		paddingBlockStart: token('space.050'),
		paddingBlockEnd: token('space.050'),
		borderBlockEndWidth: token('border.width'),
		borderBlockEndStyle: 'solid',
		borderBlockEndColor: token('color.border'),
	},
});

/**
 * Rows that overflow the scroll body so it renders a scrollbar.
 */
function ScrollableRows({ label }: { label: string }): ReactNode {
	const rows = Array.from({ length: 40 }, (_, index) => index + 1);

	return (
		<div>
			{rows.map((rowNumber) => (
				<div key={rowNumber} css={styles.row}>
					{`${label} row ${rowNumber}`}
				</div>
			))}
		</div>
	);
}

function DialogVariant(): ReactNode {
	const [isOpen, setIsOpen] = useState(false);

	const handleClose = useCallback(() => {
		setIsOpen(false);
	}, []);

	return (
		<div>
			<button type="button" data-testid="dialog-trigger" onClick={() => setIsOpen(true)}>
				Open dialog
			</button>

			<Dialog
				onClose={handleClose}
				isOpen={isOpen}
				label="Safari flex collapse dialog"
				testId="dialog"
			>
				<div css={styles.card}>
					<div css={styles.header}>Dialog header</div>
					<div css={styles.body} data-testid="dialog-scroll-body">
						<ScrollableRows label="Dialog" />
					</div>
				</div>
			</Dialog>
		</div>
	);
}

function PopoverVariant(): ReactNode {
	const [isOpen, setIsOpen] = useState(false);
	const triggerRef = useRef<HTMLButtonElement>(null);
	const popoverRef = useRef<HTMLDivElement>(null);
	const popoverId = usePopoverId();

	useAnchorPosition({
		anchorRef: triggerRef,
		popoverRef,
		placement: { edge: 'end' },
		isOpen,
	});

	return (
		<div>
			<button
				type="button"
				ref={triggerRef}
				data-testid="popover-trigger"
				onClick={() => setIsOpen(true)}
			>
				Open popover
			</button>

			<Popover
				ref={popoverRef}
				id={popoverId}
				role="dialog"
				label="Safari flex collapse popover"
				isOpen={isOpen}
				onClose={() => setIsOpen(false)}
			>
				<div css={styles.card}>
					<div css={styles.header}>Popover header</div>
					<div css={styles.body} data-testid="popover-scroll-body">
						<ScrollableRows label="Popover" />
					</div>
				</div>
			</Popover>
		</div>
	);
}

export default function TestingSafariFlexCollapse(): ReactNode {
	return (
		<div>
			<DialogVariant />
			<PopoverVariant />
		</div>
	);
}
