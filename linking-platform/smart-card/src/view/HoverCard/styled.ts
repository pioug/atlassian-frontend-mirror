import { css } from '@emotion/react';
import { loadingPlaceholderClassName } from '../../index';
import { SmartLinkSize, SmartLinkTheme } from '../../constants';
import { FlexibleUiOptions } from '../FlexibleCard/types';
import { layers } from '@atlaskit/theme/constants';
import { token } from '@atlaskit/tokens';
import { themed } from '@atlaskit/theme/components';
import { getBooleanFF } from '@atlaskit/platform-feature-flags';

// Temporary fix for Confluence inline comment on editor mod has z-index of 500, Jira issue view has z-index of 510
export const HOVER_CARD_Z_INDEX = layers.modal();

export const flexibleUiOptions: FlexibleUiOptions = {
  hideBackground: true,
  hideElevation: true,
  size: SmartLinkSize.Medium,
  hidePadding: true,
  hideHoverCardPreviewButton: false,
  zIndex: HOVER_CARD_Z_INDEX + 1,
  ...(!getBooleanFF(
    'platform.linking-platform.smart-card.enable-better-metadata_iojwg',
  ) && { theme: SmartLinkTheme.Black }),
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

  ${getBooleanFF(
    'platform.linking-platform.smart-card.show-smart-links-refreshed-design',
  )
    ? `[data-smart-element="Title"] {
          font-weight: 600;
        }`
    : ``}
`;

export const getTransitionStyles = (snippetHeight: number) => css`
  transition: height 300ms ease-in-out;
  height: ${snippetHeight}px;
`;

export const popupContainerStyles = css`
  border-radius: ${token('border.radius.300', '12px')};
  background-color: ${themed({
    light: token('elevation.surface.raised', 'white'),
    dark: token('elevation.surface.raised', '#262B31'),
  })()};
  box-shadow: ${themed({
    light: token(
      'elevation.shadow.overlay',
      '0px 8px 12px rgba(9, 30, 66, 0.15),0px 0px 1px rgba(9, 30, 66, 0.31)',
    ),
    dark: token(
      'elevation.shadow.overlay',
      '0px 0px 0px rgba(188, 214, 240, 0.12),0px 8px 12px rgba(3, 4, 4, 0.36),0px 0px 1px rgba(3, 4, 4, 0.5)',
    ),
  })()};
`;
