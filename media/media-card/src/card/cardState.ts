import { type FileState, isErrorFileState } from '@atlaskit/media-client';
import { type CardState } from '../types';
import { MediaCardError } from '../errors';
import { getCardStatus, isFinalCardStatus } from './getCardStatus';
import { extractFilePreviewStatus } from './getCardPreview';

/**
 * From docs: "Both state and props received by the updater function are guaranteed to be up-to-date.
 * The output of the updater is shallowly merged with state."
 */
export const createStateUpdater =
	(newState: Partial<CardState>, fireErrorEvent: (error: MediaCardError) => void) =>
	(prevState: CardState): Partial<CardState> => {
		// Only override if previous status is non-final or new status is 'complete'
		if (
			!!newState.status &&
			isFinalCardStatus(prevState.status) &&
			newState.status !== 'complete'
		) {
			// Log the error if the new state is not going to store it.
			// i.e. this is a non critical error
			!!newState.error && fireErrorEvent(newState.error);
			return prevState;
		}

		return newState;
	};

export const getCardStateFromFileState = (
	fileState: FileState,
	isBannedLocalPreview: boolean,
): Partial<CardState> => {
	const status = getCardStatus(
		fileState.status,
		extractFilePreviewStatus(fileState, isBannedLocalPreview),
	);

	const error =
		status === 'error' && isErrorFileState(fileState)
			? new MediaCardError('error-file-state', new Error(fileState.message))
			: undefined;

	const progress =
		status === 'uploading' && fileState.status === 'uploading' ? fileState.progress : 1;

	return {
		fileState,
		status,
		progress,
		error,
	};
};
