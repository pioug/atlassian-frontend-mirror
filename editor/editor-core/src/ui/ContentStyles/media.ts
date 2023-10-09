import { css } from '@emotion/react';

import {
  mediaSingleSharedStyle,
  richMediaClassName,
} from '@atlaskit/editor-common/styles';
import {
  akEditorDeleteBackground,
  akEditorDeleteBorder,
  akEditorDeleteIconColor,
  akEditorMediaResizeHandlerPadding,
  akEditorMediaResizeHandlerPaddingWide,
  akEditorSelectedBorderBoldSize,
  akEditorSelectedNodeClassName,
} from '@atlaskit/editor-shared-styles';
import {
  fileCardImageViewSelector,
  inlinePlayerClassName,
  newFileExperienceClassName,
} from '@atlaskit/media-card';
import { B200, N60, Y500 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

export const mediaStyles = css`
  .ProseMirror {
    ${mediaSingleSharedStyle} & [layout='full-width'] .${richMediaClassName},
    & [layout='wide'] .${richMediaClassName} {
      margin-left: 50%;
      transform: translateX(-50%);
    }

    .media-extended-resize-experience[layout^='wrap-'] {
      // override 'overflow: auto' when viewport <= 410 set by mediaSingleSharedStyle
      // to prevent scroll bar
      overflow: visible !important;
    }

    & [layout^='wrap-'] + [layout^='wrap-'] {
      clear: none;
      & + p,
      & + div[class^='fabric-editor-align'],
      & + ul,
      & + ol,
      & + h1,
      & + h2,
      & + h3,
      & + h4,
      & + h5,
      & + h6 {
        clear: both !important;
      }
      & .${richMediaClassName} {
        margin-left: 0;
        margin-right: 0;
      }
    }

    .mediaSingleView-content-wrap[layout^='wrap-'] {
      max-width: 100%;
      // overwrite default Prosemirror setting making it clear: both
      clear: inherit;
    }

    .mediaSingleView-content-wrap[layout='wrap-left'] {
      float: left;
    }

    .mediaSingleView-content-wrap[layout='wrap-right'] {
      float: right;
    }

    .mediaSingleView-content-wrap[layout='wrap-right']
      + .mediaSingleView-content-wrap[layout='wrap-left'] {
      clear: both;
    }

    /* Larger margins for resize handlers when at depth 0 of the document */
    & > .mediaSingleView-content-wrap {
      .richMedia-resize-handle-right {
        margin-right: -${akEditorMediaResizeHandlerPaddingWide}px;
      }
      .richMedia-resize-handle-left {
        margin-left: -${akEditorMediaResizeHandlerPaddingWide}px;
      }
    }
  }

  .richMedia-resize-handle-right,
  .richMedia-resize-handle-left {
    display: flex;
    flex-direction: column;

    /* vertical align */
    justify-content: center;
  }

  .richMedia-resize-handle-right {
    align-items: flex-end;
    padding-right: ${token('space.150', '12px')};
    margin-right: -${akEditorMediaResizeHandlerPadding}px;
  }

  .richMedia-resize-handle-left {
    align-items: flex-start;
    padding-left: ${token('space.150', '12px')};
    margin-left: -${akEditorMediaResizeHandlerPadding}px;
  }

  .richMedia-resize-handle-right::after,
  .richMedia-resize-handle-left::after {
    content: ' ';
    display: flex;
    width: 3px;
    height: 64px;

    border-radius: 6px;
  }

  .${richMediaClassName}:hover .richMedia-resize-handle-left::after,
  .${richMediaClassName}:hover .richMedia-resize-handle-right::after {
    background: ${token('color.border', N60)};
  }

  .${akEditorSelectedNodeClassName} .richMedia-resize-handle-right::after,
  .${akEditorSelectedNodeClassName} .richMedia-resize-handle-left::after,
  .${richMediaClassName} .richMedia-resize-handle-right:hover::after,
  .${richMediaClassName} .richMedia-resize-handle-left:hover::after,
  .${richMediaClassName}.is-resizing .richMedia-resize-handle-right::after,
  .${richMediaClassName}.is-resizing .richMedia-resize-handle-left::after {
    background: ${token('color.border.focused', B200)};
  }

  .__resizable_base__ {
    left: unset !important;
    width: auto !important;
    height: auto !important;
  }

  /* Danger when top level node for smart cards / inline links */
  .danger > div > div > .media-card-frame,
  .danger > span > a {
    background-color: ${token(
      'color.background.danger',
      akEditorDeleteBackground,
    )};
    box-shadow: 0px 0px 0px ${akEditorSelectedBorderBoldSize}px
      ${token('color.border.danger', akEditorDeleteBorder)};
    transition: background-color 0s, box-shadow 0s;
  }
  /* Danger when nested node or common */
  .danger {
    /* Media single */
    .${richMediaClassName} .${fileCardImageViewSelector}::after {
      border: 1px solid ${token('color.border.danger', akEditorDeleteIconColor)};
    }
    /* Media single video player */
    .${richMediaClassName} .${inlinePlayerClassName}::after {
      border: 1px solid ${token('color.border.danger', akEditorDeleteIconColor)};
    }
    /* New file experience */
    .${richMediaClassName} .${newFileExperienceClassName} {
      box-shadow: 0 0 0 1px
        ${token('color.border.danger', akEditorDeleteIconColor)} !important;
    }
    /* Media resize legacy handlers */
    .richMedia-resize-handle-right::after,
    .richMedia-resize-handle-left::after {
      background: ${token(
        'color.icon.danger',
        akEditorDeleteIconColor,
      )} !important;
    }
    /* Media resize new handlers */
    .resizer-handle-thumb {
      background: ${token(
        'color.icon.danger',
        akEditorDeleteIconColor,
      )} !important;
    }

    /* Smart cards */
    div div .media-card-frame,
    .inlineCardView-content-wrap > span > a {
      background-color: ${token(
        'color.blanket.danger',
        'rgb(255, 189, 173, 0.5)',
      )}; /* R75 with 50% opactiy */
      transition: background-color 0s;
    }

    div div .media-card-frame::after {
      box-shadow: none;
    }
  }

  .warning {
    /* Media single */
    .${richMediaClassName} .${fileCardImageViewSelector}::after {
      border: 1px solid ${token('color.border.warning', Y500)};
    }

    .${richMediaClassName} .${inlinePlayerClassName}::after {
      border: 1px solid ${token('color.border.warning', Y500)};
    }

    .${richMediaClassName} .${newFileExperienceClassName} {
      box-shadow: 0 0 0 1px ${token('color.border.warning', Y500)} !important;
    }

    .resizer-handle-thumb {
      background: ${token('color.icon.warning', Y500)} !important;
    }
  }
`;

/* `left: unset` above is to work around Chrome bug where rendering a div with
 * that style applied inside a container that has a scroll, causes any svgs on
 * the page, without a border, that are inside a flexbox, to no longer align to
 * the center of their viewbox.
 *
 * for us, this means that all the toolbar icons start jumping around if
 * you make the viewport small
 */
