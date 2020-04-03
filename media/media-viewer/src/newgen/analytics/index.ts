import { FileState, MediaType } from '@atlaskit/media-client';
import {
  name as packageName,
  version as packageVersion,
} from '../../version.json';

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
