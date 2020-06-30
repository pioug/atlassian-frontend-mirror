import React from 'react';

import { mount } from 'enzyme';

import { EmojiProvider, ResourcedEmoji } from '@atlaskit/emoji';

import { ProviderFactory } from '../../../provider-factory';
import Emoji from '../../../ui/Emoji';

describe('Emoji', () => {
  const emojiProvider = Promise.resolve({} as EmojiProvider);

  it('should render "fallback" if there is no emojiProvider prop', () => {
    const component = mount(
      <Emoji
        allowTextFallback={true}
        shortName=":anything:"
        fallback="fallback"
      />,
    );

    const fallbackSpan = component.find('span');
    expect(fallbackSpan).toHaveLength(1);
    expect(fallbackSpan.text()).toEqual('fallback');
    component.unmount();
  });

  it('should still render resourced emoji if allowTextFallback=true', () => {
    const providerFactory = ProviderFactory.create({ emojiProvider });

    const component = mount(
      <Emoji
        providers={providerFactory}
        allowTextFallback={true}
        shortName=":anything:"
        fallback="fallback"
      />,
    );

    expect(component.find(ResourcedEmoji)).toHaveLength(1);
    component.unmount();
  });

  it('should render "fallback" if there is no emojiProvider prop and no fallback', () => {
    const component = mount(
      <Emoji allowTextFallback={true} shortName=":anything:" />,
    );

    const fallbackSpan = component.find('span');
    expect(fallbackSpan).toHaveLength(1);
    expect(fallbackSpan.text()).toEqual(':anything:');
    component.unmount();
  });

  it('should render a EmojiWrapper component if emojiProvider supplied', () => {
    const providerFactory = ProviderFactory.create({ emojiProvider });

    const emojiId = {
      shortName: ':anything:',
      fallback: 'fallback',
      id: 'abc',
    };
    const component = mount(<Emoji providers={providerFactory} {...emojiId} />);

    const resourcedEmoji = component.find(ResourcedEmoji);
    expect(resourcedEmoji).toHaveLength(1);
    expect(resourcedEmoji.prop('emojiId')).toStrictEqual(emojiId);
    expect(resourcedEmoji.prop('emojiProvider')).toEqual(emojiProvider);
    component.unmount();
  });

  it('should pass fitToHeight down to ResourcedEmoji if there is a provider', () => {
    const providerFactory = ProviderFactory.create({ emojiProvider });

    const emojiId = {
      shortName: ':anything:',
      fallback: 'fallback',
      id: 'abc',
    };
    const component = mount(
      <Emoji providers={providerFactory} fitToHeight={32} {...emojiId} />,
    );

    const resourcedEmoji = component.find(ResourcedEmoji);
    expect(resourcedEmoji).toHaveLength(1);
    expect(resourcedEmoji.prop('fitToHeight')).toStrictEqual(32);
    component.unmount();
  });
});
