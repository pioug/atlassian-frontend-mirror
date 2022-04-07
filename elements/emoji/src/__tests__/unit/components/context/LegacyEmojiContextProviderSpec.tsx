import { render } from '@testing-library/react';
import PropTypes from 'prop-types';
import React, { useContext, useEffect, useState } from 'react';
import * as sinon from 'sinon';
import LegacyEmojiContextProvider from '../../../../context/LegacyEmojiContextProvider';
import { EmojiContext } from '../../../../context/EmojiContext';
import { EmojiResource } from '../../../../api/EmojiResource';

class MockLegacyContextProvider extends React.Component<any, any> {
  static childContextTypes = {
    emoji: PropTypes.object,
  };

  getChildContext() {
    return {
      emoji: {
        emojiProvider: 'from-legacy-provider',
      },
    };
  }

  render() {
    return this.props.children;
  }
}

const RenderContextStub = () => {
  const stubbedContext = useContext(EmojiContext);
  const [contextState, setContextState] = useState('');

  useEffect(() => {
    if (!stubbedContext) {
      return setContextState('context null');
    } else if (typeof stubbedContext.emoji.emojiProvider === 'string') {
      return setContextState('context legacy');
    }
    setContextState('context prop');
  }, [stubbedContext]);

  return <p>{contextState}</p>;
};

describe('<LegacyEmojiContextProvider />', () => {
  test('renders children without context if no context is found', () => {
    const result = render(
      <LegacyEmojiContextProvider>
        <RenderContextStub />
      </LegacyEmojiContextProvider>,
    );
    expect(result.getByText('context null')).not.toBeNull();
  });
  test('provides legacy context', () => {
    const result = render(
      <MockLegacyContextProvider>
        <LegacyEmojiContextProvider>
          <RenderContextStub />
        </LegacyEmojiContextProvider>
      </MockLegacyContextProvider>,
    );
    expect(result.getByText('context legacy')).not.toBeNull();
  });
  test('provides prop context if no legacy context is provided', () => {
    const emojiProviderStub: sinon.SinonStubbedInstance<EmojiResource> = sinon.createStubInstance(
      EmojiResource,
    );

    const result = render(
      <LegacyEmojiContextProvider
        emojiContextValue={{ emoji: { emojiProvider: emojiProviderStub } }}
      >
        <RenderContextStub />
      </LegacyEmojiContextProvider>,
    );

    expect(result.getByText('context prop')).not.toBeNull();
  });
  test('preferences legacy context if legacy and prop context is provided', () => {
    const emojiProviderStub: sinon.SinonStubbedInstance<EmojiResource> = sinon.createStubInstance(
      EmojiResource,
    );

    const result = render(
      <MockLegacyContextProvider>
        <LegacyEmojiContextProvider
          emojiContextValue={{ emoji: { emojiProvider: emojiProviderStub } }}
        >
          <RenderContextStub />
        </LegacyEmojiContextProvider>
      </MockLegacyContextProvider>,
    );

    expect(result.getByText('context legacy')).not.toBeNull();
  });
});
