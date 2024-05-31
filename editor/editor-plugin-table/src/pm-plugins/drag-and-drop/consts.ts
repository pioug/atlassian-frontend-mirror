export const DropTargetType = {
	NONE: 'none',
	ROW: 'row',
	COLUMN: 'column',
} as const;

export type DropTargetType = (typeof DropTargetType)[keyof typeof DropTargetType];
