/** @jsx jsx */
import React from 'react';
import { jsx } from '@emotion/react';
// These imports are not included in the manifest file to avoid circular package dependencies blocking our Typescript and bundling tooling
// eslint-disable-next-line import/no-extraneous-dependencies
import { getEmojis } from '@atlaskit/util-data-test/get-emojis';
import EmojiPickerList, {
  Props,
} from '../src/components/picker/EmojiPickerList';

import { IntlProvider } from 'react-intl-next';
import { emojiPicker } from '../src/components/picker/styles';

const allEmojis = getEmojis();

export default function Example() {
  const [query, setQuery] = React.useState('');
  const [emojis, setEmojis] = React.useState(allEmojis);

  const onSearch = (value: string) => {
    setQuery(value);

    setEmojis(
      value.length === 0
        ? allEmojis
        : allEmojis.filter(
            (emoji) =>
              emoji.shortName.toLowerCase().indexOf(query.toLowerCase()) > -1,
          ),
    );
  };

  const props = {
    emojis,
    query,
    onSearch,
  };

  return (
    <IntlProvider locale="en">
      <h3>Default Size - medium </h3>
      <div css={emojiPicker(false)}>
        <EmojiPickerList {...(props as Props)} />
      </div>

      <h3>Small Size</h3>
      <div css={emojiPicker(false, 'small')}>
        <EmojiPickerList {...(props as Props)} size="small" />
      </div>

      <h3>Medium Size</h3>
      <div css={emojiPicker(false, 'medium')}>
        <EmojiPickerList {...(props as Props)} size="medium" />
      </div>

      <h3>Large Size</h3>
      <div css={emojiPicker(false, 'large')}>
        <EmojiPickerList {...(props as Props)} size="large" />
      </div>
    </IntlProvider>
  );
}
