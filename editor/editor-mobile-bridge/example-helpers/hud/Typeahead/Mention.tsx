import React, { useEffect, useState } from 'react';
import WebBridgeImpl from '../../../src/editor/native-to-web';
import { MentionProvider, MentionDescription } from '@atlaskit/mention';
import { mentionResourceProviderWithTeamMentionHighlight } from '@atlaskit/util-data-test/mention-story-data';
import Button from '../Toolbar/Button';

interface Props {
  bridge: WebBridgeImpl;
  query: string;
}

const mentionProvider = Promise.resolve(
  mentionResourceProviderWithTeamMentionHighlight,
);

const Mention = ({ bridge, query }: Props) => {
  const [provider, setProvider] = useState<MentionProvider | null>(null);
  const [items, setItems] = useState<MentionDescription[] | null>(null);

  useEffect(() => {
    mentionProvider.then((provider) => {
      setProvider(provider);
    });
  }, []);

  useEffect(() => {
    if (provider) {
      provider.subscribe('key', (result, resultQuery) => {
        console.log(result);
        if (resultQuery === query) {
          setItems(result);
        }
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
              title={item.nickname ?? item.name}
              onClick={() =>
                bridge.insertTypeAheadItem('mention', JSON.stringify(item))
              }
            />
          ))
        : null}
    </div>
  );
};

export default Mention;
