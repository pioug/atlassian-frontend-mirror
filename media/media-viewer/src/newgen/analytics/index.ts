import { FileState, MediaType } from '@atlaskit/media-client';
import {
  name as packageName,
  version as packageVersion,
} from '../../version.json';
import { ZipEntry } from 'unzipit';
import { getMimeTypeFromFilename } from '../utils';

export const channel = 'media';

export const packageAttributes: PackageAttributes = {
  componentName: 'media-viewer',
  packageName,
  packageVersion,
};

export interface PackageAttributes {
  componentName: string;
  packageName: string;
  packageVersion: string;
}
export interface FileGasPayload {
  fileId: string;
  fileMediatype?: MediaType;
  fileMimetype?: string;
  fileSize?: number;
}

export interface ZipEntryGasPayload {
  size?: number;
  encrypted?: boolean;
  compressedSize?: number;
  mimeType?: string;
}

export function fileStateToFileGasPayload(state: FileState): FileGasPayload {
  const basePayload = {
    fileId: state.id,
  };
  switch (state.status) {
    case 'uploading':
    case 'failed-processing':
    case 'processing':
    case 'processed':
      return {
        ...basePayload,
        fileMediatype: state.mediaType,
        fileMimetype: state.mimeType,
        fileSize: state.size,
      };
    case 'error':
      return basePayload;
  }
}

export function entryToZipEntryGasPayload(entry: ZipEntry): ZipEntryGasPayload {
  return {
    size: entry.size,
    encrypted: entry.encrypted,
    compressedSize: entry.compressedSize,
    mimeType: getMimeTypeFromFilename(entry.name),
  };
}
