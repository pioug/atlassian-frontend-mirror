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
import { type TPopoverCloseReason } from '@atlaskit/top-layer/popover/types';
import { PopoverSurface } from '@atlaskit/top-layer/popover-surface';
import { useAnchoredPopover } from '@atlaskit/top-layer/use-anchored-popover';
import { usePopoverId } from '@atlaskit/top-layer/use-popover-id';

import {
	DraggableCard,
	DragStateReadout,
	DropTarget,
} from '../examples-utils/drag-and-drop-fixture';

// The nested trigger stretches to the parent popover's content width, so its
// inline end sits one content padding (`space.150`) in from the parent surface
// edge. A larger gap is what puts the nested surface clear of the parent.
const NESTED_POPOVER_GAP = token('space.300', '24px');

const styles = cssMap({
	page: {
		display: 'flex',
		flexDirection: 'column',
		gap: token('space.300'),
		paddingBlock: token('space.200'),
		paddingInline: token('space.200'),
	},
	readouts: {
		display: 'flex',
		flexDirection: 'column',
		gap: token('space.050'),
	},
	columns: {
		display: 'flex',
		alignItems: 'flex-start',
		gap: token('space.400'),
	},
	// `minWidth` reserves the band both popover surfaces land in (2 x 244px plus
	// the gap between them). Without it a popover would be painted over the
	// outside column, and "the popover stayed open" would prove nothing.
	popoverColumn: {
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'flex-start',
		gap: token('space.150'),
		minWidth: '560px',
		flexShrink: 0,
	},
	outsideColumn: {
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'flex-start',
		gap: token('space.150'),
		flexShrink: 0,
	},
	columnHeading: {
		color: token('color.text.subtle'),
		font: token('font.heading.xsmall'),
	},
	readout: {
		color: token('color.text.subtle'),
		font: token('font.body.small'),
	},
	// Fixed width so each surface occupies the same band in every engine.
	// `alignItems` stays at `stretch` so the nested trigger spans the content
	// width, which is what `NESTED_POPOVER_GAP` relies on.
	popoverContent: {
		display: 'flex',
		flexDirection: 'column',
		gap: token('space.100'),
		paddingBlock: token('space.150'),
		paddingInline: token('space.150'),
		width: '220px',
	},
	// Deliberately not a drop target, so a drag can be released over nothing.
	emptySpace: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		width: '160px',
		height: '90px',
		borderRadius: token('radius.small', '3px'),
		borderWidth: token('border.width'),
		borderStyle: 'solid',
		borderColor: token('color.border.disabled'),
		color: token('color.text.subtlest'),
		font: token('font.body.small'),
		textAlign: 'center',
	},
});

/**
 * Browser test fixture for whether a Pragmatic drag and drop operation light
 * dismisses a `mode="auto"` Popover.
 *
 * There is a draggable card and a drop target inside the popover, inside a
 * nested popover, and in the top document, so a drag can start and end in any
 * combination of the three.
 *
 * The parent surface, the nested surface and the outside column occupy three
 * non-overlapping regions. See `styles.popoverColumn` and
 * `NESTED_POPOVER_GAP`.
 *
 * The readouts are rendered in the top document so they survive a dismiss of
 * either popover.
 */
export default function TestingPopoverDragAndDrop(): ReactNode {
	const [isOpen, setIsOpen] = useState(false);
	const [isNestedOpen, setIsNestedOpen] = useState(false);

	const triggerRef = useRef<HTMLButtonElement>(null);
	const popoverRef = useRef<HTMLDivElement>(null);
	const popoverId = usePopoverId();

	const nestedTriggerRef = useRef<HTMLButtonElement>(null);
	const nestedPopoverRef = useRef<HTMLDivElement>(null);
	const nestedPopoverId = usePopoverId();

	useAnchoredPopover({
		anchorRef: triggerRef,
		popoverRef,
		placement: { axis: 'block', edge: 'end', align: 'start' },
		isOpen,
	});

	useAnchoredPopover({
		anchorRef: nestedTriggerRef,
		popoverRef: nestedPopoverRef,
		placement: {
			axis: 'inline',
			edge: 'end',
			align: 'start',
			offset: { gap: NESTED_POPOVER_GAP },
		},
		isOpen: isNestedOpen,
	});

	const toggle = useCallback(() => setIsOpen((previous) => !previous), []);

	// The nested popover is rendered inside the parent, so it goes away with it.
	const close = useCallback((_args: { reason: TPopoverCloseReason }) => {
		setIsOpen(false);
		setIsNestedOpen(false);
	}, []);

	const toggleNested = useCallback(() => setIsNestedOpen((previous) => !previous), []);

	const closeNested = useCallback(
		(_args: { reason: TPopoverCloseReason }) => setIsNestedOpen(false),
		[],
	);

	return (
		<div css={styles.page}>
			<div css={styles.readouts}>
				<DragStateReadout />
				<div css={styles.readout}>
					popover isOpen: <span data-testid="popover-open-state">{String(isOpen)}</span>
				</div>
				<div css={styles.readout}>
					nested popover isOpen:{' '}
					<span data-testid="nested-popover-open-state">{String(isNestedOpen)}</span>
				</div>
			</div>

			<div css={styles.columns}>
				<div css={styles.popoverColumn}>
					<div css={styles.columnHeading}>Popover (mode=&quot;auto&quot;)</div>
					<button
						ref={triggerRef}
						onClick={toggle}
						{...getAriaForTrigger({ role: 'dialog', isOpen, popoverId })}
						type="button"
						data-testid="popover-trigger"
					>
						{isOpen ? 'Close popover' : 'Open popover'}
					</button>

					<Popover
						ref={popoverRef}
						id={popoverId}
						isOpen={isOpen}
						onClose={close}
						mode="auto"
						role="dialog"
						label="Drag and drop inside a popover"
						testId="popover"
					>
						<PopoverSurface>
							<div css={styles.popoverContent} data-testid="popover-content">
								<div>Popover content</div>
								<DraggableCard dragId="inside" label="Inside card (drag me)" testId="inside-card" />
								<DropTarget label="Inside drop target" testId="inside-drop-target" />
								<button
									ref={nestedTriggerRef}
									onClick={toggleNested}
									{...getAriaForTrigger({
										role: 'dialog',
										isOpen: isNestedOpen,
										popoverId: nestedPopoverId,
									})}
									type="button"
									data-testid="nested-popover-trigger"
								>
									{isNestedOpen ? 'Close nested' : 'Open nested'}
								</button>

								<Popover
									ref={nestedPopoverRef}
									id={nestedPopoverId}
									isOpen={isNestedOpen}
									onClose={closeNested}
									mode="auto"
									role="dialog"
									label="Drag and drop inside a nested popover"
									testId="nested-popover"
								>
									<PopoverSurface>
										<div css={styles.popoverContent} data-testid="nested-popover-content">
											<div>Nested popover content</div>
											<DraggableCard
												dragId="nested"
												label="Nested card (drag me)"
												testId="nested-card"
											/>
											<DropTarget label="Nested drop target" testId="nested-drop-target" />
										</div>
									</PopoverSurface>
								</Popover>
							</div>
						</PopoverSurface>
					</Popover>
				</div>

				<div css={styles.outsideColumn}>
					<div css={styles.columnHeading}>Top document (outside every popover)</div>
					<DraggableCard dragId="outside" label="Outside card (drag me)" testId="outside-card" />
					<DropTarget label="Outside drop target" testId="outside-drop-target" />
					<div css={styles.emptySpace} data-testid="empty-space">
						Empty space (not a drop target)
					</div>
				</div>
			</div>
		</div>
	);
}
