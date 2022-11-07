import { mountWithIntl } from '@atlaskit/editor-test-helpers/enzyme';
import { Filmstrip } from '@atlaskit/media-filmstrip/filmstrip';
import { MediaFeatureFlags } from '@atlaskit/media-common';
import { Node as PMNode } from 'prosemirror-model';
import { EditorView } from 'prosemirror-view';
import React from 'react';
import { MediaProvider, stateKey } from '../../pm-plugins/main';
import MediaGroup from '../mediaGroup';
import { MediaPluginState } from '../../pm-plugins/types';

export const createMediaProvider = async (): Promise<MediaProvider> =>
  ({} as MediaProvider);

export const getMediaGroupProps = () => ({
  view: {
    state: { selection: { $anchor: { pos: 1 }, $head: { pos: 5 } } },
  } as EditorView<any>,
  node: ({
    nodeSize: 3,
    attrs: {},
    firstChild: { attrs: {} },
    forEach() {},
  } as unknown) as PMNode<any>,
  mediaProvider: createMediaProvider(),
  selected: null,
  getPos: jest.fn(),
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
  })),
}));

describe('mediaGroup', () => {
  beforeEach(() => {
    const pluginState = {} as MediaPluginState;
    pluginState.handleMediaGroupUpdate = jest.fn();
    jest.spyOn(stateKey, 'getState').mockImplementation(() => pluginState);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('updates file attrs for props change', async () => {
    const wrapper = mountWithIntl(<MediaGroup {...getMediaGroupProps()} />);

    const mediaGroup = wrapper
      .findWhere((el) => el.name() === 'MediaGroup')
      .instance();
    const updateNodeAttrs = jest.spyOn(mediaGroup as any, 'updateNodeAttrs');

    wrapper.setProps({
      mediaProvider: createMediaProvider(),
    });

    expect(updateNodeAttrs).toHaveBeenCalledTimes(1);
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
});
