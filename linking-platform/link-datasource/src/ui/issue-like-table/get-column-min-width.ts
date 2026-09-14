import { COLUMN_BASE_WIDTH } from './utils';

const COLUMN_MIN_WIDTH = COLUMN_BASE_WIDTH * 4;

const keyBasedMinWidthMap: Record<string, number> = {
	summary: COLUMN_BASE_WIDTH * 26,
	status: COLUMN_BASE_WIDTH * 12.5,
	priority: COLUMN_BASE_WIDTH * 12.5, // 100px
	assignee: COLUMN_BASE_WIDTH * 12.5,
};

export const getColumnMinWidth = (key: string): number => {
	return keyBasedMinWidthMap[key] || COLUMN_MIN_WIDTH;
};
