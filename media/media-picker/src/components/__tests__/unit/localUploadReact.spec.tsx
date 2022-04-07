import {
  LocalUploadComponentReact,
  LocalUploadComponentBaseProps,
} from '../../localUploadReact';
import { ReactWrapper, mount } from 'enzyme';
import React from 'react';
import {
  MediaFile,
  UploadEventPayloadMap,
  UploadErrorEventPayload,
  UploadEndEventPayload,
  UploadPreviewUpdateEventPayload,
  UploadsStartEventPayload,
} from '../../../types';

jest.mock('../../../service/uploadServiceImpl');

import { SCALE_FACTOR_DEFAULT } from '../../../util/getPreviewFromImage';
import * as ufoWrapper from '../../../util/ufoExperiences';
import { UploadComponent } from '../../component';
import { fakeMediaClient } from '@atlaskit/media-test-helpers';

const imageFile: MediaFile = {
  id: 'some-id',
  name: 'some-name',
  size: 12345,
  creationDate: Date.now(),
  type: 'image/jpg',
};

class DummyLocalUploadComponent extends LocalUploadComponentReact<
  LocalUploadComponentBaseProps
> {
  constructor(props: LocalUploadComponentBaseProps) {
    super(props, 'browser');
  }

  render() {
    return null;
  }
}

describe('LocalUploadReact', () => {
  let localUploadComponent: ReactWrapper<DummyLocalUploadComponent>;
  let localUploadComponentInstance: DummyLocalUploadComponent;
  const onUploadsStart = jest.fn();
  const onPreviewUpdate = jest.fn();
  const onEnd = jest.fn();
  const onError = jest.fn();
  let uploadComponent: UploadComponent<UploadEventPayloadMap>;

  const mediaClient = fakeMediaClient();

  const config = {
    uploadParams: {},
  };

  const mockstartMediaUploadUfoExperience = jest.spyOn(
    ufoWrapper,
    'startMediaUploadUfoExperience',
  );

  const mocksucceedMediaUploadUfoExperience = jest.spyOn(
    ufoWrapper,
    'succeedMediaUploadUfoExperience',
  );

  const mockfailMediaUploadUfoExperience = jest.spyOn(
    ufoWrapper,
    'failMediaUploadUfoExperience',
  );

  beforeEach(() => {
    localUploadComponent = mount(
      <DummyLocalUploadComponent
        mediaClient={mediaClient}
        config={config}
        onUploadsStart={onUploadsStart}
        onPreviewUpdate={onPreviewUpdate}
        onEnd={onEnd}
        onError={onError}
      />,
    );

    localUploadComponentInstance = localUploadComponent.instance() as DummyLocalUploadComponent;
    uploadComponent = (localUploadComponentInstance as any).uploadComponent;
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should call uploadComponent.emitUploadsStart with proper arguments and should start UFO experience', () => {
    const emitUploadsStart = jest.spyOn(uploadComponent, 'emitUploadsStart');
    const files: UploadsStartEventPayload = {
      files: [imageFile],
    };
    (localUploadComponentInstance as any).onFilesAdded(files);
    expect(emitUploadsStart).toBeCalledWith(files.files);
    expect(onUploadsStart).toBeCalledWith({ files: files.files });
    expect(mockstartMediaUploadUfoExperience).toBeCalledTimes(1);
    expect(mockstartMediaUploadUfoExperience).toBeCalledWith(
      expect.any(String),
      expect.any(String),
    );
  });

  it('should call uploadComponent.emitUploadPreviewUpdate with proper arguments', () => {
    const emitUploadPreviewUpdate = jest.spyOn(
      uploadComponent,
      'emitUploadPreviewUpdate',
    );
    const preview: UploadPreviewUpdateEventPayload = {
      file: imageFile,
      preview: {
        dimensions: {
          width: 100,
          height: 200,
        },
        scaleFactor: SCALE_FACTOR_DEFAULT,
      },
    };
    (localUploadComponentInstance as any).onFilePreviewUpdate(preview);
    expect(emitUploadPreviewUpdate).toBeCalledWith(
      preview.file,
      preview.preview,
    );
    expect(onPreviewUpdate).toBeCalledWith({
      file: preview.file,
      preview: preview.preview,
    });
  });

  it('should call uploadComponent.emitUploadEnd and UFO failed experience event with proper arguments', () => {
    const emitUploadEnd = jest.spyOn(uploadComponent, 'emitUploadEnd');
    const file: UploadEndEventPayload = {
      file: imageFile,
    };
    (localUploadComponentInstance as any).onFileConverting(file);
    expect(emitUploadEnd).toBeCalledWith(file.file);
    expect(onEnd).toBeCalledWith({
      file: file.file,
    });
    expect(mocksucceedMediaUploadUfoExperience).toBeCalledWith(imageFile.id, {
      fileId: imageFile.id,
      fileSize: imageFile.size,
      fileMimetype: imageFile.type,
    });
  });

  it('should call uploadComponent.emitUploadError and UFO failed experience event with proper arguments', () => {
    const emitUploadError = jest.spyOn(uploadComponent, 'emitUploadError');
    const error = new Error('failed to upload');
    const payload: UploadErrorEventPayload = {
      fileId: imageFile.id,
      error: {
        name: 'object_create_fail',
        description: 'error',
        rawError: error,
      },
    };
    (localUploadComponentInstance as any).onUploadError(payload);
    expect(emitUploadError).toBeCalledWith(payload.fileId, payload.error);
    expect(onError).toBeCalledWith({
      fileId: payload.fileId,
      error: payload.error,
    });
    expect(mockfailMediaUploadUfoExperience).toBeCalledWith(imageFile.id, {
      failReason: payload.error.name,
      error: 'unknown',
      request: undefined,
      fileAttributes: {
        fileId: imageFile.id,
      },
      uploadDurationMsec: -1,
    });
  });
});
