import { css } from '@emotion/core';
import { loadingPlaceholderClassName } from '../../index';
import { SmartLinkSize, SmartLinkTheme } from '../../constants';
import { FlexibleUiOptions } from '../FlexibleCard/types';

export const flexibleUiOptions: FlexibleUiOptions = {
  hideElevation: true,
  size: SmartLinkSize.Medium,
  // eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage
  theme: SmartLinkTheme.Black,
  hidePadding: true,
};

const blockGap = '0.5rem';
const elementGap = '0.5rem';

const separatorCss = css`
  [data-separator] + [data-separator]:before {
    margin-right: ${elementGap};
  }
`;

export const HoverCardContainer = css`
  background: none;
  border-width: 0;
  box-sizing: border-box;
  width: 24rem;
  padding: 1rem;

  .${loadingPlaceholderClassName} {
    display: none;
  }
`;

export const titleBlockCss = css`
  gap: ${blockGap};

  ${separatorCss}

  // title and subtitle element group
  [data-smart-element-group] {
    // gap between title and subtitle
    gap: 0.06rem;

    /* subtitle element group */
    > [data-smart-element-group] {
      > span {
        margin-right: ${elementGap};
      }
    }
  }
`;

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
`;

export const footerBlockCss = css`
  padding-top: 0.25rem;
`;
