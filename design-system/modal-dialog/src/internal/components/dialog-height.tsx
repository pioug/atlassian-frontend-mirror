import type { ModalDialogProps } from '../../types';

export const dialogHeight = (input?: ModalDialogProps['height']): string => {
	if (!input) {
		return 'auto';
	}

	return typeof input === 'number' ? `${input}px` : input;
};
