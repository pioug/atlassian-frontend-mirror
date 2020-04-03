import React from 'react';
import { mount } from 'enzyme';
import { EditorView } from 'prosemirror-view';
import { Node as PMNode } from 'prosemirror-model';
import MediaGroup from '../mediaGroup';
import { MediaProvider } from '../../pm-plugins/main';

export const createMediaProvider = async (): Promise<MediaProvider> =>
  ({} as MediaProvider);

export const getMediaGroupProps = () => ({
  view: { state: {} } as EditorView<any>,
  node: ({
    attrs: {},
    firstChild: { attrs: {} },
    forEach() {},
  } as unknown) as PMNode<any>,
  mediaProvider: createMediaProvider(),
  selected: null,
  getPos: jest.fn(),
});

jest.mock('../media', () => () => null);

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
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('updates file attrs for props change', async () => {
    const wrapper = mount(<MediaGroup {...getMediaGroupProps()} />);

    const mediaGroup = wrapper.instance();
    const updateNodeAttrs = jest.spyOn(mediaGroup as any, 'updateNodeAttrs');

    wrapper.setProps({
      mediaProvider: createMediaProvider(),
    });

    expect(updateNodeAttrs).toHaveBeenCalledTimes(1);
  });

  test('does not update file attrs for props change if copy/paste is disabled', async () => {
    const wrapper = mount(
      <MediaGroup {...getMediaGroupProps()} isCopyPasteEnabled={false} />,
    );

    const mediaGroup = wrapper.instance();
    const updateNodeAttrs = jest.spyOn(mediaGroup as any, 'updateNodeAttrs');

    wrapper.setProps({
      mediaProvider: createMediaProvider(),
    });

    expect(updateNodeAttrs).not.toHaveBeenCalled();
  });
});
