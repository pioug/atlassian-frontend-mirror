import { css } from '@emotion/react';
import { loadingPlaceholderClassName } from '../../index';
import { SmartLinkSize, SmartLinkTheme } from '../../constants';
import { FlexibleUiOptions } from '../FlexibleCard/types';
import { layers } from '@atlaskit/theme/constants';

// Temporary fix for Confluence inline comment on editor mod has z-index of 500, Jira issue view has z-index of 510
export const HOVER_CARD_Z_INDEX = layers.modal();

export const flexibleUiOptions: FlexibleUiOptions = {
  hideBackground: true,
  hideElevation: true,
  size: SmartLinkSize.Medium,
  // eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage
  theme: SmartLinkTheme.Black,
  hidePadding: true,
  hideHoverCardPreviewButton: false,
  zIndex: HOVER_CARD_Z_INDEX + 1,
};

export const CARD_WIDTH_REM = 24;
// gap between mouse cursor and hover card
export const CARD_GAP_PX = 10;

const blockGap = '0.5rem';
const elementGap = '0.5rem';

export const separatorCss = css`
  [data-separator] + [data-separator]:before {
    margin-right: ${elementGap};
  }
`;

export const HoverCardContainer = css`
  background: none;
  border-width: 0;
  box-sizing: border-box;
  width: ${CARD_WIDTH_REM}rem;
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
    display: flex;
    /* subtitle element group */
    > [data-smart-element-group] {
      > span {
        margin-right: ${elementGap};
      }
    }
  }
`;

export const getTransitionStyles = (snippetHeight: number) => css`
  transition: height 300ms ease-in-out;
  height: ${snippetHeight}px;
`;
