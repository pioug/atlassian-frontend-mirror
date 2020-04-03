// NOTE: for the purposes of this test we are mocking MediaNodeUpdater using __mocks__ version
import { MediaPluginState } from '../../../../../../plugins/media/pm-plugins/types';

jest.mock('../../../../../../plugins/media/nodeviews/mediaNodeUpdater');
// NOTE: Mocking the setNodeSelection function
import * as Utils from '../../../../../../utils/';
(Utils as any).setNodeSelection = jest.fn();
import React from 'react';
import { mount } from 'enzyme';
import { EditorView } from 'prosemirror-view';
import { fakeMediaProvider } from '@atlaskit/editor-test-helpers/media-provider';
import {
  mediaGroup,
  media,
} from '@atlaskit/editor-test-helpers/schema-builder';
import { nextTick } from '@atlaskit/media-test-helpers';
import { defaultSchema } from '@atlaskit/adf-schema';
import {
  stateKey as mediaStateKey,
  MediaProvider,
} from '../../../../../../plugins/media/pm-plugins/main';
import MediaGroup from '../../../../../../plugins/media/nodeviews/mediaGroup';
import { EditorAppearance } from '../../../../../../types';
import { MediaNodeUpdater } from '../../../../../../plugins/media/nodeviews/mediaNodeUpdater';

const MockMediaNodeUpdater = MediaNodeUpdater as jest.Mock<MediaNodeUpdater>;

describe('nodeviews/mediaGroup', () => {
  let pluginState: MediaPluginState;
  let mediaProvider: Promise<MediaProvider>;

  const mediaNode = media({
    id: 'foo',
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

  const setup = async (node: any) => {
    pluginState.getMediaOptions = () => ({ customMediaPicker: {} } as any);

    const mediaGroupNode = mediaGroup(node);
    const getPos = jest.fn().mockReturnValue(1);
    const props = {
      view: view,
      node: mediaGroupNode(defaultSchema),
      getPos,
      selected: null,
      editorAppearance: 'full-page' as EditorAppearance,
      mediaProvider,
    };

    const wrapper = mount(<MediaGroup {...props} />);

    await nextTick();
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
    };

    const wrapper = mount(<MediaGroup {...props} />);

    expect(wrapper.length).toEqual(1);
  });

  it('should get the position on component click', async () => {
    const { wrapper, getPos } = await setup(mediaNode);
    const calledTimes = getPos.mock.calls.length;
    wrapper.find('AsyncCard').prop('onClick')!({} as any);
    expect(getPos).toHaveBeenCalledTimes(calledTimes + 1);
  });

  describe('MediaNodeUpdater', () => {
    const instances: MediaNodeUpdater[] = (MediaNodeUpdater as any).instances;

    it('should create a MediaNodeUpdater for each child node', async () => {
      await setup(mediaNode);

      expect(instances).toHaveLength(1);
      expect(instances[0].copyNode).toHaveBeenCalled();
    });

    it('should not create a MediaNodeUpdater when node is external', async () => {
      await setup(externalMediaNode);

      expect(instances).toHaveLength(0);
    });

    it('should call MediaNodeUpdater.updateContextId when node contextId is not found', async () => {
      (MediaNodeUpdater as any).setMock(
        'getNodeContextId',
        jest.fn().mockReturnValue(undefined),
      );
      await setup(mediaNode);

      expect(instances[0].updateContextId).toHaveBeenCalled();
    });

    it('should only call MediaNodeUpdater.copyNode when node from different collection', async () => {
      (MediaNodeUpdater as any).setMock(
        'hasDifferentContextId',
        jest.fn().mockResolvedValue(false),
      );
      await setup(mediaNode);

      expect(instances).toHaveLength(1);
      expect(instances[0].copyNode).not.toHaveBeenCalled();
    });

    it('should update node attrs when props change', async () => {
      const { wrapper } = await setup(mediaNode);

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
