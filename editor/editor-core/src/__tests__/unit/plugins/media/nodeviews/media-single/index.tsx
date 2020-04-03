import React from 'react';

jest.mock('../../../../../../plugins/media/nodeviews/mediaNodeUpdater');

import { MediaNodeUpdater } from '../../../../../../plugins/media/nodeviews/mediaNodeUpdater';

import { mount, ReactWrapper } from 'enzyme';
import { EditorView } from 'prosemirror-view';
import { Image } from '@atlaskit/editor-test-helpers/jsdom-fixtures';
import { fakeMediaProvider } from '@atlaskit/editor-test-helpers/media-provider';
import randomId from '@atlaskit/editor-test-helpers/random-id';
import {
  mediaSingle,
  media,
} from '@atlaskit/editor-test-helpers/schema-builder';
import { defaultSchema, MediaAttributes } from '@atlaskit/adf-schema';
import { stateKey as mediaStateKey } from '../../../../../../plugins/media/pm-plugins/plugin-key';
import { MediaState } from '../../../../../../plugins/media/types';
import { MediaProvider } from '@atlaskit/editor-common/provider-factory';
import MediaSingle, {
  ReactMediaSingleNode,
} from '../../../../../../plugins/media/nodeviews/mediaSingle';
import Media from '../../../../../../plugins/media/nodeviews/media';
import {
  ProviderFactory,
  MediaSingle as MediaSingleWrapper,
  ContextIdentifierProvider,
} from '@atlaskit/editor-common';
import { EventDispatcher } from '../../../../../../event-dispatcher';
import { PortalProviderAPI } from '../../../../../../ui/PortalProvider';
import { stateKey as SelectionChangePluginKey } from '../../../../../../plugins/base/pm-plugins/react-nodeview';
import { MediaOptions } from '../../../../../../plugins/media/types';
import ResizableMediaSingle from '../../../../../../plugins/media/ui/ResizableMediaSingle';
import {
  nextTick,
  asMock,
  asMockReturnValue,
} from '@atlaskit/media-test-helpers';
import { MediaPluginState } from '../../../../../../plugins/media/pm-plugins/types';

const testCollectionName = `media-plugin-mock-collection-${randomId()}`;

const getFreshMediaProvider = () =>
  fakeMediaProvider({
    collectionName: testCollectionName,
  });

const getLastMediaNodeUpdaterMockInstance = (): MediaNodeUpdater => {
  const instances = (MediaNodeUpdater as any).instances;
  return instances[instances.length - 1];
};

describe('nodeviews/mediaSingle', () => {
  let pluginState: MediaPluginState;
  const mediaNodeAttrs = {
    id: 'foo',
    type: 'file',
    collection: 'collection',
    width: 250,
    height: 250,
  };

  const mediaNode = media(mediaNodeAttrs as MediaAttributes)();
  const externalMediaNode = media({
    type: 'external',
    url: 'http://example.com/1920x1080.jpg',
  })();

  const view = {
    state: {
      selection: {
        from: 0,
        to: 0,
      },
    },
  } as EditorView;
  const eventDispatcher = {} as EventDispatcher;
  const getPos = jest.fn();
  const mediaOptions: MediaOptions = {
    allowResizing: false,
  };
  const portalProviderAPI: PortalProviderAPI = {
    render(component: () => React.ReactChild | null) {
      component();
    },
    remove() {},
  } as any;
  let mediaProvider: Promise<MediaProvider>;
  let providerFactory: ProviderFactory;
  let contextIdentifierProvider: Promise<ContextIdentifierProvider>;
  let getDimensions: any;

  afterEach(() => {
    jest.resetModules();
    jest.resetAllMocks();
  });

  beforeEach(() => {
    asMock(MediaNodeUpdater).mockReset();

    mediaProvider = getFreshMediaProvider();
    contextIdentifierProvider = Promise.resolve({
      containerId: '',
      objectId: '',
    });
    providerFactory = ProviderFactory.create({ mediaProvider });
    pluginState = ({
      getMediaNodeStateStatus: () => 'ready',
      getMediaNodeState: () => {
        return ({ state: 'ready' } as any) as MediaState;
      },
      mediaNodes: [],
      options: {
        ...mediaOptions,
        providerFactory: providerFactory,
      },
      handleMediaNodeMount: () => {},
      handleMediaNodeUnmount: () => {},
      updateElement: jest.fn(),
      updateMediaNodeAttrs: jest.fn(),
      isMobileUploadCompleted: () => undefined,
      addPendingTask: jest.fn(),
    } as any) as MediaPluginState;

    getDimensions = (wrapper: ReactWrapper) => (): Promise<any> => {
      if ((wrapper.props() as any).node.firstChild.attrs.type === 'external') {
        return Promise.resolve(false);
      }
      return Promise.resolve({
        id: 'foo',
        height: 100,
        width: 100,
      });
    };

    jest.spyOn(mediaStateKey, 'getState').mockImplementation(() => pluginState);
    jest.spyOn(SelectionChangePluginKey, 'getState').mockImplementation(() => ({
      subscribe: jest.fn(),
      unsubscribe: jest.fn(),
    }));
  });

  describe('external images', () => {
    let jsdomImage: any;
    const mediaSingleNode = mediaSingle()(externalMediaNode);
    let wrapper: ReactWrapper<MediaSingle['props'], MediaSingle['state']>;

    beforeAll(() => {
      // @ts-ignore
      jsdomImage = window.Image;

      // @ts-ignore
      window.Image = Image;
    });

    afterAll(() => {
      // @ts-ignore
      window.Image = jsdomImage;
    });

    beforeEach(() => {
      wrapper = mount(
        <MediaSingle
          view={view}
          eventDispatcher={eventDispatcher}
          node={mediaSingleNode(defaultSchema)}
          lineLength={680}
          getPos={getPos}
          width={123}
          selected={() => 1}
          mediaOptions={mediaOptions}
          mediaProvider={mediaProvider}
          contextIdentifierProvider={contextIdentifierProvider}
          mediaPluginState={pluginState}
        />,
      );
    });

    afterEach(() => {
      wrapper.unmount();
    });

    it('sets "onExternalImageLoaded" for external images', () => {
      expect(wrapper.find(Media).props().onExternalImageLoaded).toBeDefined();
    });

    it('passes url prop for external images', () => {
      expect(wrapper.find(Media).props().url).toEqual(
        'http://example.com/1920x1080.jpg',
      );
    });

    it('loads external dimensions into component state', () => {
      expect(wrapper.state().width).toBe(1920);
      expect(wrapper.state().height).toBe(1080);
    });

    it('passes external dimensions to MediaSingle', () => {
      expect(wrapper.find(MediaSingleWrapper).props().width).toBe(1920);
      expect(wrapper.find(MediaSingleWrapper).props().height).toBe(1080);
    });

    it('passes external dimensions to ResizableMediaSingle', () => {
      const wrapperWithResizing = mount(
        <MediaSingle
          view={view}
          eventDispatcher={eventDispatcher}
          node={mediaSingleNode(defaultSchema)}
          lineLength={680}
          getPos={getPos}
          width={123}
          selected={() => 1}
          mediaOptions={{
            ...mediaOptions,
            allowResizing: true,
          }}
          mediaProvider={mediaProvider}
          contextIdentifierProvider={contextIdentifierProvider}
          mediaPluginState={pluginState}
        />,
      );

      expect(wrapperWithResizing.find(ResizableMediaSingle).props().width).toBe(
        1920,
      );
      expect(
        wrapperWithResizing.find(ResizableMediaSingle).props().height,
      ).toBe(1080);

      wrapperWithResizing.unmount();
    });
  });

  // TODO [MS-2373]
  it.skip('calls upload media external', async () => {
    const mediaNodeAttrs = {
      id: 'foo',
      type: 'external',
      collection: 'collection',
    };

    const mediaNode = media(mediaNodeAttrs as MediaAttributes)();
    const mediaSingleNodeWithoutDimensions = mediaSingle()(mediaNode);

    const wrapper = mount(
      <MediaSingle
        view={view}
        eventDispatcher={eventDispatcher}
        node={mediaSingleNodeWithoutDimensions(defaultSchema)}
        lineLength={680}
        getPos={getPos}
        width={123}
        selected={() => 1}
        mediaOptions={mediaOptions}
        mediaProvider={mediaProvider}
        contextIdentifierProvider={contextIdentifierProvider}
        mediaPluginState={pluginState}
      />,
    );

    const instances: MediaNodeUpdater[] = (MediaNodeUpdater as any).instances;
    instances[0].getRemoteDimensions = getDimensions(wrapper);

    await (wrapper.instance() as MediaSingle).componentDidMount();
    expect(instances[0].uploadExternalMedia).toHaveBeenCalledTimes(1);
  });

  it('passes the editor width down as cardDimensions', () => {
    const mediaSingleNode = mediaSingle()(mediaNode);
    const wrapper = mount(
      <MediaSingle
        view={view}
        eventDispatcher={eventDispatcher}
        node={mediaSingleNode(defaultSchema)}
        lineLength={680}
        getPos={getPos}
        width={123}
        selected={() => 1}
        mediaOptions={mediaOptions}
        mediaProvider={mediaProvider}
        contextIdentifierProvider={contextIdentifierProvider}
        mediaPluginState={pluginState}
      />,
    );

    const { cardDimensions } = wrapper.find(Media).props();
    const imageAspectRatio = mediaNodeAttrs.height / mediaNodeAttrs.width;

    expect(cardDimensions.width).toEqual('123px');
    const cardHeight: string = cardDimensions.height as string;

    expect(Number(cardHeight.substring(0, cardHeight.length - 2))).toBeCloseTo(
      123 * imageAspectRatio,
    );
  });

  it('propagates mobile upload progress to Media component', async () => {
    pluginState.mediaOptions = {
      allowMarkingUploadsAsIncomplete: true,
    };
    pluginState.mobileUploadComplete = { foo: false };

    const mediaSingleNode = mediaSingle()(mediaNode);
    const wrapper = mount(
      <MediaSingle
        view={view}
        eventDispatcher={eventDispatcher}
        node={mediaSingleNode(defaultSchema)}
        lineLength={680}
        getPos={getPos}
        width={123}
        selected={() => 1}
        mediaOptions={mediaOptions}
        mediaProvider={mediaProvider}
        contextIdentifierProvider={contextIdentifierProvider}
        mediaPluginState={pluginState}
      />,
    );

    const instances: MediaNodeUpdater[] = (MediaNodeUpdater as any).instances;
    instances[0].getRemoteDimensions = getDimensions(wrapper);

    await (wrapper.instance() as MediaSingle).componentDidMount();
    const { uploadComplete } = wrapper.find(Media).props();
    expect(uploadComplete).toBe(false);
  });

  it('propagates mobile upload complete to Media component', async () => {
    pluginState.mediaOptions = {
      allowMarkingUploadsAsIncomplete: true,
    };
    pluginState.mobileUploadComplete = { foo: true };

    const mediaSingleNode = mediaSingle()(mediaNode);
    const wrapper = mount(
      <MediaSingle
        view={view}
        eventDispatcher={eventDispatcher}
        node={mediaSingleNode(defaultSchema)}
        lineLength={680}
        getPos={getPos}
        width={123}
        selected={() => 1}
        mediaOptions={mediaOptions}
        mediaProvider={mediaProvider}
        contextIdentifierProvider={contextIdentifierProvider}
        mediaPluginState={pluginState}
      />,
    );

    const instances: MediaNodeUpdater[] = (MediaNodeUpdater as any).instances;
    instances[0].getRemoteDimensions = getDimensions(wrapper);

    await (wrapper.instance() as MediaSingle).componentDidMount();
    const { uploadComplete } = wrapper.find(Media).props();
    expect(uploadComplete).toBe(true);
  });

  describe('re-rendering based on offsetLeft', () => {
    const node = mediaSingle()(mediaNode)(defaultSchema);

    it('does not call render if the parent has not offsetLeft changed', () => {
      const nodeView = ReactMediaSingleNode(
        portalProviderAPI,
        eventDispatcher,
        providerFactory,
        mediaOptions,
      )(node, view, getPos);

      const renderMock = jest.fn();
      nodeView.render = renderMock;

      nodeView.ignoreMutation();
      expect(renderMock).not.toBeCalled();
    });

    it('re-renders if the parent offsetLeft changes', () => {
      const nodeView = ReactMediaSingleNode(
        portalProviderAPI,
        eventDispatcher,
        providerFactory,
        mediaOptions,
      )(node, view, getPos);

      const renderMock = jest.fn();
      nodeView.render = renderMock;

      Object.defineProperties(nodeView.dom!, {
        offsetLeft: {
          get: () => 20,
        },
      });

      nodeView.ignoreMutation();
      expect(renderMock).toBeCalled();
    });
  });

  describe('when dimensions are missing on images', () => {
    it('asks media APIs for dimensions when not in ADF and updates it', async () => {
      const mediaNodeAttrs = {
        id: 'foo',
        type: 'file',
        collection: 'collection',
      };

      const mediaNode = media(mediaNodeAttrs as MediaAttributes)();
      const mediaSingleNodeWithoutDimensions = mediaSingle()(mediaNode);

      const wrapper = mount(
        <MediaSingle
          view={view}
          eventDispatcher={eventDispatcher}
          node={mediaSingleNodeWithoutDimensions(defaultSchema)}
          lineLength={680}
          getPos={getPos}
          width={123}
          selected={() => 1}
          mediaOptions={mediaOptions}
          mediaProvider={mediaProvider}
          contextIdentifierProvider={contextIdentifierProvider}
          mediaPluginState={pluginState}
        />,
      );

      (MediaNodeUpdater as any).setMock(
        'getRemoteDimensions',
        getDimensions(wrapper),
      );

      await (wrapper.instance() as any).componentDidMount();

      expect(
        getLastMediaNodeUpdaterMockInstance().updateDimensions,
      ).toHaveBeenCalledWith({
        id: 'foo',
        height: 100,
        width: 100,
      });
    });

    it('does not ask media for dimensions when the image type is external', async () => {
      const mediaNodeAttrs = {
        id: 'foo',
        type: 'external',
        collection: 'collection',
      };

      const mediaNode = media(mediaNodeAttrs as MediaAttributes)();
      const mediaSingleNodeWithoutDimensions = mediaSingle()(mediaNode);

      const wrapper = mount(
        <MediaSingle
          view={view}
          eventDispatcher={eventDispatcher}
          node={mediaSingleNodeWithoutDimensions(defaultSchema)}
          lineLength={680}
          getPos={getPos}
          width={123}
          selected={() => 1}
          mediaOptions={mediaOptions}
          mediaProvider={mediaProvider}
          contextIdentifierProvider={contextIdentifierProvider}
          mediaPluginState={pluginState}
        />,
      );

      const instances: MediaNodeUpdater[] = (MediaNodeUpdater as any).instances;
      instances[0].getRemoteDimensions = getDimensions(wrapper);

      await (wrapper.instance() as MediaSingle).componentDidMount();
      expect(instances[0].updateDimensions).toHaveBeenCalledTimes(0);
    });
  });

  it('should copy node if its collection is different than the current upload one', async () => {
    const mediaNodeAttrs = {
      id: 'node-file-id',
      type: 'file',
      collection: 'node-source-collection',
    };

    const mediaNode = media(mediaNodeAttrs as MediaAttributes)();
    const mediaSingleNodeFromDifferentCollection = mediaSingle()(mediaNode);

    const wrapper = mount(
      <MediaSingle
        view={view}
        eventDispatcher={eventDispatcher}
        node={mediaSingleNodeFromDifferentCollection(defaultSchema)}
        lineLength={680}
        getPos={getPos}
        width={123}
        selected={() => 1}
        mediaOptions={mediaOptions}
        mediaProvider={mediaProvider}
        contextIdentifierProvider={contextIdentifierProvider}
        mediaPluginState={pluginState}
      />,
    );
    const instance = wrapper.instance() as MediaSingle;

    const instances: MediaNodeUpdater[] = (MediaNodeUpdater as any).instances;

    instances[0].hasDifferentContextId &&
      asMockReturnValue(
        instances[0].hasDifferentContextId,
        Promise.resolve(true),
      );

    await instance.componentDidMount();
    expect(instances[0].hasDifferentContextId).toHaveBeenCalled();
    expect(instances[0].copyNode).toHaveBeenCalled();
  });

  it('should set viewMediaClientConfig if mediaProvider changes', async () => {
    const mediaNodeAttrs = {
      id: 'some-id',
      type: 'file',
      collection: 'collection',
    };

    const mediaNode = media(mediaNodeAttrs as MediaAttributes)();
    const mediaSingleNode = mediaSingle()(mediaNode);
    const wrapper = mount(
      <MediaSingle
        view={view}
        eventDispatcher={eventDispatcher}
        node={mediaSingleNode(defaultSchema)}
        lineLength={680}
        getPos={getPos}
        width={123}
        selected={() => 1}
        mediaOptions={mediaOptions}
        contextIdentifierProvider={contextIdentifierProvider}
        mediaPluginState={pluginState}
      />,
    );

    expect(wrapper.state('viewMediaClientConfig')).toBeUndefined();
    wrapper.setProps({ mediaProvider });
    // We need to await to ticks since we await 2 different promises on the UNSAFE_componentWillReceiveProps
    // unfortunately we can't access the real promises here
    await nextTick();
    await nextTick();

    expect(wrapper.state('viewMediaClientConfig')).toBeDefined();
  });

  it('should call updateFileAttrs if mediaProvider changes', async () => {
    const mediaNodeAttrs = {
      id: 'some-id',
      type: 'file',
      collection: 'collection',
    };

    const mediaNode = media(mediaNodeAttrs as MediaAttributes)();
    const mediaSingleNode = mediaSingle()(mediaNode);
    const wrapper = mount(
      <MediaSingle
        view={view}
        eventDispatcher={eventDispatcher}
        node={mediaSingleNode(defaultSchema)}
        lineLength={680}
        getPos={getPos}
        width={123}
        selected={() => 1}
        mediaOptions={mediaOptions}
        contextIdentifierProvider={contextIdentifierProvider}
        mediaPluginState={pluginState}
      />,
    );

    expect(wrapper.state('viewMediaClientConfig')).toBeUndefined();
    wrapper.setProps({ mediaProvider });

    expect(getLastMediaNodeUpdaterMockInstance().updateFileAttrs).toBeCalled();
  });
});
