import React, { PureComponent, ContextType, FC, useContext } from 'react';
import * as sinon from 'sinon';
import { render } from '@testing-library/react';
import { EmojiContextProvider } from '../../../../context/EmojiContextProvider';
import { EmojiContext } from '../../../../context/EmojiContext';
import EmojiResource from '../../../../api/EmojiResource';

class ClassContextChild extends PureComponent {
  static contextType = EmojiContext;
  context!: ContextType<typeof EmojiContext>;

  render() {
    return (
      <span>{this.context?.emoji.emojiProvider.findByShortName('foo')}</span>
    );
  }
}

const FunctionContextChild: FC = ({ children }) => {
  const emojiContext = useContext(EmojiContext);
  return (
    <span>{emojiContext?.emoji.emojiProvider.findByShortName('foo')}</span>
  );
};

describe('the emoji context provider', () => {
  let emojiProviderStub: sinon.SinonStubbedInstance<EmojiResource>;
  beforeEach(() => {
    emojiProviderStub = sinon.createStubInstance(EmojiResource);
  });

  it('passes down the emoji context into functional components', async () => {
    emojiProviderStub.findByShortName.returns('foo-stubbed');
    const emojiContextValue = {
      emoji: {
        emojiProvider: emojiProviderStub,
      },
    };

    const result = await render(
      <EmojiContextProvider emojiContextValue={emojiContextValue}>
        <FunctionContextChild />
      </EmojiContextProvider>,
    );

    expect(result.findByDisplayValue('foo-stubbed')).not.toBeNull();
  });

  it('passed down the emoji context into class based components', async () => {
    emojiProviderStub.findByShortName.returns('foo-stubbed');
    const emojiContextValue = {
      emoji: {
        emojiProvider: emojiProviderStub,
      },
    };

    const result = await render(
      <EmojiContextProvider emojiContextValue={emojiContextValue}>
        <ClassContextChild />
      </EmojiContextProvider>,
    );

    expect(result.findByDisplayValue('foo-stubbed')).not.toBeNull();
  });
});
