/**
 * Everything about this file change is just wrong.
 * Mostly because we do bad things with classes.
 * This is all wrong and hopefully will be removed from existence with card v3,
 * so please don’t be too sad about all this!
 */

import styled from 'styled-components';

import { HTMLAttributes, ComponentClass } from 'react';
import {
  rgba,
  centerX,
  easeOutCubic,
  transition,
  antialiased,
} from '../../../styles';
import { borderRadius, size, ellipsis, absolute } from '@atlaskit/media-ui';
import { themed } from '@atlaskit/theme/components';
import * as colors from '@atlaskit/theme/colors';

export interface OverlayProps {
  hasError?: boolean;
  noHover?: boolean;
}

export const TickBox: ComponentClass<
  HTMLAttributes<{}> & OverlayProps
> = styled.div`
  ${size(14)} ${transition()} background-color: ${rgba('#ffffff', 0.5)};
  position: absolute;
  top: 8px;
  right: 8px;
  border-radius: 20px;
  color: #798599; /* TODO FIL-3884: Align color with new design */
  display: flex;
  opacity: 0;

  &.selected {
    opacity: 1;
    color: white;
    background-color: #0052cc; /* TODO FIL-3884: Align with tickbox icons */
  }

  /* Enforce dimensions of "tick" icon */
  svg {
    position: absolute;
    width: 14px;
  }
`;

export const Overlay: ComponentClass<
  HTMLAttributes<{}> & OverlayProps
> = styled.div`
  ${size()} ${absolute()} ${borderRadius} display: flex;
  justify-content: space-between;
  flex-direction: column;
  background: transparent;
  transition: 0.3s background ${easeOutCubic}, 0.3s border-color;
  padding: 16px;

  ${({ hasError, noHover }: OverlayProps) => {
    if (hasError || noHover) {
      return `
        cursor: default;

        &:hover {
          background: transparent;
        }
      `;
    }

    return '';
  }} &:not(.persistent):hover, &.active {
    .top-row {
      .title {
        color: ${colors.B400};
      }
    }

    .bottom-row {
      .delete-btn {
        display: flex;
      }
    }
  }

  &.noHover:hover {
    .top-row {
      .title {
        color: ${colors.N800};
      }
    }
  }

  .file-type-icon {
    display: block;
  }

  &:not(.persistent) {
    &:not(.error, .noHover):hover {
      background-color: ${rgba(colors.N900, 0.06)};
    }

    &.selectable {
      &.selected {
        background-color: ${colors.B200};

        &:hover {
          /* TODO FIL-3884 add new overlay with rgba(colors.N900, 0.16) */
        }

        .title,
        .bottom-row,
        .file-size,
        .more-btn {
          color: ${colors.N0};
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
        color: white;
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
        color: white;
        display: none;
      }

      .more-btn {
        color: ${colors.N0};
        display: none;

        &:hover {
          background-color: rgba(9, 30, 66, 0.2);
        }
      }

      .delete-btn {
        display: none;

        &:hover {
          background-color: rgba(9, 30, 66, 0.2);
        }
      }
    }

    &:hover,
    &.active {
      background-color: ${rgba(colors.N900, 0.5)};

      .title {
        opacity: 1;
        visibility: visible;
      }

      .file-type-icon,
      .file-size {
        display: block;
      }

      .more-btn {
        ${centerX} color: ${colors.N0};
      }

      .delete-btn {
        display: flex;
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
          background-color: ${colors.B200} !important;
          border-color: ${colors.B200} !important;
          color: white;
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
          color: ${colors.N800};
        }
      }
    }
  }
`;

export const ErrorLine = styled.div`
  height: 24px;
  display: flex;
  align-items: center;
`;

export const LeftColumn = styled.div`
  width: 100%;
  position: relative;
  box-sizing: border-box;
  vertical-align: middle;
`;

export const TopRow = styled.div``;

export const BottomRow = styled.div`
  display: flex;
  align-items: center;
  height: 16px;
`;

export const RightColumn = styled.div``;

export const ErrorMessage = styled.div`
  ${antialiased} display: inline-block;
  vertical-align: middle;
  font-weight: bold;
  color: ${colors.N70};
  font-size: 12px;
  line-height: 15px;
  overflow: hidden;
  max-width: ~'calc(100% - 24px)';
  text-overflow: ellipsis;
  white-space: nowrap;
  margin: auto 3px;
`;

export const AltWrapper = styled(ErrorMessage)`
  font-weight: normal;
`;

export const TitleWrapper = styled.div`
  box-sizing: border-box;
  word-wrap: break-word;
  color: ${themed({ light: colors.N800, dark: colors.DN900 })};
  font-size: 12px;
  line-height: 18px;
`;

export const Subtitle = styled.div`
  ${ellipsis('100px')} font-size: 12px;
  color: #5e6c84;
`;

export const Metadata = styled.div`
  display: flex;
  align-items: center;
`;
