import type { InlineProps } from '@atlaskit/primitives';
import { token } from '@atlaskit/tokens';

type TokenValue = ReturnType<typeof token>;
type ScaleValue = InlineProps['space'];
type SpacingTuple = [ScaleValue, TokenValue];
type SpacingPropsToTokensMap = {
	comfortable: {
		small: SpacingTuple;
		default: SpacingTuple;
		large: SpacingTuple;
	};
	cozy: {
		small: SpacingTuple;
		default: SpacingTuple;
		large: SpacingTuple;
	};
	compact: {
		small: SpacingTuple;
		default: SpacingTuple;
		large: SpacingTuple;
	};
};

export const progressIndicatorGapMap: SpacingPropsToTokensMap = {
	comfortable: {
		small: ['space.075', token('space.075', '6px')],
		default: ['space.100', token('space.100', '8px')],
		large: ['space.150', token('space.150', '12px')],
	},
	cozy: {
		small: ['space.050', token('space.050', '4px')],
		default: ['space.075', token('space.075', '6px')],
		large: ['space.100', token('space.100', '8px')],
	},
	compact: {
		small: ['space.025', token('space.025', '2px')],
		default: ['space.050', token('space.050', '4px')],
		large: ['space.075', token('space.075', '6px')],
	},
};

export const sizes = {
	small: 4,
	default: 8,
	large: 12,
};

export const varDotsSize = '--ds-dots-size';
export const varDotsMargin = '--ds-dots-margin';
