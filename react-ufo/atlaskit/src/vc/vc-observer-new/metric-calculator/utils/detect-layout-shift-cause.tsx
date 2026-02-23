import type {
	LayoutShiftOffender,
	LayoutShiftOffenderMatchState,
	LayoutShiftVariables,
} from '../../../../common/vc/types';
import type { VCObserverEntry, ViewportEntryData } from '../../types';

type DetectLayoutShiftCauseParams = {
	/**
	 * All viewport observer entries, used to find potential offenders close to the layout-shift timestamp.
	 */
	viewportEntries: ReadonlyArray<VCObserverEntry & { data: ViewportEntryData }>;
	/**
	 * The layout-shift entries that contributed to a VC checkpoint.
	 */
	layoutShiftEntries: ReadonlyArray<ViewportEntryData>;
	/**
	 * Timestamp of the VC checkpoint entry.
	 */
	time: number;
	/**
	 * Start time of the interaction; used to classify whether an offender happened before the VC checkpoint.
	 */
	startTime: number;
	/**
	 * Window around the checkpoint timestamp used to consider "nearby" offenders.
	 */
	offenderWindowMs?: number;
};

type LayoutShiftMovement = {
	dx: number;
	dy: number;
	movedX: boolean;
	movedY: boolean;
	dirX: -1 | 0 | 1;
	dirY: -1 | 0 | 1;
	absDx: number;
	absDy: number;
};

const calculateOffenderState = (
	current: LayoutShiftOffenderMatchState | null,
	matchesCurrentEntry: boolean,
): LayoutShiftOffenderMatchState => {
	// Once we know it's mixed across entries, we can short-circuit.
	if (current === 'some') {
		return 'some';
	}

	const entryState: LayoutShiftOffenderMatchState = matchesCurrentEntry ? 'all' : 'none';
	if (current == null) {
		return entryState;
	}

	// If the state flips between entries (all <-> none), it's "some".
	if (current !== entryState) {
		return 'some';
	}

	return current;
};

const calculateLayoutShiftMovement = (
	layoutShiftEntries: ReadonlyArray<ViewportEntryData>,
): LayoutShiftVariables => {
	const movements: Array<LayoutShiftMovement | null> = layoutShiftEntries.map((lsEntry) => {
		const rect = lsEntry.rect;
		const previousRect = lsEntry.previousRect;
		if (!rect || !previousRect) {
			return null;
		}

		const dx = rect.x - previousRect.x;
		const dy = rect.y - previousRect.y;

		return {
			dx,
			dy,
			movedX: dx !== 0,
			movedY: dy !== 0,
			dirX: Math.sign(dx) as -1 | 0 | 1,
			dirY: Math.sign(dy) as -1 | 0 | 1,
			absDx: Math.abs(dx),
			absDy: Math.abs(dy),
		};
	});

	const hasMovement = (m: LayoutShiftMovement | null): m is LayoutShiftMovement => m !== null;
	const validMovements = movements.filter(hasMovement);
	const allHaveRects =
		layoutShiftEntries.length > 0 && validMovements.length === layoutShiftEntries.length;

	if (!allHaveRects) {
		return {
			allHaveRects,
			allMovedSameWay: false,
			allMovedSameAmount: false,
		};
	}

	const first = validMovements[0];
	const allMovedSameWay = validMovements.every(
		(m) =>
			m.movedX === first.movedX &&
			m.movedY === first.movedY &&
			m.dirX === first.dirX &&
			m.dirY === first.dirY,
	);

	const allMovedSameAmount =
		allMovedSameWay &&
		validMovements.every((m) => m.absDx === first.absDx && m.absDy === first.absDy);

	return {
		allHaveRects,
		allMovedSameWay,
		allMovedSameAmount,
		deltaX: first.dx,
		deltaY: first.dy,
	};
};

export const detectLayoutShiftCause = ({
	viewportEntries,
	layoutShiftEntries,
	time,
	startTime,
	offenderWindowMs = 250,
}: DetectLayoutShiftCauseParams): {
	layoutShiftVariables: LayoutShiftVariables;
	layoutShiftOffenders: LayoutShiftOffender[];
} => {
	const checkpointTimestamp = startTime + time;
	const filteredLSPotentialOffenders = viewportEntries.filter(
		(viewportEntry) =>
			((viewportEntry.time < checkpointTimestamp &&
				viewportEntry.time > checkpointTimestamp - offenderWindowMs) ||
				(viewportEntry.time > checkpointTimestamp &&
					viewportEntry.time < checkpointTimestamp + offenderWindowMs)) &&
			viewportEntry.data.type !== 'layout-shift',
	);

	// Summarize whether all layout-shift entries moved in a consistent direction and by the same amount.
	const layoutShiftVariables: LayoutShiftVariables =
		calculateLayoutShiftMovement(layoutShiftEntries);

	// Classify each offender against *all* layout-shift entries when the layout shift is consistently moving in a
	// single axis (pure X or pure Y) so we can reason about whether an offender could have caused the movement.
	const layoutShiftOffenders = filteredLSPotentialOffenders.reduce<LayoutShiftOffender[]>(
		(acc, offender) => {
			const offenderData = offender.data as ViewportEntryData;
			const offenderRect = offenderData.rect;
			if (!offenderRect) {
				return acc;
			}

			const offenderTimestamp = offenderData.originalMutationTimestamp ?? offender.time;
			const happenedBefore = offenderTimestamp <= checkpointTimestamp;

			const offenderLeft = offenderRect.x;
			const offenderRight = offenderRect.x + offenderRect.width;
			const offenderTop = offenderRect.y;
			const offenderBottom = offenderRect.y + offenderRect.height;

			const shouldClassifyAgainstAllEntries =
				layoutShiftVariables.allMovedSameWay &&
				'deltaX' in layoutShiftVariables &&
				'deltaY' in layoutShiftVariables &&
				(layoutShiftVariables.deltaX === 0) !== (layoutShiftVariables.deltaY === 0);

			let isAbove: LayoutShiftOffenderMatchState | null = null;
			let isLeft: LayoutShiftOffenderMatchState | null = null;
			let isRight: LayoutShiftOffenderMatchState | null = null;
			let hasHorizontalOverlap: LayoutShiftOffenderMatchState | null = null;
			let hasVerticalOverlap: LayoutShiftOffenderMatchState | null = null;

			if (shouldClassifyAgainstAllEntries) {
				for (const lsEntry of layoutShiftEntries) {
					const lsRect = lsEntry.rect;
					if (!lsRect) {
						continue;
					}

					const lsLeft = lsRect.x;
					const lsRight = lsRect.x + lsRect.width;
					const lsTop = lsRect.y;
					const lsBottom = lsRect.y + lsRect.height;

					isAbove = calculateOffenderState(isAbove, offenderBottom <= lsTop);
					isLeft = calculateOffenderState(isLeft, offenderRight <= lsLeft);
					isRight = calculateOffenderState(isRight, offenderLeft >= lsRight);
					hasHorizontalOverlap = calculateOffenderState(
						hasHorizontalOverlap,
						offenderLeft < lsRight && offenderRight > lsLeft,
					);
					hasVerticalOverlap = calculateOffenderState(
						hasVerticalOverlap,
						offenderTop < lsBottom && offenderBottom > lsTop,
					);
				}
			}

			let matchesLayoutShiftDelta = false;
			if (
				shouldClassifyAgainstAllEntries &&
				layoutShiftVariables.allMovedSameAmount &&
				offenderData.previousRect
			) {
				const dx = offenderRect.x - offenderData.previousRect.x;
				const dy = offenderRect.y - offenderData.previousRect.y;
				const isPureX = layoutShiftVariables.deltaX !== 0 && layoutShiftVariables.deltaY === 0;
				const isPureY = layoutShiftVariables.deltaY !== 0 && layoutShiftVariables.deltaX === 0;

				if (isPureX) {
					matchesLayoutShiftDelta = dx === layoutShiftVariables.deltaX && dy === 0;
				} else if (isPureY) {
					matchesLayoutShiftDelta = dy === layoutShiftVariables.deltaY && dx === 0;
				}
			}

			acc.push({
				offender: offenderData.elementName,
				happenedBefore,
				distanceToLS: Math.round(offenderTimestamp - checkpointTimestamp),
				isAbove: isAbove ?? 'none',
				isLeft: isLeft ?? 'none',
				isRight: isRight ?? 'none',
				hasHorizontalOverlap: hasHorizontalOverlap ?? 'none',
				hasVerticalOverlap: hasVerticalOverlap ?? 'none',
				matchesLayoutShiftDelta,
			});
			return acc;
		},
		[],
	);

	return {
		layoutShiftVariables,
		layoutShiftOffenders,
	};
};
