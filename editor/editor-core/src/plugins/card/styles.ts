import { css } from '@emotion/react';

import {
  SelectionStyle,
  getSelectionStyles,
  akEditorDeleteBorder,
  akEditorDeleteBackground,
  akEditorRuleBorderRadius,
} from '@atlaskit/editor-shared-styles';
import { N0, N20, N40 } from '@atlaskit/theme/colors';
import { SmartCardSharedCssClassName } from '@atlaskit/editor-common/styles';
import { akEditorSelectedNodeClassName } from '@atlaskit/editor-shared-styles';
import { token } from '@atlaskit/tokens';
import { DATASOURCE_INNER_CONTAINER_CLASSNAME } from './nodeviews/datasource';

export const FLOATING_TOOLBAR_LINKPICKER_CLASSNAME =
  'card-floating-toolbar--link-picker';

export const smartCardStyles = css`
  .${SmartCardSharedCssClassName.INLINE_CARD_CONTAINER} {
    max-width: calc(100% - 20px);
    vertical-align: top;
    word-break: break-all;

    .card {
      padding-left: 2px;
      padding-right: 2px;
      padding-top: 0.5em;
      padding-bottom: 0.5em;
      margin-bottom: -0.5em;

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
        box-shadow: 0 0 0 1px
          ${token('color.border.danger', akEditorDeleteBorder)};
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
        background-color: ${token(
          'color.background.neutral.subtle.hovered',
          N20,
        )};
      }
    }

    &.${akEditorSelectedNodeClassName}
      .${SmartCardSharedCssClassName.LOADER_WRAPPER}
      > div {
      ${getSelectionStyles([SelectionStyle.BoxShadow])}
    }

    &.danger {
      .${SmartCardSharedCssClassName.LOADER_WRAPPER} > div {
        box-shadow: 0 0 0 1px
          ${token('color.border.danger', akEditorDeleteBorder)} !important;
      }
    }
  }

  .${SmartCardSharedCssClassName.DATASOURCE_CONTAINER}.${SmartCardSharedCssClassName.BLOCK_CARD_CONTAINER} {
    max-width: 100%;
    display: flex;
    justify-content: center;

    .${DATASOURCE_INNER_CONTAINER_CLASSNAME} {
      cursor: pointer;
      background-color: ${token('color.background.neutral.subtle', N0)};
      border-radius: ${token('border.radius.100', akEditorRuleBorderRadius)};
      border: 1px solid ${token('color.border', N40)};
    }

    &.${akEditorSelectedNodeClassName} {
      .${DATASOURCE_INNER_CONTAINER_CLASSNAME} {
        ${getSelectionStyles([SelectionStyle.BoxShadow])}
      }
    }

    &.danger {
      .${DATASOURCE_INNER_CONTAINER_CLASSNAME} {
        box-shadow: 0 0 0 1px
          ${token('color.border.danger', akEditorDeleteBorder)};
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
        box-shadow: 0 0 0 1px
          ${token('color.border.danger', akEditorDeleteBorder)} !important;
        background: ${token(
          'color.background.danger',
          akEditorDeleteBackground,
        )} !important;
      }
      .richMedia-resize-handle-right::after,
      .richMedia-resize-handle-left::after {
        background: ${token('color.border.danger', akEditorDeleteBorder)};
      }
    }
  }

  .${FLOATING_TOOLBAR_LINKPICKER_CLASSNAME} {
    padding: 0;
  }
`;
