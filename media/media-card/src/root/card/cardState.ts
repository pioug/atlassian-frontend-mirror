import { FileState, isErrorFileState } from '@atlaskit/media-client';
import { MediaFeatureFlags } from '@atlaskit/media-common';
import { CardState } from '../..';
import { MediaCardError } from '../../errors';
import { getCardStatus, isFinalCardStatus } from './getCardStatus';
import { extractFilePreviewStatus } from './getCardPreview';

export const createStateUpdater = (newState: Partial<CardState>) => (
  prevState: CardState,
): Pick<CardState, keyof CardState> => {
  // Only override if previous status is non-final
  // or new status is 'complete'
  if (isFinalCardStatus(prevState.status) && newState.status !== 'complete') {
    return prevState;
  }
  return { ...prevState, ...newState };
};

export const getCardStateFromFileState = (
  fileState: FileState,
  isBannedLocalPreview: boolean,
  featureFlags?: MediaFeatureFlags,
): Partial<CardState> => {
  const status = getCardStatus(
    fileState.status,
    extractFilePreviewStatus(fileState, isBannedLocalPreview, featureFlags),
  );

  const error =
    status === 'error' && isErrorFileState(fileState)
      ? new MediaCardError('error-file-state', new Error(fileState.message))
      : undefined;

  const progress =
    status === 'uploading' && fileState.status === 'uploading'
      ? fileState.progress
      : 1;

  return {
    fileState,
    status,
    progress,
    error,
  };
};
