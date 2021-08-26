import { css } from 'styled-components';
import {
  mediaSingleSharedStyle,
  richMediaClassName,
} from '@atlaskit/editor-common';
import {
  akEditorDeleteBorder,
  akEditorDeleteBackground,
  akEditorSelectedBorderBoldSize,
  akEditorMediaResizeHandlerPaddingWide,
  akEditorMediaResizeHandlerPadding,
  akEditorSelectedNodeClassName,
  akEditorDeleteIconColor,
} from '@atlaskit/editor-shared-styles';
import { N60, B200 } from '@atlaskit/theme/colors';
import {
  fileCardImageViewSelector,
  fileCardImageViewSelectedSelector,
  inlinePlayerClassName,
  newFileExperienceClassName,
} from '@atlaskit/media-card';

export const mediaStyles = css`
  .ProseMirror {
    ${mediaSingleSharedStyle} & [layout='full-width'] .${richMediaClassName},
    & [layout='wide'] .${richMediaClassName} {
      margin-left: 50%;
      transform: translateX(-50%);
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
    padding-right: 12px;
    margin-right: -${akEditorMediaResizeHandlerPadding}px;
  }

  .richMedia-resize-handle-left {
    align-items: flex-start;
    padding-left: 12px;
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
    background: ${N60};
  }

  .${akEditorSelectedNodeClassName} .richMedia-resize-handle-right::after,
  .${akEditorSelectedNodeClassName} .richMedia-resize-handle-left::after,
  .${richMediaClassName} .richMedia-resize-handle-right:hover::after,
  .${richMediaClassName} .richMedia-resize-handle-left:hover::after,
  .${richMediaClassName}.is-resizing .richMedia-resize-handle-right::after,
  .${richMediaClassName}.is-resizing .richMedia-resize-handle-left::after {
    background: ${B200};
  }

  .__resizable_base__ {
    left: unset !important;
    width: auto !important;
    height: auto !important;
  }

  /* Danger when top level node for smart cards / inline links */
  .danger > div > div > .media-card-frame,
  .danger > span > a {
    background-color: ${akEditorDeleteBackground};
    box-shadow: 0px 0px 0px ${akEditorSelectedBorderBoldSize}px
      ${akEditorDeleteBorder};
    transition: background-color 0s;
    transition: box-shadow 0s;
  }
  .mediaGroupView-content-wrap.danger {
    /* Media inline */
    .${fileCardImageViewSelectedSelector}::after {
      border: 1px solid ${akEditorDeleteIconColor};
    }
  }
  /* Danger when nested node or common */
  .danger {
    /* Media single */
    .${richMediaClassName} .${fileCardImageViewSelector}::after {
      border: 1px solid ${akEditorDeleteIconColor};
    }
    /* Media single video player */
    .${richMediaClassName} .${inlinePlayerClassName}::after {
      border: 1px solid ${akEditorDeleteIconColor};
    }
    /* New file experience */
    .${richMediaClassName} .${newFileExperienceClassName} {
      box-shadow: 0 0 0 1px ${akEditorDeleteIconColor} !important;
    }
    /* Media resize handlers */
    .richMedia-resize-handle-right::after,
    .richMedia-resize-handle-left::after {
      background: ${akEditorDeleteIconColor};
    }

    /* Smart cards */
    div div .media-card-frame,
    .inlineCardView-content-wrap > span > a {
      background-color: rgb(255, 189, 173, 0.5); /* R75 with 50% opactiy */
      transition: background-color 0s;
    }

    div div .media-card-frame::after {
      box-shadow: none;
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
