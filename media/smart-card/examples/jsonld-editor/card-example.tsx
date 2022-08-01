/** @jsx jsx */
import { jsx } from '@emotion/core';
import React, { useEffect } from 'react';
import { JsonLd } from 'json-ld-types';
import {
  Card,
  ElementName,
  FooterBlock,
  MetadataBlock,
  PreviewBlock,
  SnippetBlock,
  TitleBlock,
} from '../../src';
import { flexStyles } from './styled';
import { useSmartLinkReload } from '../../src/hooks';
import { extractUrlFromLinkJsonLd } from '@atlaskit/linking-common';
import withExampleProvider from './example-provider';

const DEFAULT_URL = 'https://atlaskit.atlassian.com/packages/media/smart-card';

const elements = Object.values(ElementName).filter(
  (name) => name !== ElementName.Title && name !== ElementName.LinkIcon,
);

const analytics = () => {};

const CardExample: React.FC<{
  json?: JsonLd.Response<JsonLd.Data.BaseData>;
  url?: string;
}> = ({ json, url: forceUrl }) => {
  const data = json?.data as JsonLd.Data.BaseData;
  const url =
    forceUrl ||
    extractUrlFromLinkJsonLd(data?.url || DEFAULT_URL) ||
    DEFAULT_URL;
  const reload = useSmartLinkReload({ url, analyticsHandler: analytics });

  useEffect(() => reload(), [reload, json]);

  return (
    <div>
      <h6>Inline</h6>
      <p>
        Bowsprit scallywag weigh anchor Davy Jones' Locker warp ballast scurvy
        nipper brigantine Jolly Roger wench sloop Shiver me timbers rope's end
        chandler. Admiral of the Black cackle fruit deck{' '}
        <Card
          appearance="inline"
          data={json?.data}
          url={url}
          showHoverPreview={true}
        />
        wench bounty rope's end bilge water scourge of the seven seas hardtack
        come about execution dock Nelsons folly handsomely rigging splice the
        main brace.
      </p>
      <h6>Block</h6>
      <br />
      <Card appearance="block" data={json?.data} url={url} />
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
    </div>
  );
};

export default withExampleProvider(CardExample);
