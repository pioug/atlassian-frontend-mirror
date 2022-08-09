/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import React from 'react';
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
import withJsonldEditorProvider from './jsonld-editor-provider';
import withJsonldEditorReload from './jsonld-editor-reload';
import { token } from '@atlaskit/tokens';

const labelStyles = css`
  align-items: center;
  background-color: ${token('color.background.neutral', '#091E420F')};
  border-radius: 3px;
  color: ${token('color.text', '#172B4D')};
  font-family: 'SFMono-Medium', 'SF Mono', 'Segoe UI Mono', 'Roboto Mono',
    'Ubuntu Mono', Menlo, Consolas, Courier, monospace;
  font-size: 0.75rem;
  justify-content: center;
  line-height: 0.75rem;
  padding: 0.125rem 0;
`;

const flexStyles = css`
  [data-smart-block] {
    &[data-testid^='smart-block-title'],
    &[data-testid^='smart-block-preview'],
    &[data-testid^='smart-block-snippet'],
    &[data-testid^='smart-footer-block'] {
      padding-top: 1.5rem;
      position: relative;
      :before {
        display: flex;
        position: absolute;
        left: 0;
        right: 0;
        top: 0;
        ${labelStyles}
      }
    }

    &[data-testid^='smart-block-title']:before {
      content: 'TitleBlock';
    }

    &[data-testid^='smart-block-preview']:before {
      content: 'PreviewBlock';
    }

    &[data-testid^='smart-block-snippet']:before {
      content: 'SnippetBlock';
    }

    &[data-testid^='smart-footer-block']:before {
      content: 'FooterBlock';
    }

    &[data-testid^='smart-block-metadata'] {
      [data-smart-element]:before {
        content: attr(data-smart-element);
        display: inline-flex;
        margin-right: 1rem;
        width: 10rem;
        ${labelStyles}
      }
    }
  }

  [data-smart-element-group] {
    -webkit-box-align: start;
    -ms-flex-align: start;
  }
`;

const elements = Object.values(ElementName).filter(
  (name) => name !== ElementName.Title && name !== ElementName.LinkIcon,
);

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

// Not the most elegant implementation but this will do.
export default withJsonldEditorProvider(withJsonldEditorReload(CardExample));
