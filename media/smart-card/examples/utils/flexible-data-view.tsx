/** @jsx jsx */
import { css, jsx } from '@emotion/react';
import React from 'react';
import { token } from '@atlaskit/tokens';
import {
  Card,
  ElementName,
  FooterBlock,
  MetadataBlock,
  PreviewBlock,
  SnippetBlock,
  TitleBlock,
} from '../../src';
import { metadataElements } from './flexible-ui';

/**
 * We are hacking flexible smart links styling here to display the information
 * about elements.
 */
const codeStyles = css`
  font-family: 'SFMono-Medium', 'SF Mono', 'Segoe UI Mono', 'Roboto Mono',
    'Ubuntu Mono', Menlo, Consolas, Courier, monospace;
  font-size: 0.75rem;
  line-height: 0.75rem;
`;

const labelStyles = css`
  align-items: center;
  background-color: ${token('color.background.neutral', '#091E420F')};
  border-radius: 3px;
  color: ${token('color.text', '#172B4D')};
  justify-content: center;
  padding: 0.125rem 0;
  ${codeStyles}
`;

export const flexStyles = css`
  [data-smart-block] {
    // MetadataBlock: Element showcase
    ${metadataElements.map(
      (name) => css`
        &[data-testid^='${name}'] {
          display: flex; // Force block to show even when the element has no data

          &:empty {
            justify-content: space-between;
          }

          &:before {
            display: inline-flex;
            margin-right: 1rem;
            width: 10rem;
            ${labelStyles}
          }

          :before {
            content: '${name}';
          }
        }
      `,
    )}

    &[data-testid^='smart-'] {
      display: flex; // Force block to show even when the element has no data
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

      // TODO: If we assign block name to data-smart-block the same way we do
      // on data-smart-element, we can auto generate the block name
      // and don't have to rely on testId
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

      &[data-testid^='smart-block-metadata']:before {
        content: 'Metadata (ElementItem)';
      }
    }
  }
`;

const FlexibleDataView: React.FC<{ url?: string }> = ({ url }) => (
  <div css={flexStyles}>
    <Card appearance="block" url={url}>
      <TitleBlock />
      <PreviewBlock />
      <SnippetBlock />
      <FooterBlock />
      <MetadataBlock primary={[{ name: 'ElementItem' as ElementName }]} />
      {metadataElements.map((name, idx) => (
        <MetadataBlock
          key={idx}
          maxLines={1}
          primary={[{ name }]}
          testId={name}
        />
      ))}
    </Card>
  </div>
);

export default FlexibleDataView;
