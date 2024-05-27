import {
  type FileIdentifier,
  type ExternalImageIdentifier,
  type FileState,
  type ErrorFileState,
} from '@atlaskit/media-client';
import { getFileDetails } from '../../metadata';

const fileIdentifier: FileIdentifier = {
  id: 'some-file-id',
  mediaItemType: 'file',
};

const externalImageIdentifier: ExternalImageIdentifier = {
  dataURI: 'some-dataURI',
  mediaItemType: 'external-image',
};

const processedFilestate: FileState = {
  status: 'processed',
  id: 'some-file-id',
  mimeType: 'image/png',
  mediaType: 'image',
  name: 'file-name',
  size: 1,
  artifacts: {},
  representations: {
    image: {},
  },
  preview: { value: 'some-file-preview' },
};

const errorFileState: ErrorFileState = {
  status: 'error',
  id: 'some-file-id',
  message: 'some-message',
};

describe('getFileDetails', () => {
  it(`should return file Id when it's FileIdentifier and no FileState is provided`, () => {
    const { id } = fileIdentifier;
    expect(getFileDetails(fileIdentifier)).toEqual(
      expect.objectContaining({ id }),
    );
  });

  it(`should return file Id when it's FileIdentifier and FileState is ErrorFileState`, () => {
    const { id } = fileIdentifier;
    expect(getFileDetails(fileIdentifier, errorFileState)).toEqual(
      expect.objectContaining({ id }),
    );
  });

  it(`should return details based on FileState`, () => {
    const { id, name, size, mimeType, createdAt, mediaType } =
      processedFilestate;
    expect(getFileDetails(fileIdentifier, processedFilestate)).toEqual(
      expect.objectContaining({
        id,
        name,
        size,
        mimeType,
        createdAt,
        mediaType,
        processingStatus: 'succeeded',
      }),
    );
  });

  it(`should return details based on identifier if it's ExternalImageIdentifier without name`, () => {
    const { dataURI, mediaItemType } = externalImageIdentifier;
    expect(getFileDetails(externalImageIdentifier)).toEqual(
      expect.objectContaining({
        id: mediaItemType,
        name: dataURI,
        mediaType: 'image',
      }),
    );
  });

  it(`should return details based on identifier if it's ExternalImageIdentifier with name`, () => {
    const { mediaItemType } = externalImageIdentifier;
    const name = 'some-file.name';
    expect(getFileDetails({ ...externalImageIdentifier, name })).toEqual(
      expect.objectContaining({ id: mediaItemType, name, mediaType: 'image' }),
    );
  });
});
