import React from 'react';
import { MediaProvider, ProviderFactory } from '@atlaskit/editor-common';
import { mountWithIntl } from '@atlaskit/editor-test-helpers/enzyme';
import { ReactWrapper } from 'enzyme';
import { InjectedIntlProps } from 'react-intl';
import MediaInline, {
  MediaInlineProps,
  RenderMediaInline,
} from '../../../../react/nodes/mediaInline';
import { MediaInlineCard } from '@atlaskit/media-card';
import { FileIdentifier } from '@atlaskit/media-client';

describe('MediaInline', () => {
  let providerFactory: ProviderFactory;
  let mediaProvider: MediaProvider;
  const mockFile = {
    id: 'test-id',
    collection: 'test-collection',
  };

  const mountMediaInline = (
    mediaInlineProps: MediaInlineProps,
  ): ReactWrapper<InjectedIntlProps, any> => {
    return mountWithIntl(<MediaInline {...mediaInlineProps} />);
  };

  beforeEach(() => {
    mediaProvider = {} as MediaProvider;
    providerFactory = new ProviderFactory();
    providerFactory.setProvider(
      'mediaProvider',
      Promise.resolve(mediaProvider),
    );
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

  it('should render with shouldOpenMediaViewer set to true', () => {
    const node = mountMediaInline({ providers: providerFactory, ...mockFile });
    expect(node.find(MediaInlineCard).prop('shouldOpenMediaViewer')).toEqual(
      true,
    );
  });
});
