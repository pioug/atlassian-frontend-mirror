import { getObjectUrlFromFileState } from '../../../../utils/getObjectUrlFromFileState';
import { FileState } from '@atlaskit/media-client';

describe('getObjectUrlFromFileState()', () => {
  it('should return an objectUrl if there is available preview in the state', async () => {
    const fileState: FileState = {
      status: 'processing',
      name: '',
      id: '',
      mediaType: 'image',
      mimeType: '',
      size: 1,
      preview: {
        value: new Blob(),
      },
      representations: {},
    };

    expect(await getObjectUrlFromFileState(fileState)).toEqual(
      'mock result of URL.createObjectURL()',
    );
  });

  it('should return undefined if preview is not available', async () => {
    const errorState: FileState = {
      status: 'error',
      id: '',
    };
    const processedState: FileState = {
      status: 'processed',
      id: '',
      artifacts: {},
      mediaType: 'image',
      mimeType: '',
      name: '',
      size: 1,
      representations: {},
    };

    expect(await getObjectUrlFromFileState(errorState)).toBeUndefined();
    expect(await getObjectUrlFromFileState(processedState)).toBeUndefined();
  });

  it('should return undefined if preview is a rejected promise', async () => {
    const processedState: FileState = {
      status: 'processed',
      name: '',
      id: '',
      artifacts: {},
      mediaType: 'image',
      mimeType: '',
      size: 1,
      preview: Promise.reject(new Error('file has no image representation')),
      representations: {},
    };

    expect(await getObjectUrlFromFileState(processedState)).toBeUndefined();
  });
});
