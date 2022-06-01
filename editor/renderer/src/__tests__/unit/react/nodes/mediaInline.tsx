import React from 'react';
import { ProviderFactory } from '@atlaskit/editor-common/provider-factory';
import type { MediaProvider } from '@atlaskit/editor-common/provider-factory';
import { mountWithIntl } from '@atlaskit/editor-test-helpers/enzyme';
import { ReactWrapper } from 'enzyme';
import { WrappedComponentProps } from 'react-intl-next';
import MediaInline, {
  MediaInlineProps,
  RenderMediaInline,
} from '../../../../react/nodes/mediaInline';
import { FileIdentifier } from '@atlaskit/media-client';
import { getDefaultMediaClientConfig } from '@atlaskit/media-test-helpers';
import { MediaInlineCard } from '@atlaskit/media-card';

describe('MediaInline', () => {
  let providerFactory: ProviderFactory;
  let mediaProvider: MediaProvider;
  const mockFile = {
    id: 'test-id',
    collection: 'test-collection',
  };

  const flushPromises = () => new Promise((resolve) => setImmediate(resolve));

  const mountMediaInline = (
    mediaInlineProps: MediaInlineProps,
  ): ReactWrapper<WrappedComponentProps, any> => {
    return mountWithIntl(<MediaInline {...mediaInlineProps} />);
  };

  beforeEach(() => {
    mediaProvider = {
      viewMediaClientConfig: getDefaultMediaClientConfig(),
    };
    providerFactory = new ProviderFactory();
    providerFactory.setProvider(
      'mediaProvider',
      Promise.resolve(mediaProvider),
    );
  });

  afterEach(() => {
    providerFactory.destroy();
  });

  it('should render a <span> tag', () => {
    const node = mountMediaInline({ providers: providerFactory, ...mockFile });
    expect(node.getDOMNode()['tagName']).toEqual('SPAN');
  });

  it('should render with correct props passed down to component', () => {
    const node = mountMediaInline({ providers: providerFactory, ...mockFile });
    const mockIdentifier: FileIdentifier = {
      id: 'test-id',
      collectionName: 'test-collection',
      mediaItemType: 'file',
    };
    expect(node.find(RenderMediaInline).prop('identifier')).toEqual(
      mockIdentifier,
    );
  });

  it('should return loading view without message when no mediaClientConfig is present', async () => {
    providerFactory.setProvider(
      'mediaProvider',
      Promise.resolve({} as MediaProvider),
    );
    const wrapper = mountMediaInline({
      providers: providerFactory,
      ...mockFile,
    });
    await flushPromises();
    wrapper.update();
    const mediaInlineLoadingView = wrapper
      .findWhere((el) => el.name() === 'MediaInlineCardLoadingView')
      .instance();
    expect(mediaInlineLoadingView.props).toEqual({
      message: '',
      isSelected: false,
    });
  });

  it('should return loading view with message when mediaClientConfig is present', async () => {
    const wrapper = mountMediaInline({
      providers: providerFactory,
      ...mockFile,
    });
    await flushPromises();
    wrapper.update();
    const mediaInlineLoadingView = wrapper
      .findWhere((el) => el.name() === 'MediaInlineCardLoadingView')
      .instance();
    expect(mediaInlineLoadingView.props).toEqual({
      message: 'Loading file...',
    });
  });

  it('should render with shouldOpenMediaViewer set to true', async () => {
    const node = mountMediaInline({ providers: providerFactory, ...mockFile });
    await flushPromises();
    node.update();
    expect(node.find(MediaInlineCard).prop('shouldOpenMediaViewer')).toEqual(
      true,
    );
  });

  it('should add media attrs for copy and paste', async () => {
    const mediaInlineCard = mountMediaInline({
      providers: providerFactory,
      ...mockFile,
    });

    mediaInlineCard.update();
    expect(mediaInlineCard.find('[data-node-type="mediaInline"]')).toHaveLength(
      1,
    );
    expect(
      mediaInlineCard.find('[data-node-type="mediaInline"]').props(),
    ).toEqual(
      expect.objectContaining({
        'data-context-id': undefined,
        'data-type': 'file',
        'data-node-type': 'mediaInline',
        'data-width': undefined,
        'data-height': undefined,
        'data-id': 'test-id',
        'data-collection': 'test-collection',
      }),
    );
  });
});
