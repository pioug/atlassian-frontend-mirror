/**
 * Everything about this file change is just wrong.
 * Mostly because we do bad things with classes.
 * This is all wrong and hopefully will be removed from existence with card v3,
 * so please don’t be too sad about all this!
 */

import { css } from '@emotion/react';

import { borderRadius, size, ellipsis, absolute } from '@atlaskit/media-ui';
import { GlobalThemeTokens, themed } from '@atlaskit/theme/components';
import * as colors from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

import { rgba, easeOutCubic, transition, antialiased } from '../../styles';

export interface OverlayProps {
  hasError?: boolean;
  noHover?: boolean;
  className?: string;
  children?: JSX.Element[];
}

export const tickBoxStyles = css`
  ${size(14)}
  ${transition()}
  background-color: ${token('elevation.surface.overlay', rgba('#ffffff', 0.5))};
  position: absolute;
  top: 8px;
  right: 8px;
  border-radius: 20px;
  color: ${token(
    'color.icon.subtle',
    '#798599',
  )}; /* CLEANUP - TODO FIL-3884: Align color with new design */
  display: flex;
  opacity: 0;

  &.selected {
    opacity: 1;
    color: ${token('color.icon.inverse', 'white')};
    background-color: ${token(
      'color.icon.selected',
      '#0052cc',
    )}; /* CLEANUP - TODO FIL-3884: Align with tickbox icons */
  }

  /* Enforce dimensions of "tick" icon */
  svg {
    position: absolute;
    width: 14px;
  }
`;

const getOverlayStyles = ({ hasError, noHover }: OverlayProps) => {
  if (hasError || noHover) {
    return `
        cursor: default;

        &:hover {
          background: transparent;
        }
      `;
  }
};

export const overlayStyles = (props: OverlayProps) => css`
  ${size()}
  ${absolute()}
  ${borderRadius} display: flex;
  justify-content: space-between;
  flex-direction: column;
  background: transparent;
  transition: 0.3s background ${easeOutCubic}, 0.3s border-color;
  padding: 16px;

  ${getOverlayStyles(props)}
  &:not(.persistent):hover, &.active {
    .top-row {
      .title {
        color: ${token('color.text.information', colors.B400)};
      }
    }
  }

  &.noHover:hover {
    .top-row {
      .title {
        color: ${token('color.text', colors.N800)};
      }
    }
  }

  .file-type-icon {
    display: block;
  }

  &:not(.persistent) {
    &:not(.error, .noHover):hover {
      background-color: ${token(
        'color.background.neutral.hovered',
        rgba(colors.N900, 0.06),
      )};
    }

    &.selectable {
      &.selected {
        background-color: ${token('color.background.selected', colors.B200)};

        &:hover {
          /* CLEANUP - TODO FIL-3884 add new overlay with rgba(colors.N900, 0.16) */
          background-color: ${token(
            'color.background.selected.hovered',
            rgba(colors.N900, 0.16),
          )};
        }

        .title,
        .bottom-row,
        .file-size {
          color: ${token('color.text', colors.N900)};
        }
      }
    }
  }

  &.persistent {
    &:not(.active) {
      overflow: hidden;
    }

    .top-row {
      .title {
        transition: opacity 0.3s;
        opacity: 0;
        color: ${token('color.text', 'white')};
        visibility: hidden;
      }
    }

    .bottom-row {
      opacity: 0;
      transition: transform 0.2s, opacity 0.5s;
      /* This is the height of the overlay footer, needs to be present now since the parent uses flex and 100% doesn't look right anymore */
      transform: translateY(35px);

      .file-type-icon {
        display: none;
      }

      .file-size {
        color: ${token('color.text', 'white')};
        display: none;
      }
    }

    &:hover,
    &.active {
      background-color: ${token(
        'color.interaction.hovered',
        rgba(colors.N900, 0.5),
      )};

      .title {
        opacity: 1;
        visibility: visible;
      }

      .file-type-icon,
      .file-size {
        display: block;
      }

      .bottom-row {
        opacity: 1;
        transform: translateY(0);
      }
    }

    /* Selectable */
    &.selectable {
      &:hover {
        .tickbox {
          opacity: 1;
        }
      }

      &.selected {
        .tickbox {
          background-color: ${token(
            'color.background.selected.bold',
            colors.B200,
          )} !important;
          color: ${token('color.icon.inverse', 'white')};
        }
      }
    }
  }

  &.error {
    .top-row {
      overflow: visible;
    }
    &:hover,
    &.active {
      .top-row {
        .title {
          color: ${token('color.text', colors.N800)};
        }
      }
    }
  }
`;

export const errorLineStyles = css`
  height: 24px;
  display: flex;
  align-items: center;
`;

export const leftColumnStyles = css`
  width: 100%;
  position: relative;
  box-sizing: border-box;
  vertical-align: middle;
`;

export const topRowStyles = css``;

export const bottomRowStyles = css`
  display: flex;
  align-items: center;
  height: 16px;
`;

export const rightColumnStyles = css``;

export const errorMessageStyles = css`
  ${antialiased} display: inline-block;
  vertical-align: middle;
  font-weight: bold;
  color: ${token('color.text.subtlest', colors.N70)};
  font-size: 12px;
  line-height: 15px;
  overflow: hidden;
  max-width: 'calc(100% - 24px)';
  text-overflow: ellipsis;
  white-space: nowrap;
  margin: auto 3px;
`;

export const altWrapperStyles = css`
  ${errorMessageStyles}
  font-weight: normal;
`;

export const titleWrapperStyles = (theme: GlobalThemeTokens) => css`
  box-sizing: border-box;
  word-wrap: break-word;
  color: ${themed({
    light: token('color.text', colors.N800),
    dark: token('color.text', colors.DN900),
  })({ theme })};
  font-size: 12px;
  line-height: 18px;
`;

export const subtitleStyles = css`
  ${ellipsis('100px')} font-size: 12px;
  color: ${token('color.text.subtlest', '#5e6c84')};
`;

export const metadataStyles = css`
  display: flex;
  align-items: center;
`;
