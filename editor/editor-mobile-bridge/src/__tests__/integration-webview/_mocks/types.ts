import { MediaFile } from '@atlaskit/media-client';

export type MockCollections = {
  [key: string]: Array<MediaFile & { blob: Blob }>;
};

export type MockFileInputParams = Partial<MediaFile> & { dataUri?: string };
export type MockFile = MediaFile & { blob?: Blob };
