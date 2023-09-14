import React from 'react';
import { ProviderFactory } from '@atlaskit/editor-common/provider-factory';
import type { MediaProvider } from '@atlaskit/editor-common/provider-factory';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { mountWithIntl } from '@atlaskit/editor-test-helpers/enzyme';
import type { ReactWrapper } from 'enzyme';
import type { WrappedComponentProps } from 'react-intl-next';
import type { MediaInlineProps } from '../../../../react/nodes/mediaInline';
import MediaInline, {
  RenderMediaInline,
} from '../../../../react/nodes/mediaInline';
import type { FileDetails, FileIdentifier } from '@atlaskit/media-client';
import { getDefaultMediaClientConfig } from '@atlaskit/media-test-helpers';
import type { InlineCardEvent } from '@atlaskit/media-card';
import { MediaInlineCard } from '@atlaskit/media-card';
import type { EventHandlers } from '@atlaskit/editor-common/ui';

describe('MediaInline', () => {
  let providerFactory: ProviderFactory;
  let mediaProvider: MediaProvider;
  const mockFile = {
    type: 'file',
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
    jest.clearAllMocks();
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
      .find('MediaInlineCardLoadingView')
      .first();
    expect(mediaInlineLoadingView.props()).toEqual({
      message: '',
      isSelected: false,
    });
  });

  it('renders MediaInlineCard when mediaClientConfig is present', async () => {
    const wrapper = mountMediaInline({
      providers: providerFactory,
      ...mockFile,
    });
    await flushPromises();
    wrapper.update();
    const mediaInlineLoadingView = wrapper.find(MediaInlineCard).instance();
    expect(mediaInlineLoadingView).toBeDefined();
  });

  it('should render with shouldOpenMediaViewer set to true when appearance is not mobile', async () => {
    const node = mountMediaInline({ providers: providerFactory, ...mockFile });
    await flushPromises();
    node.update();
    expect(node.find(MediaInlineCard).prop('shouldOpenMediaViewer')).toEqual(
      true,
    );
  });

  it('should render with shouldOpenMediaViewer set to false when appearance is mobile', async () => {
    const node = mountMediaInline({
      providers: providerFactory,
      rendererAppearance: 'mobile',
      ...mockFile,
    });
    await flushPromises();
    node.update();
    expect(node.find(MediaInlineCard).prop('shouldOpenMediaViewer')).toEqual(
      false,
    );
  });

  it('should add media attrs for copy and paste', async () => {
    const node = mountMediaInline({
      providers: providerFactory,
      ...mockFile,
    });
    await flushPromises();
    node.update();
    expect(node.find('[data-node-type="mediaInline"]')).toHaveLength(1);
    expect(node.find('[data-node-type="mediaInline"]').props()).toEqual(
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

  it('should invoke onclick callback with mediaItemDetails when click', async () => {
    jest.mock('@atlaskit/media-card', () => {
      return {
        MediaInlineCard: () => <div>MediaInlineCard</div>,
      };
    });
    const mockCardEventClickHandler = jest.fn();
    const eventHandlers: EventHandlers = {
      media: {
        onClick: mockCardEventClickHandler,
      },
    };

    const node = mountMediaInline({
      providers: providerFactory,
      eventHandlers,
      ...mockFile,
    });
    await flushPromises();
    node.update();

    const mediaItemDetails: FileDetails = {
      id: 'test-id',
      mediaType: 'video',
    };
    const event: InlineCardEvent = {
      event: {} as any,
      mediaItemDetails: mediaItemDetails,
    };
    node.find(MediaInlineCard).props().onClick!(event);
    expect(mockCardEventClickHandler).toBeCalledTimes(1);
    expect(mockCardEventClickHandler).toBeCalledWith(
      expect.objectContaining({ mediaItemDetails: mediaItemDetails }),
    );
  });
});
