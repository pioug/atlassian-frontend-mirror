import { css } from '@emotion/react';
import {
  akEditorFullWidthLayoutWidth,
  akEditorGutterPadding,
  akEditorSwoopCubicBezier,
  akLayoutGutterOffset,
  ATLASSIAN_NAVIGATION_HEIGHT,
  akEditorContextPanelWidth,
} from '@atlaskit/editor-shared-styles';
import { taskListSelector, decisionListSelector } from '@atlaskit/adf-schema';
import { createEditorContentStyle } from '../../ContentStyles';
import { tableFullPageEditorStyles } from '@atlaskit/editor-plugin-table/ui/common-styles';
import { tableMarginFullWidthMode } from '@atlaskit/editor-plugin-table/ui/consts';
import { scrollbarStyles } from '../../styles';

const SWOOP_ANIMATION = `0.5s ${akEditorSwoopCubicBezier}`;
const TOTAL_PADDING = akEditorGutterPadding * 2;

export const fullPageEditorWrapper = css`
  min-width: 340px;
  height: 100%;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
`;

const scrollStyles = css`
  flex-grow: 1;
  height: 100%;
  overflow-y: scroll;
  position: relative;
  display: flex;
  flex-direction: column;
  scroll-behavior: smooth;
  ${scrollbarStyles};
`;

export const ScrollContainer = createEditorContentStyle(scrollStyles);
ScrollContainer.displayName = 'ScrollContainer';

// transition used to match scrollbar with config panel opening animation
// only use animation when opening as there is a bug with floating toolbars.
export const positionedOverEditorStyle = css`
  padding-right: ${akEditorContextPanelWidth}px;
  transition: padding 500ms ${akEditorSwoopCubicBezier};

  .fabric-editor-popup-scroll-parent {
    padding-left: ${akEditorContextPanelWidth}px;
    transition: padding 500ms ${akEditorSwoopCubicBezier};
  }
`;

export const contentArea = css`
  display: flex;
  flex-direction: row;
  height: calc(100% - ${ATLASSIAN_NAVIGATION_HEIGHT});
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  transition: padding 0ms ${akEditorSwoopCubicBezier};
`;

export const sidebarArea = css`
  height: 100%;
  box-sizing: border-box;
  align-self: flex-end;
`;

// initially hide until we have a containerWidth and can properly size them,
// otherwise they can cause the editor width to extend which is non-recoverable
export const editorContentAreaHideContainer = css`
  .fabric-editor--full-width-mode {
    .pm-table-container,
    .code-block,
    .extension-container {
      display: none;
    }
  }
`;

/* Prevent horizontal scroll on page in full width mode */
const editorContentAreaContainerStyle = (containerWidth: number) => css`
  .fabric-editor--full-width-mode {
    .pm-table-container,
    .code-block,
    .extension-container {
      max-width: ${containerWidth -
      TOTAL_PADDING -
      tableMarginFullWidthMode * 2}px;
    }

    [data-layout-section] {
      max-width: ${containerWidth - TOTAL_PADDING + akLayoutGutterOffset * 2}px;
    }
  }
`;

export const editorContentAreaStyle = ({
  layoutMaxWidth,
  fullWidthMode,
  containerWidth,
}: {
  layoutMaxWidth: number;
  fullWidthMode: boolean;
  containerWidth?: number;
}) => [
  editorContentArea,
  !fullWidthMode && editorContentAreaWithLayoutWith(layoutMaxWidth),
  containerWidth
    ? editorContentAreaContainerStyle(containerWidth)
    : editorContentAreaHideContainer,
];

const editorContentAreaWithLayoutWith = (layoutMaxWidth: number) => css`
  max-width: ${layoutMaxWidth + TOTAL_PADDING}px;
`;

const editorContentArea = css`
  line-height: 24px;
  padding-top: 50px;
  padding-bottom: 55px;
  height: calc(
    100% - 105px
  ); /* fill the viewport: 100% - (padding top & bottom) */
  width: 100%;
  margin: auto;
  flex-direction: column;
  flex-grow: 1;

  max-width: ${akEditorFullWidthLayoutWidth + TOTAL_PADDING}px;
  transition: max-width ${SWOOP_ANIMATION};
  & .ProseMirror {
    flex-grow: 1;
    box-sizing: border-box;
  }

  & .ProseMirror {
    & > * {
      /* pre-emptively clear all direct descendant content, just in case any are adjacent floated content */
      clear: both;
    }
    > p,
    > ul,
    > ol:not(${taskListSelector}):not(${decisionListSelector}),
    > h1,
    > h2,
    > h3,
    > h4,
    > h5,
    > h6 {
      /* deliberately allow wrapping of text based nodes, just in case any are adjacent floated content */
      clear: none;
    }

    > p:last-child {
      margin-bottom: 24px;
    }
  }

  ${tableFullPageEditorStyles};

  .fabric-editor--full-width-mode {
    /* Full Width Mode styles for ignoring breakout sizes */
    .fabric-editor-breakout-mark,
    .extension-container.block,
    .pm-table-container {
      width: 100% !important;
    }

    .fabric-editor-breakout-mark {
      margin-left: unset !important;
      transform: none !important;
    }
  }
`;

export const editorContentGutterStyle = css`
  box-sizing: border-box;
  padding: 0 ${akEditorGutterPadding}px;
`;
