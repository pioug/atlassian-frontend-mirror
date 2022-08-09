import React, { useEffect, useState } from 'react';
import WebBridgeImpl from '../../../src/editor/native-to-web';
import { EmojiProvider, EmojiDescription } from '@atlaskit/emoji';
import { getEmojiProvider } from '@atlaskit/util-data-test/get-emoji-provider';
import Button from '../Toolbar/Button';

interface Props {
  bridge: WebBridgeImpl;
  query: string;
}

const emojiProvider = getEmojiProvider();

const Emoji = ({ bridge, query }: Props) => {
  const [provider, setProvider] = useState<EmojiProvider | null>(null);
  const [items, setItems] = useState<EmojiDescription[] | null>(null);

  useEffect(() => {
    console.log('here');
    emojiProvider.then((provider) => {
      setProvider(provider);
    });
  }, []);

  useEffect(() => {
    if (provider) {
      provider.subscribe({
        result: (result) => {
          console.log(result);
          if (query === result.query) {
            setItems(result.emojis);
          }
        },
      });
    }
  }, [query, provider]);

  useEffect(() => {
    if (provider) {
      provider.filter(query);
    }
  }, [query, provider]);

  return (
    <div style={{ display: 'flex', height: 24 }}>
      {items
        ? items.map((item) => (
            <Button
              title={item.shortName}
              onClick={() =>
                bridge.insertTypeAheadItem('emoji', JSON.stringify(item))
              }
            />
          ))
        : null}
    </div>
  );
};

export default Emoji;
