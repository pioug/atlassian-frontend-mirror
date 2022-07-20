import React from 'react';
import { IntlProvider } from 'react-intl-next';
import { EmojiPlaceholder } from '../src';

export default function Example() {
  const shortName = ':cool:';

  return (
    <IntlProvider locale="en">
      <h1>Emoji Placeholder</h1>
      <p>
        Emoji Placeholders are your waiting space for emojis to load. Emoji
        Placeholder now supports a loading state for customer feedback on emojis
        loading.
      </p>
      <p>
        Standard box placeholder <EmojiPlaceholder shortName={shortName} />
      </p>
      <p>
        A loading state for placeholder{' '}
        <EmojiPlaceholder shortName={shortName} loading />
      </p>
    </IntlProvider>
  );
}
