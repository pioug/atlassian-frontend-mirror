import { css } from '@emotion/react';
import { loadingPlaceholderClassName } from '../../index';
import { SmartLinkSize } from '../../constants';
import { type FlexibleUiOptions } from '../FlexibleCard/types';
import { layers } from '@atlaskit/theme/constants';
import { token } from '@atlaskit/tokens';
import { getBooleanFF } from '@atlaskit/platform-feature-flags';

// Temporary fix for Confluence inline comment on editor mod has z-index of 500, Jira issue view has z-index of 510
export const HOVER_CARD_Z_INDEX = layers.modal();

export const flexibleUiOptions: FlexibleUiOptions = {
  hideBackground: true,
  hideElevation: true,
  size: SmartLinkSize.Medium,
  hideHoverCardPreviewButton: false,
  zIndex: HOVER_CARD_Z_INDEX + 1,
};

export const CARD_WIDTH_REM = 24;
export const NEW_CARD_WIDTH_REM = 25;
// gap between mouse cursor and hover card
export const CARD_GAP_PX = 10;

const blockGap = '0.5rem';
const elementGap = '0.5rem';

export const separatorCss = css({
  '[data-separator] + [data-separator]:before': {
    marginRight: elementGap,
  },
});

// eslint-disable-next-line @atlaskit/design-system/no-css-tagged-template-expression -- needs manual remediation
export const HoverCardContainer = css`
  background: none;
  border-width: 0;
  box-sizing: border-box;
  width: ${getBooleanFF(
    'platform.linking-platform.smart-card.hover-card-ai-summaries',
  )
    ? NEW_CARD_WIDTH_REM
    : CARD_WIDTH_REM}rem;

  .${loadingPlaceholderClassName} {
    display: none;
  }
`;

// eslint-disable-next-line @atlaskit/design-system/no-css-tagged-template-expression -- needs manual remediation
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

  [data-smart-element='Title'] {
    font-weight: 600;
  }
`;

export const getTransitionStyles = (snippetHeight: number) =>
  css({
    transition: 'height 300ms ease-in-out',
    height: `${snippetHeight}px`,
  });

export const popupContainerStyles = css({
  borderRadius: token('border.radius.200', '8px'),
  backgroundColor: token('elevation.surface.overlay', 'white'),
  boxShadow: token(
    'elevation.shadow.overlay',
    '0px 8px 12px rgba(9, 30, 66, 0.15),0px 0px 1px rgba(9, 30, 66, 0.31)',
  ),
});

export const getPreviewBlockStyles = (previewHeight?: number) =>
  css(previewHeight ? `height: ${previewHeight}px;` : '', {
    borderTopLeftRadius: token('border.radius.200', '8px'),
    borderTopRightRadius: token('border.radius.200', '8px'),
    marginBottom: blockGap,
  });
