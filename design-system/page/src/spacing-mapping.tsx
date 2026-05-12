const defaultGridSize = 8;

export const spacingMapping: {
	readonly comfortable: number;
	readonly cosy: number;
	readonly compact: number;
} = {
	comfortable: defaultGridSize * 5,
	cosy: defaultGridSize * 2,
	compact: defaultGridSize * 0.5,
} as const;
