// NOTE: for the purposes of this test we are mocking MediaNodeUpdater using __mocks__ version
import { defaultSchema } from '@atlaskit/adf-schema';
import { nextTick } from '@atlaskit/editor-test-helpers/next-tick';
import { fakeMediaProvider } from '@atlaskit/editor-test-helpers/media-provider';
import { media, mediaGroup } from '@atlaskit/editor-test-helpers/doc-builder';
import { mount } from 'enzyme';
import { EditorView } from 'prosemirror-view';
import React from 'react';
import MediaGroup from '../../../../../../plugins/media/nodeviews/mediaGroup';
import { MediaNodeUpdater } from '../../../../../../plugins/media/nodeviews/mediaNodeUpdater';
import {
  MediaProvider,
  stateKey as mediaStateKey,
} from '../../../../../../plugins/media/pm-plugins/main';
import { MediaPluginState } from '../../../../../../plugins/media/pm-plugins/types';
import { EditorAppearance } from '../../../../../../types';
jest.mock('../../../../../../utils/', () => ({
  __esModule: true,
  setNodeSelection: jest.fn(),
}));
jest.mock('../../../../../../plugins/media/nodeviews/mediaNodeUpdater');

const MockMediaNodeUpdater = MediaNodeUpdater as jest.Mock<MediaNodeUpdater>;

describe('nodeviews/mediaGroup', () => {
  let pluginState: MediaPluginState;
  let mediaProvider: Promise<MediaProvider>;

  const mediaNode = media({
    id: 'foo',
    type: 'file',
    collection: 'collection',
  })();

  const mediaNode2 = media({
    id: 'foo2',
    type: 'file',
    collection: 'collection',
  })();

  const externalMediaNode = media({
    type: 'external',
    url: 'some-url',
  })();

  const view = {} as EditorView;

  beforeEach(async () => {
    mediaProvider = fakeMediaProvider();
    pluginState = {} as MediaPluginState;
    pluginState.getMediaOptions = () => ({} as any);
    pluginState.mediaGroupNodes = {};
    pluginState.handleMediaNodeRemoval = () => {};
    pluginState.mediaClientConfig = (await mediaProvider).viewMediaClientConfig;
    jest.spyOn(mediaStateKey, 'getState').mockImplementation(() => pluginState);
    MockMediaNodeUpdater.mockReset(); // part of mocked class API, not original
  });

  const setup = async ({
    nodes = [mediaNode],
    propOverrides = {},
  }: {
    nodes?: any[];
    propOverrides?: any;
  }) => {
    pluginState.getMediaOptions = () => ({ customMediaPicker: {} } as any);

    const mediaGroupNode = mediaGroup(...nodes);
    const getPos = jest.fn().mockReturnValue(1);
    const props = {
      view: view,
      node: mediaGroupNode(defaultSchema),
      getPos,
      selected: null,
      editorAppearance: 'full-page' as EditorAppearance,
      mediaProvider,
      headPos: 1,
      anchorPos: 1,
      mediaOptions: {},
      ...propOverrides,
    };

    const wrapper = mount(<MediaGroup {...props} />);

    await nextTick();

    return {
      wrapper,
      getPos,
    };
  };

  it('should re-render for custom media picker with no thumb', () => {
    pluginState.getMediaOptions = () => ({ customMediaPicker: {} } as any);

    const mediaGroupNode = mediaGroup(mediaNode);
    const props = {
      view: view,
      node: mediaGroupNode(defaultSchema),
      getPos: () => 1,
      selected: null,
      editorAppearance: 'full-page' as EditorAppearance,
      mediaProvider,
      headPos: 1,
      anchorPos: 1,
      mediaOptions: {},
    };

    const wrapper = mount(<MediaGroup {...props} />);

    expect(wrapper.length).toEqual(1);
  });

  it('should get the position on component click', async () => {
    const { wrapper, getPos } = await setup({});
    const calledTimes = getPos.mock.calls.length;
    wrapper.find('AsyncCard').prop('onClick')!({} as any);
    expect(getPos).toHaveBeenCalledTimes(calledTimes + 1);
  });

  describe('Selection range with multiple cards', () => {
    let wrapper: any;

    beforeEach(async () => {
      const { wrapper: nodeWrapper } = await setup({
        nodes: [mediaNode, mediaNode2],
      });
      wrapper = nodeWrapper;
    });

    const getCards = (wrapper: any) => [
      wrapper.find('AsyncCard').at(0),
      wrapper.find('AsyncCard').at(1),
    ];

    it('clicking first card will select first card', () => {
      wrapper.setProps({ anchorPos: 2, headPos: 3 });

      const [card1, card2] = getCards(wrapper);
      expect(card1.props().selected).toBeTruthy();
      expect(card2.props().selected).toBeFalsy();
    });

    it('clicking second card will select second card', () => {
      wrapper.setProps({ anchorPos: 3, headPos: 4 });

      const [card1, card2] = getCards(wrapper);
      expect(card1.props().selected).toBeFalsy();
      expect(card2.props().selected).toBeTruthy();
    });

    it('selecting range around cards will select both cards', () => {
      wrapper.setProps({ anchorPos: 0, headPos: 6 });

      const [card1, card2] = getCards(wrapper);
      expect(card1.props().selected).toBeTruthy();
      expect(card2.props().selected).toBeTruthy();
    });
  });

  describe('MediaNodeUpdater', () => {
    const instances: MediaNodeUpdater[] = (MediaNodeUpdater as any).instances;

    it('should create a MediaNodeUpdater for each child node', async () => {
      await setup({});

      expect(instances).toHaveLength(1);
      expect(instances[0].copyNode).toHaveBeenCalled();
    });

    it('should not create a MediaNodeUpdater when node is external', async () => {
      await setup({ nodes: [externalMediaNode] });

      expect(instances).toHaveLength(0);
    });

    it('should call MediaNodeUpdater.updateContextId when node contextId is not found', async () => {
      (MediaNodeUpdater as any).setMock(
        'getNodeContextId',
        jest.fn().mockReturnValue(undefined),
      );
      await setup({});

      expect(instances[0].updateContextId).toHaveBeenCalled();
    });

    it('should only call MediaNodeUpdater.copyNode when node from different collection', async () => {
      (MediaNodeUpdater as any).setMock(
        'hasDifferentContextId',
        jest.fn().mockResolvedValue(false),
      );
      await setup({});

      expect(instances).toHaveLength(1);
      expect(instances[0].copyNode).not.toHaveBeenCalled();
    });

    it('should update node attrs when props change', async () => {
      const { wrapper } = await setup({});

      wrapper.setProps({
        selected: 1,
      });

      expect(instances[1].updateFileAttrs).toHaveBeenCalled();
      expect(instances).toHaveLength(2);
    });
  });

  afterEach(() => {
    jest.resetAllMocks();
  });
});
