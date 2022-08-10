/** @jsx jsx */
import { jsx } from '@emotion/core';
import React from 'react';
import { JsonLd } from 'json-ld-types';
import { Card } from '../../src';
import withJsonldEditorProvider from './jsonld-editor-provider';
import withJsonldEditorReload from './jsonld-editor-reload';
import FlexibleDataView from '../utils/flexible-data-view';

const CardExample: React.FC<{
  json?: JsonLd.Response<JsonLd.Data.BaseData>;
  url?: string;
}> = ({ json, url }) => {
  return (
    <div>
      <h6>Inline</h6>
      <div>
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
      </div>
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
      <FlexibleDataView url={url} />
    </div>
  );
};

// Not the most elegant implementation but this will do.
export default withJsonldEditorProvider(withJsonldEditorReload(CardExample));
