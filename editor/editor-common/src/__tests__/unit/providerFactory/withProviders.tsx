import React from 'react';
import { mount } from 'enzyme';
import {
  ProviderFactory,
  WithProviders,
  Providers,
} from '../../../provider-factory';
import { MentionProvider } from '@atlaskit/mention';
import { EmojiProvider } from '@atlaskit/emoji';

describe('WithProviders', () => {
  it('should pass multiple providers to UI component', () => {
    const renderNode = () => <div />;
    const providerFactory = new ProviderFactory();
    providerFactory.setProvider(
      'mentionProvider',
      Promise.resolve({} as MentionProvider),
    );
    providerFactory.setProvider(
      'emojiProvider',
      Promise.resolve({} as EmojiProvider),
    );

    const component = mount(
      <WithProviders
        providers={['mentionProvider', 'emojiProvider']}
        providerFactory={providerFactory}
        renderNode={renderNode}
      />,
    );
    const providers: Providers = component.state('providers');
    const nonEmptyProviders = Object.keys(providers).filter(
      providerName => providers[providerName as keyof Providers],
    );

    expect(nonEmptyProviders.length).toBe(2);
    component.unmount();
  });
});
