import { type MediaCardCursor } from '../../types';

export const getCursorStyle = (cursor: MediaCardCursor | undefined): string =>
	!!cursor ? `cursor: ${cursor};` : '';
