import React, { useState, useEffect } from 'react';
import QuickInsert from './QuickInsert';
import Emoji from './Emoji';
import Mention from './Mention';
import type WebBridgeImpl from '../../../src/editor/native-to-web';

interface DisplayItemsArgs {
  trigger: string;
  query: string;
  items: string;
}

interface QueryArgs {
  query: string;
  trigger: string;
}

interface Props {
  bridge: WebBridgeImpl;
}

const Typeahead = ({ bridge }: Props) => {
  const [items, setItems] = useState<any>(null);
  const [trigger, setTrigger] = useState<any>(null);
  const [query, setQuery] = useState<any>(null);

  useEffect(() => {
    (window as any).messageHandler.on(
      'typeAheadQuery',
      ({ query, trigger }: QueryArgs) => {
        setTrigger(trigger);
        setQuery(query);
        setItems(null);
      },
    );

    (window as any).messageHandler.on(
      'typeAheadDisplayItems',
      ({ trigger, query, items }: DisplayItemsArgs) => {
        setTrigger(trigger);
        setQuery(query);
        setItems(items ? JSON.parse(items) : null);
      },
    );

    (window as any).messageHandler.on('dismissTypeAhead', () => {
      setItems(null);
      setTrigger(null);
      setQuery(null);
    });
  }, []);

  if (trigger) {
    if (trigger === '/') {
      return <QuickInsert items={items || []} bridge={bridge} />;
    }

    if (trigger === ':') {
      return <Emoji bridge={bridge} query={query} />;
    }

    if (trigger === '@') {
      return <Mention bridge={bridge} query={query} />;
    }
  }

// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
  return <div style={{ height: 24, display: 'flex' }}></div>;
};

export default Typeahead;
