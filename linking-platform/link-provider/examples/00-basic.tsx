import React, { useState, useEffect, type FormEventHandler } from 'react';
import { type JsonLd } from 'json-ld-types';
import TextField from '@atlaskit/textfield';
import { CodeBlock } from '@atlaskit/code';
import { getUrl } from '@atlaskit/linking-common';
import { SmartCardProvider, CardClient, useSmartLinkContext } from '../src';

const client = new CardClient('stg');
const defaultLink =
  'https://pug.jira-dev.com/wiki/spaces/CFE/pages/4522249092/Jira%2C+PR+and+commit+description+best+practices';
const MetadataRenderer = () => {
  const context = useSmartLinkContext();
  const [linkMetadata, setLinkMetadata] = useState<JsonLd.Response>();
  const [linkValue, setLinkValue] = useState(defaultLink);
  const onChange: FormEventHandler<HTMLInputElement> = event => {
    setLinkValue(event.currentTarget.value);
  };
  const cardState = getUrl(context.store, linkValue);

  console.log({ cardState });

  useEffect(() => {
    (async () => {
      const metadata = await client.fetchData(linkValue);

      setLinkMetadata(metadata);
    })();
  }, [linkValue]);

  const metadataText = linkMetadata
    ? JSON.stringify(linkMetadata, null, 2)
    : '';
  return (
// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
    <div style={{ width: 800, margin: '0 auto' }}>
      <TextField defaultValue={linkValue} onChange={onChange} />
      <CodeBlock text={metadataText} showLineNumbers={true} language={'JSON'} />
    </div>
  );
};

export default function Basic() {
  return (
    <SmartCardProvider client={client}>
      <MetadataRenderer />
    </SmartCardProvider>
  );
}
