import { FileState } from '@atlaskit/media-client';
import { GasPayload } from '@atlaskit/analytics-gas-types';
import { packageAttributes, entryToZipEntryGasPayload } from './index';
import { ZipEntry } from 'unzipit';

export const zipEntryLoadFailedEvent = (
  innerError?: Error,
  entry?: ZipEntry,
  fileState?: FileState,
): GasPayload => {
  const zipEntryGasPayload = entry ? entryToZipEntryGasPayload(entry) : {};
  return {
    eventType: 'operational',
    actionSubject: 'mediaFile',
    actionSubjectId: fileState ? fileState.id : undefined,
    action: 'zipEntryLoadFailed',
    attributes: {
      status: 'fail',
      failReason: innerError ? innerError.message : undefined,
      ...zipEntryGasPayload,
      ...packageAttributes,
    },
  };
};

export const zipEntryLoadSucceededEvent = (
  entry?: ZipEntry,
  fileState?: FileState,
): GasPayload => {
  const zipEntryGasPayload = entry ? entryToZipEntryGasPayload(entry) : {};
  return {
    eventType: 'operational',
    actionSubject: 'mediaFile',
    actionSubjectId: fileState ? fileState.id : undefined,
    action: 'zipEntryLoadSucceeded',
    attributes: {
      status: 'success',
      ...zipEntryGasPayload,
      ...packageAttributes,
    },
  };
};
