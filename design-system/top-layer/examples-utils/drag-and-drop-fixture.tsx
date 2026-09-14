/**
 * @jsxRuntime classic
 * @jsx jsx
 */

/**
 * Shared Pragmatic drag and drop pieces for the top-layer drag and drop browser
 * test fixtures, so those tests compare top-layer behaviour rather than two
 * different drag and drop implementations.
 *
 * Readouts a test can assert on: `data-drag-state` on a draggable,
 * `data-dragged-over` and `<testId>-last-drop` on a drop target, and
 * `drag-state` on `DragStateReadout`. The assertions live in
 * `__tests__/playwright/drag-and-drop-utils.tsx`.
 */
import { type ReactNode, useEffect, useRef, useState } from 'react';

import { jsx } from '@compiled/react';

import { cssMap } from '@atlaskit/css';
import {
	draggable,
	dropTargetForElements,
	monitorForElements,
} from '@atlaskit/pragmatic-drag-and-drop/adapter/element-adapter';
import { token } from '@atlaskit/tokens';

const styles = cssMap({
	card: {
		paddingBlock: token('space.100'),
		paddingInline: token('space.150'),
		borderRadius: token('radius.small', '3px'),
		backgroundColor: token('color.background.neutral'),
		color: token('color.text'),
		cursor: 'grab',
		font: token('font.body'),
		userSelect: 'none',
	},
	cardDragging: {
		opacity: token('opacity.disabled'),
	},
	dropTarget: {
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		justifyContent: 'center',
		gap: token('space.050'),
		minWidth: '160px',
		minHeight: '90px',
		borderRadius: token('radius.small', '3px'),
		borderWidth: token('border.width'),
		borderStyle: 'dashed',
		borderColor: token('color.border'),
		color: token('color.text.subtlest'),
		font: token('font.body'),
		textAlign: 'center',
	},
	dropTargetOver: {
		borderColor: token('color.border.selected'),
		backgroundColor: token('color.background.selected'),
		color: token('color.text.selected'),
	},
	readout: {
		font: token('font.body.small'),
	},
});

type TDragData = {
	dragId: string;
};

function getDragId({ data }: { data: Record<string | symbol, unknown> }): string | null {
	const dragId = data.dragId;
	if (typeof dragId !== 'string') {
		return null;
	}
	return dragId;
}

/**
 * A draggable card. `dragId` is what a drop target reports after accepting it,
 * so it needs to be unique within a fixture.
 */
export function DraggableCard({
	dragId,
	label,
	testId,
}: {
	dragId: string;
	label: string;
	testId: string;
}): ReactNode {
	const cardRef = useRef<HTMLDivElement>(null);
	const [isDragging, setIsDragging] = useState(false);

	useEffect(() => {
		const element = cardRef.current;
		if (!element) {
			return;
		}

		const data: TDragData = { dragId };

		return draggable({
			element,
			getInitialData: () => data,
			onDragStart: () => setIsDragging(true),
			onDrop: () => setIsDragging(false),
		});
	}, [dragId]);

	return (
		<div
			ref={cardRef}
			css={[styles.card, isDragging && styles.cardDragging]}
			data-testid={testId}
			data-drag-state={isDragging ? 'dragging' : 'idle'}
		>
			{label}
		</div>
	);
}

/**
 * A drop target that records the `dragId` of the last card it accepted.
 *
 * The recorded drop is separate state to "is currently dragged over" because
 * both can be true at once: a second drag can travel over a target that already
 * accepted a card.
 */
export function DropTarget({ label, testId }: { label: string; testId: string }): ReactNode {
	const dropTargetRef = useRef<HTMLDivElement>(null);
	const [isDraggedOver, setIsDraggedOver] = useState(false);
	const [lastDroppedId, setLastDroppedId] = useState<string | null>(null);

	useEffect(() => {
		const element = dropTargetRef.current;
		if (!element) {
			return;
		}

		return dropTargetForElements({
			element,
			onDragEnter: () => setIsDraggedOver(true),
			onDragLeave: () => setIsDraggedOver(false),
			onDrop: ({ source }) => {
				setIsDraggedOver(false);
				const dragId = getDragId({ data: source.data });
				if (dragId !== null) {
					setLastDroppedId(dragId);
				}
			},
		});
	}, []);

	return (
		<div
			ref={dropTargetRef}
			css={[styles.dropTarget, isDraggedOver && styles.dropTargetOver]}
			data-testid={testId}
			data-dragged-over={isDraggedOver ? 'true' : 'false'}
		>
			<span>{label}</span>
			<span css={styles.readout}>
				last drop: <span data-testid={`${testId}-last-drop`}>{lastDroppedId ?? 'none'}</span>
			</span>
		</div>
	);
}

/**
 * Reports whether a drag is in progress, so a test can confirm one genuinely
 * started before trusting anything else it asserts.
 */
export function DragStateReadout(): ReactNode {
	const [isDragging, setIsDragging] = useState(false);

	useEffect(() => {
		return monitorForElements({
			onDragStart: () => setIsDragging(true),
			onDrop: () => setIsDragging(false),
		});
	}, []);

	return (
		<div css={styles.readout}>
			drag state: <span data-testid="drag-state">{isDragging ? 'dragging' : 'idle'}</span>
		</div>
	);
}
