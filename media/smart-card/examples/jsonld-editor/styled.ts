import { css } from '@emotion/core';
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

export const flexStyles = css`
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

export const jsonldExampleStyles = css`
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem;
  margin: 0.75rem 0;
`;
