import { token } from '@atlaskit/tokens';
import { type TPlacementOptions } from '@atlaskit/top-layer/placement-map';

import type { Placement } from '../../types';

const GAP = token('space.050');

/**
 * Cross-axis shift toward target centre on block-axis placements (CSS anchor path).
 */
const INLINE_TARGET_CENTER_SHIFT = 'calc(anchor-size(width) / 2 - 28px)';
/**
 * Cross-axis shift toward target centre on inline-axis placements (CSS anchor path).
 */
const BLOCK_TARGET_CENTER_SHIFT = 'calc(anchor-size(height) / 2 - 22px)';

export const placementMap: Record<Placement, TPlacementOptions> = {
	'top-start': {
		axis: 'block',
		edge: 'start',
		align: 'end',
		offset: {
			gap: GAP,
			crossAxisShift: {
				value: INLINE_TARGET_CENTER_SHIFT,
				direction: 'backwards',
			},
		},
	},
	'top-center': {
		axis: 'block',
		edge: 'start',
		align: 'center',
		offset: {
			gap: GAP,
		},
	},
	'top-end': {
		axis: 'block',
		edge: 'start',
		align: 'start',
		offset: {
			gap: GAP,
			crossAxisShift: {
				value: INLINE_TARGET_CENTER_SHIFT,
				direction: 'forwards',
			},
		},
	},
	'bottom-start': {
		axis: 'block',
		edge: 'end',
		align: 'end',
		offset: {
			gap: GAP,
			crossAxisShift: {
				value: INLINE_TARGET_CENTER_SHIFT,
				direction: 'backwards',
			},
		},
	},
	'bottom-center': {
		axis: 'block',
		edge: 'end',
		align: 'center',
		offset: {
			gap: GAP,
		},
	},
	'bottom-end': {
		axis: 'block',
		edge: 'end',
		align: 'start',
		offset: {
			gap: GAP,
			crossAxisShift: {
				value: INLINE_TARGET_CENTER_SHIFT,
				direction: 'forwards',
			},
		},
	},
	'right-start': {
		axis: 'inline',
		edge: 'end',
		align: 'end',
		offset: {
			gap: GAP,
			crossAxisShift: {
				value: BLOCK_TARGET_CENTER_SHIFT,
				direction: 'backwards',
			},
		},
	},
	'right-end': {
		axis: 'inline',
		edge: 'end',
		align: 'start',
		offset: {
			gap: GAP,
			crossAxisShift: {
				value: `calc(${BLOCK_TARGET_CENTER_SHIFT} - 4px)`,
				direction: 'forwards',
			},
		},
	},
	'left-start': {
		axis: 'inline',
		edge: 'start',
		align: 'end',
		offset: {
			gap: GAP,
			crossAxisShift: {
				value: BLOCK_TARGET_CENTER_SHIFT,
				direction: 'backwards',
			},
		},
	},
	'left-end': {
		axis: 'inline',
		edge: 'start',
		align: 'start',
		offset: {
			gap: GAP,
			crossAxisShift: {
				value: `calc(${BLOCK_TARGET_CENTER_SHIFT} - 4px)`,
				direction: 'forwards',
			},
		},
	},
};
