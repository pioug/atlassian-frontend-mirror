/** @jsx jsx */
import { jsx } from '@emotion/core';
import React, { useEffect, useMemo, useState } from 'react';
import { IntlProvider } from 'react-intl-next';
import { JsonLd } from 'json-ld-types';
import uuid from 'uuid';
import { SmartCardProvider } from '@atlaskit/link-provider';
import {
  Card,
  ElementName,
  FooterBlock,
  MetadataBlock,
  PreviewBlock,
  SnippetBlock,
  TitleBlock,
} from '../../src';
import CustomClient from './custom-client';
import { flexStyles } from './styled';

const elements = Object.values(ElementName).filter(
  (name) => name !== ElementName.Title && name !== ElementName.LinkIcon,
);

const CardExample: React.FC<{
  response?: JsonLd.Response;
}> = ({ response }) => {
  const [url, setUrl] = useState<string>('https://example-url');

  const client = useMemo(() => new CustomClient('staging', response), [
    response,
  ]);

  useEffect(() => setUrl(`https://${uuid()}`), [response]);

  return (
    <IntlProvider locale="en">
      <SmartCardProvider client={client}>
        <h6>Inline</h6>
        <p>
          Bowsprit scallywag weigh anchor Davy Jones' Locker warp ballast scurvy
          nipper brigantine Jolly Roger wench sloop Shiver me timbers rope's end
          chandler. Admiral of the Black cackle fruit deck{' '}
          <Card appearance="inline" url={url} showHoverPreview={true} /> wench
          bounty rope's end bilge water scourge of the seven seas hardtack come
          about execution dock Nelsons folly handsomely rigging splice the main
          brace.
        </p>
        <h6>Block</h6>
        <br />
        <Card appearance="block" url={url} />
        <h6>
          Flexible (
          <a href="https://atlaskit.atlassian.com/packages/media/smart-card/docs/flexible">
            go/flexible-smart-links-docs
          </a>
          )
        </h6>
        <br />
        <div css={flexStyles}>
          <Card appearance="block" url={url}>
            {elements.map((name, idx) => (
              <MetadataBlock key={idx} maxLines={1} primary={[{ name }]} />
            ))}
            <TitleBlock />
            <PreviewBlock />
            <SnippetBlock />
            <FooterBlock />
          </Card>
        </div>
      </SmartCardProvider>
    </IntlProvider>
  );
};

export default CardExample;
