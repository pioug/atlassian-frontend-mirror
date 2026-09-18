/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { Fragment, type ReactNode, useCallback, useRef, useState } from 'react';

import { jsx } from '@compiled/react';

import { cssMap } from '@atlaskit/css';
import Heading from '@atlaskit/heading/heading';
import { token } from '@atlaskit/tokens';
import { Dialog } from '@atlaskit/top-layer/dialog-content';
import { getAriaForTrigger } from '@atlaskit/top-layer/get-aria-for-trigger';
import { PopoverSurface } from '@atlaskit/top-layer/popover-surface';
import { Popover } from '@atlaskit/top-layer/popover/popover';
import { type TPopoverCloseReason } from '@atlaskit/top-layer/popover/types';
import { useAnchoredPopover } from '@atlaskit/top-layer/use-anchored-popover';
import { usePopoverId } from '@atlaskit/top-layer/use-popover-id';

import {
	DraggableCard,
	DragStateReadout,
	DropTarget,
} from '../examples-utils/drag-and-drop-fixture';

// The trigger stretches to the dialog's content width, so its inline end sits
// one content padding (`space.200`) in from the dialog surface edge. A larger
// gap is what puts the popover surface fully outside the dialog box, clear of
// the dialog's own drop target.
const POPOVER_GAP = token('space.400', '32px');

const styles = cssMap({
	// Pinned to the viewport so the readouts stay clear of the centred dialog and
	// of the popover that opens to the dialog's inline end.
	page: {
		position: 'fixed',
		insetBlockStart: token('space.200'),
		insetInlineStart: token('space.200'),
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'flex-start',
		gap: token('space.150'),
		width: '220px',
	},
	readout: {
		color: token('color.text'),
		font: token('font.body.small'),
	},
	dialogSurface: {
		display: 'flex',
		flexDirection: 'column',
		gap: token('space.150'),
		width: '420px',
		paddingBlock: token('space.200'),
		paddingInline: token('space.200'),
		backgroundColor: token('elevation.surface.overlay'),
		borderRadius: token('radius.large', '8px'),
		boxShadow: token('elevation.shadow.overlay'),
	},
	// `alignItems` stays at `stretch` so the trigger spans the content width,
	// which is what `POPOVER_GAP` relies on.
	popoverContent: {
		display: 'flex',
		flexDirection: 'column',
		gap: token('space.100'),
		paddingBlock: token('space.150'),
		paddingInline: token('space.150'),
		width: '200px',
	},
	closeRow: {
		display: 'flex',
		justifyContent: 'flex-end',
	},
});

const dialogTitleId = 'dialog-drag-and-drop-title';

/**
 * Browser test fixture for Pragmatic drag and drop inside a top-layer `Dialog`
 * (a native modal `<dialog>`), and across the boundary between that dialog and
 * a `Popover` opened from inside it.
 *
 * The popover surface is anchored outside the dialog box (see `POPOVER_GAP`) so
 * it cannot cover the dialog's drop target. It is reachable out there only
 * because a popover is promoted into the top layer above the dialog: ordinary
 * content outside the dialog box is behind the backdrop and cannot be dragged
 * onto.
 *
 * The readouts are rendered in the top document so they survive a dismiss of
 * either surface.
 */
export default function TestingDialogDragAndDrop(): ReactNode {
	const [isOpen, setIsOpen] = useState(false);
	const [isPopoverOpen, setIsPopoverOpen] = useState(false);

	const popoverTriggerRef = useRef<HTMLButtonElement>(null);
	const popoverRef = useRef<HTMLDivElement>(null);
	const popoverId = usePopoverId();

	useAnchoredPopover({
		anchorRef: popoverTriggerRef,
		popoverRef,
		placement: {
			axis: 'inline',
			edge: 'end',
			align: 'start',
			offset: { gap: POPOVER_GAP },
		},
		isOpen: isPopoverOpen,
	});

	// The popover is rendered inside the dialog, so it goes away with it.
	const closeDialog = useCallback(() => {
		setIsOpen(false);
		setIsPopoverOpen(false);
	}, []);

	const togglePopover = useCallback(() => setIsPopoverOpen((previous) => !previous), []);

	const closePopover = useCallback(
		(_args: { reason: TPopoverCloseReason }) => setIsPopoverOpen(false),
		[],
	);

	return (
		<Fragment>
			<div css={styles.page}>
				<Heading size="small" as="h1">
					Dialog drag and drop
				</Heading>

				<button type="button" data-testid="dialog-trigger" onClick={() => setIsOpen(true)}>
					Open dialog
				</button>

				<div css={styles.readout}>
					dialog isOpen: <span data-testid="dialog-open-state">{String(isOpen)}</span>
				</div>

				<div css={styles.readout}>
					popover isOpen: <span data-testid="popover-open-state">{String(isPopoverOpen)}</span>
				</div>

				<DragStateReadout />
			</div>

			<Dialog isOpen={isOpen} onClose={closeDialog} labelledBy={dialogTitleId} testId="dialog">
				<div css={styles.dialogSurface}>
					<Heading size="xsmall" as="h2" id={dialogTitleId}>
						Drag and drop inside a dialog
					</Heading>

					<DraggableCard dragId="dialog" label="Dialog card (drag me)" testId="dialog-card" />

					<DropTarget label="Dialog drop target" testId="dialog-drop-target" />

					<button
						ref={popoverTriggerRef}
						onClick={togglePopover}
						{...getAriaForTrigger({ role: 'dialog', isOpen: isPopoverOpen, popoverId })}
						type="button"
						data-testid="popover-trigger"
					>
						{isPopoverOpen ? 'Close popover' : 'Open popover'}
					</button>

					<Popover
						ref={popoverRef}
						id={popoverId}
						isOpen={isPopoverOpen}
						onClose={closePopover}
						mode="auto"
						role="dialog"
						label="Drag and drop inside a popover in a dialog"
						testId="popover"
					>
						<PopoverSurface>
							<div css={styles.popoverContent} data-testid="popover-content">
								<div>Popover content</div>
								<DraggableCard
									dragId="popover"
									label="Popover card (drag me)"
									testId="popover-card"
								/>
								<DropTarget label="Popover drop target" testId="popover-drop-target" />
							</div>
						</PopoverSurface>
					</Popover>

					<div css={styles.closeRow}>
						<button type="button" data-testid="dialog-close" onClick={closeDialog}>
							Close
						</button>
					</div>
				</div>
			</Dialog>
		</Fragment>
	);
}
