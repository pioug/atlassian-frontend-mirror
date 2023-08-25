import { css } from '@emotion/react';
import { separatorCss } from '../../../styled';
import { getBooleanFF } from '@atlaskit/platform-feature-flags';

const elementGap = '0.5rem';

export const metadataBlockCss = css`
  gap: 0px;
  /* primary element group */
  [data-smart-element-group]:nth-of-type(1) {
    flex-grow: 7;

    // a separator between text-based element
    ${separatorCss}

    /* horizontal spacing between elements in group */
    > span {
      margin-right: ${elementGap};
    }
  }
  /* secondary element group */
  [data-smart-element-group]:nth-of-type(2) {
    flex-grow: 3;
    /* horizontal spacing between elements in group */
    > span {
      margin-left: ${elementGap};
    }
  }
  ${getBooleanFF(
    'platform.linking-platform.smart-card.enable-better-metadata_iojwg',
  )
    ? `[data-smart-element-group] {
       line-height: 1rem;
    }`
    : ``}
`;

export const footerBlockCss = css`
  ${!getBooleanFF(
    'platform.linking-platform.smart-card.enable-better-metadata_iojwg',
  )
    ? `padding-top: 0.25rem;`
    : ``}
`;

export const hiddenSnippetStyles = css`
  visibility: hidden;
  position: absolute;
`;
