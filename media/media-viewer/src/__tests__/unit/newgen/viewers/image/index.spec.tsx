import React from 'react';

import { ProcessedFileState } from '@atlaskit/media-client';
import {
  awaitError,
  mountWithIntlContext,
  fakeMediaClient,
  asMockFunction,
  nextTick,
  expectToEqual,
  expectFunctionToHaveBeenCalledWith,
} from '@atlaskit/media-test-helpers';

import {
  ImageViewer,
  ImageViewerContent,
  ImageViewerProps,
} from '../../../../../viewers/image';
import { BaseState } from '../../../../../viewers/base-viewer';
import { InteractiveImg } from '../../../../../viewers/image/interactive-img';

const collectionName = 'some-collection';
const imageItem: ProcessedFileState = {
  id: 'some-id',
  status: 'processed',
  name: 'my image',
  size: 11222,
  mediaType: 'image',
  mimeType: 'image/jpeg',
  artifacts: {},
  representations: {
    image: {},
  },
};

function setup(response: Promise<Blob>, props?: Partial<ImageViewerProps>) {
  const mediaClient = fakeMediaClient();
  asMockFunction(mediaClient.getImage).mockReturnValue(response);
  asMockFunction(mediaClient.file.getFileBinaryURL).mockResolvedValue(
    'some-binary-url',
  );
  const onClose = jest.fn();
  const onLoaded = jest.fn();
  const onError = jest.fn();
  const component = mountWithIntlContext<
    ImageViewerProps,
    BaseState<ImageViewerContent>,
    ImageViewer
  >(
    <ImageViewer
      mediaClient={mediaClient}
      item={imageItem}
      collectionName={collectionName}
      onClose={onClose}
      onLoad={onLoaded}
      onError={onError}
      {...props}
    />,
  );
  return { mediaClient, component, onClose };
}

describe('ImageViewer', () => {
  it('assigns an object url for images when successful', async () => {
    const response = Promise.resolve(new Blob());
    const { component, mediaClient } = setup(response);

    await response;
    await nextTick();
    await nextTick();
    await nextTick();

    expectFunctionToHaveBeenCalledWith(mediaClient.file.getFileBinaryURL, [
      'some-id',
      'some-collection',
    ]);

    expectToEqual(component.state().content.data, {
      objectUrl: 'mock result of URL.createObjectURL()',
      orientation: 1,
      originalBinaryImageUrl: 'some-binary-url',
    });
  });

  it('should not try get originalBinaryImageUrl when is local file reference', async () => {
    const response = Promise.reject("shouldn't be used");
    const { component } = setup(response, {
      item: {
        ...imageItem,
        preview: {
          value: new File([], 'some-file-name'),
          origin: 'local',
        },
      },
    });

    await nextTick();
    await nextTick();
    await nextTick();

    expectToEqual(component.state().content.data, {
      objectUrl: 'mock result of URL.createObjectURL()',
      orientation: 1,
      originalBinaryImageUrl: undefined,
    });
  });

  it('should not try get originalBinaryImageUrl when is file is not an image', async () => {
    const response = Promise.resolve(new Blob());
    const { component } = setup(response, {
      item: {
        ...imageItem,
        mediaType: 'unknown',
      },
    });

    await response;
    await nextTick();

    expectToEqual(component.state().content.data, {
      objectUrl: 'mock result of URL.createObjectURL()',
      orientation: 1,
      originalBinaryImageUrl: undefined,
    });
  });

  it('should not try get originalBinaryImageUrl when is file still uploading', async () => {
    const response = Promise.reject("shouldn't be used");
    const { component } = setup(response, {
      item: {
        ...imageItem,
        preview: {
          value: 'some-preview-string',
        },
        status: 'uploading',
        progress: 0.5,
      },
    });

    await nextTick();
    await nextTick();

    expectToEqual(component.state().content.data, {
      objectUrl: 'some-preview-string',
      orientation: 1,
      originalBinaryImageUrl: undefined,
    });
  });

  it('should not try get originalBinaryImageUrl when has unsupported mime type', async () => {
    const response = Promise.resolve(new Blob());
    const { component } = setup(response, {
      item: {
        ...imageItem,
        mimeType: 'image/heic',
      },
    });

    await response;
    await nextTick();

    expectToEqual(component.state().content.data, {
      objectUrl: 'mock result of URL.createObjectURL()',
      orientation: 1,
      originalBinaryImageUrl: undefined,
    });
  });

  it('should not update state when image fetch request is cancelled', async () => {
    const response = Promise.reject(new Error('request_cancelled'));
    const { component } = setup(response);

    const previousContent = component.state().content;
    expect(previousContent).toEqual({ state: { status: 'PENDING' } });

    await awaitError(response, 'request_cancelled');

    expect(component.state().content).toEqual(previousContent);
  });

  it('should not call `onLoad` callback when image fetch request is cancelled', async () => {
    const response = Promise.reject(new Error('request_cancelled'));
    const { component } = setup(response);

    expect(component.props().onLoad).not.toHaveBeenCalled();

    await awaitError(response, 'request_cancelled');

    expect(component.props().onLoad).not.toHaveBeenCalled();
  });

  it('cancels an image fetch request when unmounted', () => {
    const abort = jest.fn();
    class FakeAbortController {
      abort = abort;
    }
    (global as any).AbortController = FakeAbortController;
    const response: any = new Promise(() => {});
    const { component } = setup(response);

    component.unmount();

    expect(abort).toHaveBeenCalled();
  });

  it('revokes an existing object url when unmounted', async () => {
    const response = Promise.resolve(new Blob());
    const { component } = setup(response);

    const revokeObjectUrl = jest.fn();
    (component as any).instance()['revokeObjectUrl'] = revokeObjectUrl;

    await response;
    await nextTick();
    await nextTick();
    await nextTick();
    component.unmount();

    expect(revokeObjectUrl).toHaveBeenCalled();
  });

  it('should call mediaClient.getImage when image representation is present and no preview is present', async () => {
    const response = Promise.resolve(new Blob());
    const { component, mediaClient } = setup(response);

    await response;
    await nextTick();
    component.update();

    expect(mediaClient.getImage).toHaveBeenCalledWith(
      'some-id',
      {
        collection: 'some-collection',
        mode: 'fit',
      },
      expect.anything(),
      true,
    );
  });

  it('should not call mediaClient.getImage when image representation and a preview is present', async () => {
    const response = Promise.resolve(new Blob());
    const { component, mediaClient } = setup(response, {
      item: { ...imageItem, preview: { value: new Blob() } },
    });

    await response;
    component.update();

    expect(mediaClient.getImage).not.toHaveBeenCalled();
  });

  it('should not call mediaClient.getImage when image representation is not present', async () => {
    const response = Promise.resolve(new Blob());
    const { component, mediaClient } = setup(response, {
      item: {
        ...imageItem,
        representations: {},
      },
    });

    await response;
    component.update();

    expect(mediaClient.getImage).not.toHaveBeenCalled();
  });

  it('MSW-700: clicking on background of ImageViewer does not close it', async () => {
    const response = Promise.resolve(new Blob());
    const { component, onClose } = setup(response);

    await response;
    await nextTick();
    await nextTick();
    await nextTick();
    component.simulate('click');

    expect(onClose).toHaveBeenCalled();
  });

  it('should add file attrs to src if contextId is passed', async () => {
    const response = Promise.resolve(new Blob());
    const { component } = setup(response, {
      contextId: 'some-context-id',
    });

    await response;
    await nextTick();
    await nextTick();
    await nextTick();
    component.update();
    expect(component.find(InteractiveImg).prop('src')).toEqual(
      'mock result of URL.createObjectURL()#media-blob-url=true&id=some-id&contextId=some-context-id&collection=some-collection',
    );
  });
});
