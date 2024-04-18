import { css } from '@emotion/react';
import { separatorCss } from '../../../styled';

const elementGap = '0.5rem';

// eslint-disable-next-line @atlaskit/design-system/no-css-tagged-template-expression -- needs manual remediation
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

  [data-smart-element-group] {
    line-height: 1rem;
  }
`;

export const footerBlockCss = css({
  height: '1.5rem',
});

export const hiddenSnippetStyles = css({
  visibility: 'hidden',
  position: 'absolute',
});
