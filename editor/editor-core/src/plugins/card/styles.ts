import { css } from 'styled-components';

import {
  SelectionStyle,
  getSelectionStyles,
  akEditorDeleteBorder,
  akEditorDeleteBackground,
} from '@atlaskit/editor-shared-styles';
import { N20 } from '@atlaskit/theme/colors';
import { SmartCardSharedCssClassName } from '@atlaskit/editor-common';
import { akEditorSelectedNodeClassName } from '@atlaskit/editor-shared-styles';

export const smartCardStyles = css`
  .${SmartCardSharedCssClassName.INLINE_CARD_CONTAINER} {
    max-width: calc(100% - 20px);
    vertical-align: top;
    word-break: break-all;

    .card {
      padding-left: 2px;
      padding-right: 2px;

      .${SmartCardSharedCssClassName.LOADER_WRAPPER} > a:focus {
        ${getSelectionStyles([SelectionStyle.BoxShadow])}
      }
    }

    &.${akEditorSelectedNodeClassName}
      .${SmartCardSharedCssClassName.LOADER_WRAPPER}
      > a {
      ${getSelectionStyles([SelectionStyle.BoxShadow])}
    }
    .${SmartCardSharedCssClassName.LOADER_WRAPPER} > a {
      /* EDM-1717: box-shadow Safari fix start */
      z-index: 1;
      position: relative;
      /* EDM-1717: box-shadow Safari fix end */
    }

    &.danger {
      .${SmartCardSharedCssClassName.LOADER_WRAPPER} > a {
        box-shadow: 0 0 0 1px ${akEditorDeleteBorder};
        /* EDM-1717: box-shadow Safari fix start */
        z-index: 2;
        /* EDM-1717: box-shadow Safari fix end */
      }
    }
  }

  .${SmartCardSharedCssClassName.BLOCK_CARD_CONTAINER} {
    .${SmartCardSharedCssClassName.LOADER_WRAPPER} > div {
      cursor: pointer;
      &:hover {
        background-color: ${N20};
      }
    }

    &.${akEditorSelectedNodeClassName}
      .${SmartCardSharedCssClassName.LOADER_WRAPPER}
      > div {
      ${getSelectionStyles([SelectionStyle.BoxShadow])}
    }

    &.danger {
      .${SmartCardSharedCssClassName.LOADER_WRAPPER} > div {
        box-shadow: 0 0 0 1px ${akEditorDeleteBorder} !important;
      }
    }
  }

  .${SmartCardSharedCssClassName.EMBED_CARD_CONTAINER} {
    .${SmartCardSharedCssClassName.LOADER_WRAPPER} > div {
      cursor: pointer;
      &::after {
        transition: box-shadow 0s;
      }
    }
    &.${akEditorSelectedNodeClassName}
      .${SmartCardSharedCssClassName.LOADER_WRAPPER}
      > div {
      ${getSelectionStyles([SelectionStyle.BoxShadow])}
    }

    &.${akEditorSelectedNodeClassName}
      .${SmartCardSharedCssClassName.LOADER_WRAPPER}
      > div::after {
      ${getSelectionStyles([SelectionStyle.BoxShadow])}
    }

    &.danger {
      .media-card-frame::after {
        box-shadow: 0 0 0 1px ${akEditorDeleteBorder} !important;
        background: ${akEditorDeleteBackground} !important;
      }
      .richMedia-resize-handle-right::after,
      .richMedia-resize-handle-left::after {
        background: ${akEditorDeleteBorder};
      }
    }
  }
`;
