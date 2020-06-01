import React from 'react';
import { shallow } from 'enzyme';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import {
  nextTick,
  asMock,
  asMockReturnValue,
  fakeMediaClient,
} from '@atlaskit/media-test-helpers';
import {
  ErrorFileState,
  FileState,
  ProcessedFileState,
  UploadingFileState,
  createFileStateSubject,
} from '@atlaskit/media-client';
import { MediaImageInternal, MediaImageInternalProps } from '../../mediaImage';

import { imageFileId } from '@atlaskit/media-test-helpers';

describe('<MediaImage />', () => {
  let defaultProps: Pick<
    MediaImageInternalProps,
    'apiConfig' | 'identifier' | 'children'
  >;

  const defaultFileState: ProcessedFileState = {
    id: 'some-id',
    name: 'some-name',
    size: 42,
    status: 'processed',
    mediaType: 'image',
    mimeType: 'some-mime-type',
    artifacts: {
      'audio.mp3': {
        processingStatus: 'succeeded',
        url: 'some-url',
      },
    },
  };

  const shallowRender = async (props?: MediaImageInternalProps) => {
    if (!props) {
      props = {
        ...defaultProps,
        mediaClient: setup(),
      };
    }
    const wrapper = shallow<MediaImageInternal>(
      <MediaImageInternal {...props}>
        {({ loading, error, data }) => {
          if (loading) {
            return <div>loading</div>;
          }

          if (error) {
            return <div>error</div>;
          }

          if (!data) {
            return null;
          }

          return <img src={data.src} />;
        }}
      </MediaImageInternal>,
    );

    await nextTick();

    return wrapper;
  };

  const setup = (
    fileStateResult: ReplaySubject<FileState> = createFileStateSubject(
      defaultFileState,
    ),
  ) => {
    const mediaClient = fakeMediaClient();

    asMockReturnValue(mediaClient.file.getFileState, fileStateResult);
    asMockReturnValue(mediaClient.getImage, Promise.resolve(new Blob()));
    return mediaClient;
  };

  beforeEach(() => {
    jest.spyOn(URL, 'revokeObjectURL');

    defaultProps = {
      apiConfig: {
        width: 100,
        height: 100,
        upscale: true,
        mode: 'full-fit',
      },
      identifier: imageFileId,
      children: () => null,
    };
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should render error placeholder if request fails', async () => {
    const subject = new ReplaySubject<FileState>(1);
    subject.error('');
    const props = {
      ...defaultProps,
      mediaClient: setup(subject),
    };
    const wrapper = await shallowRender(props);

    expect(wrapper.find('div').text()).toEqual('error');
  });

  it('should render error placeholder if the media type is NOT an image', async () => {
    const fileState: ProcessedFileState = {
      ...defaultFileState,
      mediaType: 'doc',
    };
    const props = {
      ...defaultProps,
      mediaClient: setup(createFileStateSubject(fileState)),
    };

    const wrapper = await shallowRender(props);

    expect(wrapper.find('div').text()).toEqual('error');
  });

  it('should render error placeholder if the request status is `error`', async () => {
    const fileState: ErrorFileState = {
      id: 'some-id',
      status: 'error',
    };

    const props = {
      ...defaultProps,
      mediaClient: setup(createFileStateSubject(fileState)),
    };
    const wrapper = await shallowRender(props);

    expect(wrapper.find('div').text()).toEqual('error');
  });

  it('should render error placeholder if preview cannot be resolved', async () => {
    const fileState: ProcessedFileState = {
      ...defaultFileState,
      mediaType: 'audio',
      preview: Promise.reject('File has no image representation'),
    };

    const props = {
      ...defaultProps,
      mediaClient: setup(createFileStateSubject(fileState)),
    };
    const wrapper = await shallowRender(props);

    expect(wrapper.find('div').text()).toEqual('error');
  });

  it('should remove subscription if the component is unmounted', async () => {
    const wrapper = await shallowRender();
    const instance = wrapper.instance();

    jest.spyOn(instance, 'unsubscribe');

    wrapper.unmount();

    expect(instance.unsubscribe).toHaveBeenCalledTimes(1);
    expect(URL.revokeObjectURL).toHaveBeenCalledTimes(1);
  });

  it('should render a placeholder while the src is loading', async () => {
    const fileState: UploadingFileState = {
      ...defaultFileState,
      progress: 0.5,
      status: 'uploading',
    };

    const props = {
      ...defaultProps,
      mediaClient: setup(createFileStateSubject(fileState)),
    };
    const wrapper = await shallowRender(props);

    expect(wrapper.find('div').text()).toEqual('loading');
  });

  it('should NOT trigger subscribe if new dimension is smaller than the current used', async () => {
    const mediaClient = setup();
    const props = {
      ...defaultProps,
      mediaClient,
    };
    const wrapper = await shallowRender(props);
    expect(mediaClient.file.getFileState).toHaveBeenCalledTimes(1);

    wrapper.setProps({ apiConfig: { width: 90, height: 90 } });
    await wrapper.update();

    expect(mediaClient.file.getFileState).toHaveBeenCalledTimes(1);
  });

  it('should NOT trigger subscribe if new dimension is smaller than the current used', async () => {
    const mediaClient = setup();
    const props = {
      ...defaultProps,
      mediaClient,
    };
    const wrapper = await shallowRender(props);
    expect(mediaClient.file.getFileState).toHaveBeenCalledTimes(1);

    wrapper.setProps({ identifier: defaultProps.identifier });
    await wrapper.update();

    expect(mediaClient.file.getFileState).toHaveBeenCalledTimes(1);
  });

  it('should trigger subscribe if new dimension is smaller than the current used', async () => {
    const mediaClient = setup();
    const props = {
      ...defaultProps,
      mediaClient,
    };
    const wrapper = await shallowRender(props);
    expect(mediaClient.file.getFileState).toHaveBeenCalledTimes(1);

    wrapper.setProps({ apiConfig: { width: 110, height: 110 } });
    await wrapper.update();

    expect(mediaClient.file.getFileState).toHaveBeenCalledTimes(2);
  });

  it('should trigger subscribe if mediaClient has changed', async () => {
    const mediaClient = setup();
    const props = {
      ...defaultProps,
      mediaClient,
    };
    const wrapper = await shallowRender(props);
    expect(mediaClient.file.getFileState).toHaveBeenCalledTimes(1);

    const dummyMediaClient = setup();
    wrapper.setProps({ mediaClient: dummyMediaClient });
    await wrapper.update();

    // Called dummyMediaClient.file.getFileState - means subscribe was called again.
    expect(dummyMediaClient.file.getFileState).toHaveBeenCalledTimes(1);
  });

  it('should render preview image based on create object url output', async () => {
    const img = 'img.jpg';
    jest.spyOn(URL as any, 'createObjectURL').mockReturnValue(img);
    const fileState: ProcessedFileState = {
      ...defaultFileState,
      preview: Promise.resolve({ value: new Blob() }),
    };
    const mediaClient = setup(createFileStateSubject(fileState));
    const props = {
      ...defaultProps,
      mediaClient,
    };
    const wrapper = await shallowRender(props);

    expect(mediaClient.getImage).toHaveBeenCalledTimes(0);
    expect(wrapper.find('img').props().src).toEqual(img);
  });

  it('should render preview image based on getImage output', async () => {
    const img = 'img2.jpg';
    jest.spyOn(URL as any, 'createObjectURL').mockReturnValue(img);
    const mediaClient = setup();
    const props = {
      ...defaultProps,
      mediaClient,
    };
    asMock(mediaClient.getImage).mockReturnValue(
      new Blob([], { type: 'image/jpeg' }),
    );
    const wrapper = await shallowRender(props);

    expect(mediaClient.getImage).toHaveBeenCalledTimes(1);
    expect(wrapper.find('img').props().src).toEqual(img);
  });
});
