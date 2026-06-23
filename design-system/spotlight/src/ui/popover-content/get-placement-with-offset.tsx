import { token } from '@atlaskit/tokens';
import { type TPlacementOptions } from '@atlaskit/top-layer/placement-map';

import type { Placement } from '../../types';

import { placementMap } from './placement-map';

const DEFAULT_GAP = token('space.050');

type TOffsetTuple = readonly [number | null | undefined, number | null | undefined];
type TCrossAxisShift = NonNullable<NonNullable<TPlacementOptions['offset']>['crossAxisShift']>;

function normalizeOffsetMember({
	value,
}: {
	value: number | null | undefined;
}): number {
	return value ?? 0;
}

function addCssLength({
	base,
	delta,
}: {
	base: number | string;
	delta: number;
}): number | string {
	if (delta === 0) {
		return base;
	}

	if (typeof base === 'number') {
		return base + delta;
	}

	const operator = delta > 0 ? '+' : '-';
	return `calc(${base} ${operator} ${Math.abs(delta)}px)`;
}

function toSignedCrossAxisShiftValue({
	crossAxisShift,
}: {
	crossAxisShift: TCrossAxisShift;
}): number | string {
	const baseValue = crossAxisShift.value ?? 0;

	if (crossAxisShift.direction === 'forwards') {
		return baseValue;
	}

	if (typeof baseValue === 'number') {
		return -baseValue;
	}

	return `calc(-1 * ${baseValue})`;
}

function getCrossAxisShiftWithOffset({
	baseCrossAxisShift,
	along,
}: {
	baseCrossAxisShift: TCrossAxisShift | undefined;
	along: number;
}): TCrossAxisShift | undefined {
	if (!baseCrossAxisShift) {
		if (along === 0) {
			return undefined;
		}

		return {
			value: along,
			direction: 'forwards',
		};
	}

	if (along === 0) {
		return baseCrossAxisShift;
	}

	// Collapse sign into the CSS length so additive composition works even
	// when the existing shift is already expressed as a `calc(...)` string.
	return {
		value: addCssLength({
			base: toSignedCrossAxisShiftValue({ crossAxisShift: baseCrossAxisShift }),
			delta: along,
		}),
		direction: 'forwards',
	};
}

export function getPlacementWithOffset({
	placement,
	offset,
}: {
	placement: Placement;
	offset: TOffsetTuple | undefined;
}): TPlacementOptions {
	const basePlacement = placementMap[placement];

	if (!offset) {
		return basePlacement;
	}

	const [alongRaw, awayRaw] = offset;
	const along = normalizeOffsetMember({ value: alongRaw });
	const away = normalizeOffsetMember({ value: awayRaw });

	if (along === 0 && away === 0) {
		return basePlacement;
	}

	const gap = addCssLength({
		base: basePlacement.offset?.gap ?? DEFAULT_GAP,
		delta: away,
	});
	const crossAxisShift = getCrossAxisShiftWithOffset({
		baseCrossAxisShift: basePlacement.offset?.crossAxisShift,
		along,
	});

	return {
		...basePlacement,
		offset: {
			...basePlacement.offset,
			gap,
			...(crossAxisShift ? { crossAxisShift } : {}),
		},
	};
}
