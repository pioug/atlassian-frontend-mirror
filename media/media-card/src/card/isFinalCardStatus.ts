import { type CardStatus } from '../types';

export const isFinalCardStatus = (status: CardStatus): boolean =>
	['complete', 'error', 'failed-processing'].includes(status);
