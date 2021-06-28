import React from 'react';

import { mount } from 'enzyme';

import { EmojiProvider } from '@atlaskit/emoji';
import { MentionProvider } from '@atlaskit/mention';

import {
  ProviderFactory,
  Providers,
  WithProviders,
} from '../../../provider-factory';

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
      (providerName) => providers[providerName as keyof Providers],
    );

    expect(nonEmptyProviders.length).toBe(2);
    component.unmount();
  });
});
