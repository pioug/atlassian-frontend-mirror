import React from 'react';
import { mount } from 'enzyme';
import { CardDimensions } from '@atlaskit/media-card';
import { EditorView } from 'prosemirror-view';
import { media } from '@atlaskit/editor-test-helpers/schema-builder';
import { defaultSchema } from '@atlaskit/adf-schema';
import { ProviderFactory } from '@atlaskit/editor-common';
import Media from '../../../../../plugins/media/nodeviews/media';
import { stateKey as mediaStateKey } from '../../../../../plugins/media/pm-plugins/main';
import { MediaPluginState } from '../../../../../plugins/media/pm-plugins/types';

describe('nodeviews/media', () => {
  const providerFactory = {} as ProviderFactory;
  const mediaNode = media({
    id: 'foo',
    type: 'file',
    collection: 'collection',
    width: 100,
    height: 100,
  });

  beforeEach(() => {
    const pluginState = {} as MediaPluginState;
    jest.spyOn(mediaStateKey, 'getState').mockImplementation(() => pluginState);
    providerFactory.subscribe = jest.fn();
    providerFactory.unsubscribe = jest.fn();
    pluginState.handleMediaNodeMount = jest.fn();
    pluginState.handleMediaNodeUnmount = jest.fn();
  });

  it('should render Media', () => {
    const getPos = jest.fn();
    const view = {} as EditorView;
    const cardDimensions = {} as CardDimensions;
    const wrapper = mount(
      <Media
        node={mediaNode()(defaultSchema)}
        getPos={getPos}
        view={view}
        cardDimensions={cardDimensions}
        selected={false}
      />,
    );

    expect(wrapper.length).toBe(1);
    wrapper.unmount();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });
});
