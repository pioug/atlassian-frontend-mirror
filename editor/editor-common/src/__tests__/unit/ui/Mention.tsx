import React from 'react';

import { mount } from 'enzyme';

import { MentionProvider } from '@atlaskit/mention';
import { ResourcedMention } from '@atlaskit/mention/element';

import { ProviderFactory } from '../../../provider-factory';
import { ProfilecardProvider } from '../../../provider-factory/profile-card-provider';
import Mention from '../../../ui/Mention';
// avoid polluting test logs with error message in console
// please ensure you fix it if you expect console.error to be thrown
// eslint-disable-next-line no-console
let consoleError = console.error;

describe('@atlaskit/editor-core/ui/Mention', () => {
  beforeEach(() => {
    // eslint-disable-next-line no-console
    console.error = jest.fn();
  });
  afterEach(() => {
    // eslint-disable-next-line no-console
    console.error = consoleError;
  });
  it('should render resourced mention', () => {
    const mention = mount(
      <Mention id="abcd-abcd-abcd" text="@Oscar Wallhult" />,
    );
    const resourcedMention = mention.find(ResourcedMention);

    expect(resourcedMention.prop('id')).toEqual('abcd-abcd-abcd');
    expect(resourcedMention.prop('text')).toEqual('@Oscar Wallhult');
  });

  it('should not render ResourcedMentionWithProfilecard if profilecardProvider is not set', () => {
    const providerFactory = new ProviderFactory();
    const mentionProvider = Promise.resolve({} as MentionProvider);
    providerFactory.setProvider('mentionProvider', mentionProvider);

    const mention = mount(
      <Mention
        id="abcd-abcd-abcd"
        text="@Oscar Wallhult"
        providers={providerFactory}
      />,
    );
    expect(mention.find('WithProfilecardMention')).toHaveLength(0);
    mention.unmount();
  });

  it('should pass provider into resourced mention', () => {
    const providerFactory = new ProviderFactory();
    const mentionProvider = Promise.resolve({} as MentionProvider);
    providerFactory.setProvider('mentionProvider', mentionProvider);

    const mention = mount(
      <Mention
        id="abcd-abcd-abcd"
        text="@Oscar Wallhult"
        providers={providerFactory}
      />,
    );
    const resourcedMention = mention.find(ResourcedMention);

    expect(resourcedMention.prop('mentionProvider')).toEqual(mentionProvider);
    mention.unmount();
  });

  it('should not render ResourcedMentionWithProfilecard if profilecardProvider promise is rejected', async () => {
    const providerFactory = new ProviderFactory();
    const profilecardProvider = Promise.reject(new Error());
    providerFactory.setProvider('profilecardProvider', profilecardProvider);

    const mention = mount(
      <Mention
        id="abcd-abcd-abcd"
        text="@Oscar Wallhult"
        providers={providerFactory}
      />,
    );

    try {
      await profilecardProvider;
    } catch (err) {
      expect(mention.find('WithProfilecardMention')).toHaveLength(0);
    }
    mention.unmount();
  });

  ['HipChat', 'all', 'here'].forEach((genericUserId) => {
    it(`should not render ResourcedMentionWithProfilecard if id is generic (${genericUserId})`, async () => {
      const providerFactory = new ProviderFactory();
      const profilecardProvider = Promise.resolve({} as ProfilecardProvider);
      providerFactory.setProvider('profilecardProvider', profilecardProvider);

      const mention = mount(
        <Mention
          id={genericUserId}
          text="@Oscar Wallhult"
          providers={providerFactory}
        />,
      );
      await profilecardProvider;

      expect(mention.find('WithProfilecardMention')).toHaveLength(0);
      mention.unmount();
    });
  });
});
