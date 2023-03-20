import { mountWithIntl } from '@atlaskit/editor-test-helpers/enzyme';
import { Filmstrip } from '@atlaskit/media-filmstrip/filmstrip';
import { MediaFeatureFlags } from '@atlaskit/media-common';
import { Node as PMNode } from 'prosemirror-model';
import { EditorView } from 'prosemirror-view';
import React from 'react';
import { MediaProvider, stateKey } from '../../pm-plugins/main';
import MediaGroup from '../mediaGroup';
import { MediaPluginState } from '../../pm-plugins/types';

type PropsForeachCallback = (node: any, offset: number, index: number) => void;

export const createMediaProvider = async (): Promise<MediaProvider> =>
  ({} as MediaProvider);

const generateNodeProp = () =>
  ({
    nodeSize: 3,
    attrs: {},
    firstChild: { attrs: {} },
    forEach() {},
  } as unknown as PMNode<any>);

export const getMediaGroupProps = () => ({
  view: {
    state: { selection: { $anchor: { pos: 1 }, $head: { pos: 5 } } },
  } as EditorView<any>,
  node: generateNodeProp(),
  mediaProvider: createMediaProvider(),
  selected: null,
  getPos: jest.fn(() => 99),
  anchorPos: 1,
  headPos: 1,
  mediaOptions: {},
});

jest.mock('../mediaNodeView/media', () => () => null);

jest.mock('../../pm-plugins/plugin-key', () => ({
  stateKey: {
    getState: () => ({ mediaClientConfig: {} }),
  },
}));

jest.mock('../mediaNodeUpdater', () => ({
  MediaNodeUpdater: jest.fn(() => ({
    updateFileAttrs: jest.fn(),
    updateContextId: jest.fn(),
    getRemoteDimensions: jest.fn(),
    getCurrentContextId: jest.fn(),
    isNodeFromDifferentCollection: jest.fn(),
    getNodeContextId: jest.fn(),
    hasDifferentContextId: jest.fn(),
    updateNodeAttrs: jest.fn(),
  })),
}));

const pluginState = {} as MediaPluginState;
pluginState.handleMediaGroupUpdate = jest.fn();
pluginState.handleMediaNodeRemoval = jest.fn();

jest.spyOn(stateKey, 'getState').mockImplementation(() => pluginState);

describe('mediaGroup', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('does not update file attrs for props change if copy/paste is disabled', async () => {
    const wrapper = mountWithIntl(
      <MediaGroup {...getMediaGroupProps()} isCopyPasteEnabled={false} />,
    );

    const mediaGroup = wrapper
      .findWhere((el) => el.name() === 'MediaGroup')
      .instance();
    const updateNodeAttrs = jest.spyOn(mediaGroup as any, 'updateNodeAttrs');

    wrapper.setProps({
      mediaProvider: createMediaProvider(),
    });

    expect(updateNodeAttrs).not.toHaveBeenCalled();
  });

  test('should pass media feature flags to Filmstrip', () => {
    const featureFlags: MediaFeatureFlags = {};
    const wrapper = mountWithIntl(
      <MediaGroup
        {...{
          ...getMediaGroupProps(),
          mediaOptions: {
            featureFlags,
          },
        }}
      />,
    );
    expect(wrapper.find(Filmstrip).props().featureFlags).toEqual(featureFlags);
  });

  describe('MediaPluginState node update', () => {
    const createNodeList = () => [
      { attrs: { id: 1, someAttr: 'this is an attr for node 1' } },
      { attrs: { id: 2, someAttr: 'this is an attr for node 2' } },
    ];
    const createNodeForeach =
      (items: any[]) => (callback: PropsForeachCallback) => {
        items.forEach((item, offset) => callback(item, offset, offset));
      };

    test('updates file attrs for props change', async () => {
      const props = getMediaGroupProps();
      const nodes = createNodeList();
      props.node.forEach = createNodeForeach(nodes);

      const wrapper = mountWithIntl(<MediaGroup {...props} />);

      const mediaGroup = wrapper
        .findWhere((el) => el.name() === 'MediaGroup')
        .instance();
      const updateNodeAttrs = jest.spyOn(mediaGroup as any, 'updateNodeAttrs');

      wrapper.setProps({
        mediaProvider: createMediaProvider(),
      });

      expect(updateNodeAttrs).toHaveBeenCalledTimes(2);
    });
  });
});
