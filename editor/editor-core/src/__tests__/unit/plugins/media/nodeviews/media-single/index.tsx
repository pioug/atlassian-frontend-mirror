import React from 'react';

jest.mock('../../../../../../plugins/media/nodeviews/mediaNodeUpdater');

import { MediaNodeUpdater } from '../../../../../../plugins/media/nodeviews/mediaNodeUpdater';

import { mount, shallow, ReactWrapper } from 'enzyme';
import { EditorView } from 'prosemirror-view';
import { Image } from '@atlaskit/editor-test-helpers/jsdom-fixtures';
import { fakeMediaProvider } from '@atlaskit/editor-test-helpers/media-provider';
import randomId from '@atlaskit/editor-test-helpers/random-id';
import {
  mediaSingle,
  media,
  RefsNode,
  caption,
} from '@atlaskit/editor-test-helpers/doc-builder';
import {
  defaultSchema,
  getSchemaBasedOnStage,
  MediaAttributes,
} from '@atlaskit/adf-schema';
import { stateKey as mediaStateKey } from '../../../../../../plugins/media/pm-plugins/plugin-key';
import { MediaState } from '../../../../../../plugins/media/types';
import { MediaProvider } from '@atlaskit/editor-common/provider-factory';
import MediaSingle, {
  ReactMediaSingleNode,
} from '../../../../../../plugins/media/nodeviews/mediaSingle';
import {
  ProviderFactory,
  ContextIdentifierProvider,
} from '@atlaskit/editor-common';
import { EventDispatcher } from '../../../../../../event-dispatcher';
import { PortalProviderAPI } from '../../../../../../ui/PortalProvider';
import { stateKey as SelectionChangePluginKey } from '../../../../../../plugins/base/pm-plugins/react-nodeview';
import { MediaOptions } from '../../../../../../plugins/media/types';
import {
  nextTick,
  asMock,
  asMockReturnValue,
} from '@atlaskit/media-test-helpers';
import { MediaPluginState } from '../../../../../../plugins/media/pm-plugins/types';
import { MediaSingleNodeViewProps } from '../../../../../../plugins/media/nodeviews/types';
import { flushPromises } from '../../../../../__helpers/utils';

const testCollectionName = `media-plugin-mock-collection-${randomId()}`;

const getFreshMediaProvider = () =>
  fakeMediaProvider({
    collectionName: testCollectionName,
  });

const getLastMediaNodeUpdaterMockInstance = (): MediaNodeUpdater => {
  const instances = (MediaNodeUpdater as any).instances;
  return instances[instances.length - 1];
};

const getHandleExternalMedia = (
  mediaNodeUpdaterMockInstance: MediaNodeUpdater,
  mediaSingleNodeInstance: ReactWrapper,
) => {
  const { MediaNodeUpdater: OriginalMediaNodeUpdater } = jest.requireActual(
    '../../../../../../plugins/media/nodeviews/mediaNodeUpdater',
  );
  return new OriginalMediaNodeUpdater(
    mediaSingleNodeInstance.props(),
  ).handleExternalMedia.bind(mediaNodeUpdaterMockInstance);
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
        $anchor: {
          pos: 0,
        },
        $head: {
          pos: 20,
        },
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

  const mountNode = (
    node: RefsNode,
    editorView = view,
    dummyEventDispatcher = eventDispatcher,
    lineLength = 680,
    getNodePos = getPos,
    width = 123,
    selected = () => 1,
    editorMediaOptions = mediaOptions,
    editorMediaProvider = mediaProvider,
    dummyContextIdentifierProvider = contextIdentifierProvider,
    mediaPluginState = pluginState,
    forwardRef = () => {},
  ) => {
    return mount(
      <MediaSingle
        view={editorView}
        eventDispatcher={dummyEventDispatcher}
        node={node}
        lineLength={lineLength}
        getPos={getNodePos}
        width={width}
        selected={selected}
        mediaOptions={editorMediaOptions}
        mediaProvider={editorMediaProvider}
        contextIdentifierProvider={dummyContextIdentifierProvider}
        mediaPluginState={mediaPluginState}
        forwardRef={forwardRef}
      />,
    );
  };

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
          forwardRef={() => {}}
        />,
      );
    });

    afterEach(() => {
      wrapper.unmount();
    });
  });

  // TODO [MS-2373]
  it('calls upload media external', async () => {
    const mediaNodeAttrs = {
      id: 'foo',
      type: 'external',
      collection: 'collection',
      __external: true,
      url: 'http://www.example.com/image.jpg',
    };

    const mediaNode = media(mediaNodeAttrs as MediaAttributes)();
    const mediaSingleNodeWithoutDimensions = mediaSingle()(mediaNode);

    const wrapper = mountNode(mediaSingleNodeWithoutDimensions(defaultSchema));
    const instances: MediaNodeUpdater[] = (MediaNodeUpdater as any).instances;
    instances[0].getRemoteDimensions = getDimensions(wrapper);
    instances[0].uploadExternalMedia = jest.fn(() => Promise.resolve());
    instances[0].isMediaBlobUrl = jest.fn(() => false);
    instances[0].handleExternalMedia = getHandleExternalMedia(
      instances[0],
      wrapper,
    );
    await flushPromises();
    expect(instances[0].uploadExternalMedia).toHaveBeenCalledTimes(1);
  });

  describe('re-rendering based on offsetLeft', () => {
    const node = mediaSingle()(mediaNode)(defaultSchema);

    it('does not call render if the parent has not offsetLeft changed', () => {
      const nodeView = ReactMediaSingleNode(
        portalProviderAPI,
        eventDispatcher,
        providerFactory,
        undefined,
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
        undefined,
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

  describe('updating based on child count', () => {
    const node = mediaSingle()(mediaNode)(defaultSchema);

    it('does not update if the childCount has not changed', () => {
      const nodeView = ReactMediaSingleNode(
        portalProviderAPI,
        eventDispatcher,
        providerFactory,
        undefined,
        mediaOptions,
      )(node, view, getPos);

      // ensure that if it falls through to the default it returns false
      nodeView['_viewShouldUpdate'] = jest.fn((_node) => false);

      expect(nodeView.viewShouldUpdate(node)).toBeFalsy();
    });

    it('updates if the childCount has changed', () => {
      const nodeView = ReactMediaSingleNode(
        portalProviderAPI,
        eventDispatcher,
        providerFactory,
        undefined,
        mediaOptions,
      )(node, view, getPos);

      // need to get stage 0 schema of media + captions
      // when captions is in full schema, use defaultSchema
      const newNode = mediaSingle()(mediaNode, caption('hi'))(
        getSchemaBasedOnStage('stage0'),
      );

      // ensure that if it falls through to the default it returns false
      nodeView['_viewShouldUpdate'] = jest.fn((_node) => false);

      expect(nodeView.viewShouldUpdate(newNode)).toBeTruthy();
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

      const wrapper = mountNode(
        mediaSingleNodeWithoutDimensions(defaultSchema),
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
        url: '',
      };

      const mediaNode = media(mediaNodeAttrs as MediaAttributes)();
      const mediaSingleNodeWithoutDimensions = mediaSingle()(mediaNode);

      const wrapper = mountNode(
        mediaSingleNodeWithoutDimensions(defaultSchema),
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

    const wrapper = mountNode(
      mediaSingleNodeFromDifferentCollection(defaultSchema),
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
    const wrapper = mountNode(mediaSingleNode(defaultSchema));

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
    const wrapper = mountNode(mediaSingleNode(defaultSchema));

    expect(wrapper.state('viewMediaClientConfig')).toBeUndefined();
    wrapper.setProps({ mediaProvider });

    expect(getLastMediaNodeUpdaterMockInstance().updateFileAttrs).toBeCalled();
  });
  describe('selected state for mediaSingle', () => {
    const node = mediaSingle()(mediaNode)(defaultSchema);
    const createView = (anchorPos: number, headPos: number) =>
      ({
        state: {
          selection: {
            from: 0,
            to: 0,
            $anchor: {
              pos: anchorPos,
            },
            $head: {
              pos: headPos,
            },
          },
        },
      } as EditorView);

    it('returns true when media is selected', () => {
      const getPos = () => 12;
      const testView = createView(12, 15);
      const nodeView = ReactMediaSingleNode(
        portalProviderAPI,
        eventDispatcher,
        providerFactory,
        undefined,
        mediaOptions,
      )(node, testView, getPos);

      expect(nodeView.isNodeSelected).toBeTruthy();
    });

    it('returns true when a range is selected around media', () => {
      const getPos = () => 12;
      const testView = createView(12, 15);
      const nodeView = ReactMediaSingleNode(
        portalProviderAPI,
        eventDispatcher,
        providerFactory,
        undefined,
        mediaOptions,
      )(node, testView, getPos);

      expect(nodeView.isNodeSelected).toBeTruthy();
    });

    it('returns false when selection is outside media', () => {
      const getPos = () => 12;
      const testView = createView(9, 12);
      const nodeView = ReactMediaSingleNode(
        portalProviderAPI,
        eventDispatcher,
        providerFactory,
        undefined,
        mediaOptions,
      )(node, testView, getPos);

      expect(nodeView.isNodeSelected).toBeTruthy();
    });
    it('pass isNodeSelected to mediaSingleNode', () => {
      const getPos = () => 12;
      const testView = createView(9, 12);
      const nodeView = ReactMediaSingleNode(
        portalProviderAPI,
        eventDispatcher,
        providerFactory,
        undefined,
        mediaOptions,
      )(node, testView, getPos);
      const mediaSingleNodeSelectedProp = shallow(
        nodeView.render({} as MediaSingleNodeViewProps, () => {}),
      )
        .props()
        .render({ width: 20, mediaPluginState: {} }).props.selected;

      expect(mediaSingleNodeSelectedProp).toEqual(nodeView.isNodeSelected);
    });
  });
});
