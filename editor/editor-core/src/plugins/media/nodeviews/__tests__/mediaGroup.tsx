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
pluginState.setMediaGroupNode = jest.fn();
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
    const createGetPosResults = (initPos: number, items: any[]) =>
      items.map((_item, index) => initPos + index + 1);

    const getInputGetPos = (callNo: number) =>
      (pluginState.setMediaGroupNode as jest.Mock).mock.calls[callNo - 1][1];

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

    test('updates the list of media group nodes when mounted', () => {
      const props = getMediaGroupProps();
      const nodes = createNodeList();
      const pos = createGetPosResults(props.getPos(), nodes);
      props.node.forEach = createNodeForeach(nodes);

      mountWithIntl(<MediaGroup {...props} />);

      expect(pluginState.setMediaGroupNode).toHaveBeenCalledTimes(2);

      let callNo = 1;
      expect(pluginState.setMediaGroupNode).toHaveBeenNthCalledWith(
        callNo,
        nodes[callNo - 1],
        expect.any(Function),
      );

      expect(getInputGetPos(callNo)()).toBe(pos[callNo - 1]);

      callNo = 2;
      expect(pluginState.setMediaGroupNode).toHaveBeenNthCalledWith(
        callNo,
        nodes[callNo - 1],
        expect.any(Function),
      );

      expect(getInputGetPos(callNo)()).toBe(pos[callNo - 1]);
    });

    test('updates the list of media group nodes when node count have changed', () => {
      const props = getMediaGroupProps();
      const nodes = createNodeList();
      props.node.forEach = createNodeForeach(nodes);

      const component = mountWithIntl(<MediaGroup {...props} />);

      const newNodes = [...nodes, { attrs: { id: 3 } }];
      const pos = createGetPosResults(props.getPos(), newNodes);

      // Should update if the node list has a new reference.
      props.node = generateNodeProp();
      props.node.forEach = createNodeForeach(newNodes);
      component.setProps(props);

      expect(pluginState.setMediaGroupNode).toHaveBeenCalledTimes(5);

      expect(pluginState.setMediaGroupNode).toHaveBeenNthCalledWith(
        1,
        nodes[0],
        expect.any(Function),
      );
      expect(getInputGetPos(1)()).toBe(pos[0]);

      expect(pluginState.setMediaGroupNode).toHaveBeenNthCalledWith(
        2,
        nodes[1],
        expect.any(Function),
      );
      expect(getInputGetPos(2)()).toBe(pos[1]);

      expect(pluginState.setMediaGroupNode).toHaveBeenNthCalledWith(
        3,
        newNodes[0],
        expect.any(Function),
      );
      expect(getInputGetPos(3)()).toBe(pos[0]);

      expect(pluginState.setMediaGroupNode).toHaveBeenNthCalledWith(
        4,
        newNodes[1],
        expect.any(Function),
      );
      expect(getInputGetPos(4)()).toBe(pos[1]);

      expect(pluginState.setMediaGroupNode).toHaveBeenNthCalledWith(
        5,
        newNodes[2],
        expect.any(Function),
      );
      expect(getInputGetPos(5)()).toBe(pos[2]);
    });

    /**
     * This spec is here because there is a reace condition in the plugin state when
     * there are 2+ noces with the same file ID.
     * When this happens, every component update needs to make sure to refresh the list of nodes in the
     * plugin state, no matter if the list changed or not, or the prop has mutated
     * This spec might be no longer needed after we work on
     * https://product-fabric.atlassian.net/browse/MEX-2117
     */
    test('updates the list of media group nodes when node list has not changed', () => {
      const props = getMediaGroupProps();
      const nodes = createNodeList();
      props.node.forEach = createNodeForeach(nodes);

      const component = mountWithIntl(<MediaGroup {...props} />);

      // Should update if the node list has not changed.
      component.setProps(props);

      expect(pluginState.setMediaGroupNode).toHaveBeenCalledTimes(4);
      expect(pluginState.setMediaGroupNode).toHaveBeenNthCalledWith(
        1,
        nodes[0],
        expect.any(Function),
      );
      expect(pluginState.setMediaGroupNode).toHaveBeenNthCalledWith(
        2,
        nodes[1],
        expect.any(Function),
      );
      expect(pluginState.setMediaGroupNode).toHaveBeenNthCalledWith(
        3,
        nodes[0],
        expect.any(Function),
      );
      expect(pluginState.setMediaGroupNode).toHaveBeenNthCalledWith(
        4,
        nodes[1],
        expect.any(Function),
      );
    });

    test('updates the list of media group nodes when node list have mutated', () => {
      const props = getMediaGroupProps();
      const nodes = createNodeList();
      props.node.forEach = createNodeForeach(nodes);

      const component = mountWithIntl(<MediaGroup {...props} />);

      // Should update if the node list has mutated.
      nodes[1].attrs.someAttr = 'this a changed attr';
      component.setProps(props);

      expect(pluginState.setMediaGroupNode).toHaveBeenCalledTimes(4);
      expect(pluginState.setMediaGroupNode).toHaveBeenNthCalledWith(
        1,
        nodes[0],
        expect.any(Function),
      );
      expect(pluginState.setMediaGroupNode).toHaveBeenNthCalledWith(
        2,
        nodes[1],
        expect.any(Function),
      );
      expect(pluginState.setMediaGroupNode).toHaveBeenNthCalledWith(
        3,
        nodes[0],
        expect.any(Function),
      );
      expect(pluginState.setMediaGroupNode).toHaveBeenNthCalledWith(
        4,
        nodes[1],
        expect.any(Function),
      );
    });
  });
});
