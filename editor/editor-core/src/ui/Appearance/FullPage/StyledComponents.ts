import { css } from '@emotion/react';

import { decisionListSelector, taskListSelector } from '@atlaskit/adf-schema';
import { tableFullPageEditorStyles } from '@atlaskit/editor-plugins/table/ui/common-styles';
import { tableMarginFullWidthMode } from '@atlaskit/editor-plugins/table/ui/consts';
import {
  akEditorContextPanelWidth,
  akEditorFullWidthLayoutWidth,
  akEditorGutterPadding,
  akEditorSwoopCubicBezier,
  akLayoutGutterOffset,
  ATLASSIAN_NAVIGATION_HEIGHT,
} from '@atlaskit/editor-shared-styles';
import { token } from '@atlaskit/tokens';

import { createEditorContentStyle } from '../../ContentStyles';
import { scrollbarStyles } from '../../styles';

const SWOOP_ANIMATION = `0.5s ${akEditorSwoopCubicBezier}`;
const TOTAL_PADDING = akEditorGutterPadding * 2;

export const fullPageEditorWrapper = css({
  minWidth: '340px',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  boxSizing: 'border-box',
});

const scrollStyles = css(
  {
    flexGrow: 1,
    height: '100%',
    overflowY: 'scroll',
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    scrollBehavior: 'smooth',
  },
  scrollbarStyles,
);

export const ScrollContainer = createEditorContentStyle(scrollStyles);
ScrollContainer.displayName = 'ScrollContainer';

// transition used to match scrollbar with config panel opening animation
// only use animation when opening as there is a bug with floating toolbars.
export const positionedOverEditorStyle = css({
  // eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage/preview
  paddingRight: `${akEditorContextPanelWidth}px`,
  transition: `padding 500ms ${akEditorSwoopCubicBezier}`,
  '.fabric-editor-popup-scroll-parent': {
    // eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage/preview
    paddingLeft: `${akEditorContextPanelWidth}px`,
    transition: `padding 500ms ${akEditorSwoopCubicBezier}`,
  },
});

export const contentArea = css({
  display: 'flex',
  flexDirection: 'row',
  height: `calc(100% - ${ATLASSIAN_NAVIGATION_HEIGHT})`,
  boxSizing: 'border-box',
  margin: 0,
  padding: 0,
  transition: `padding 0ms ${akEditorSwoopCubicBezier}`,
});

export const contentAreaHeightNoToolbar = css({
  height: '100%',
});

export const sidebarArea = css({
  height: '100%',
  boxSizing: 'border-box',
  alignSelf: 'flex-end',
});

// initially hide until we have a containerWidth and can properly size them,
// otherwise they can cause the editor width to extend which is non-recoverable
export const editorContentAreaHideContainer = css({
  '.fabric-editor--full-width-mode': {
    '.pm-table-container, .code-block, .extension-container': {
      display: 'none',
    },
    '.multiBodiedExtension--container': {
      display: 'none',
    },
  },
});

/* Prevent horizontal scroll on page in full width mode */
const editorContentAreaContainerStyle = (containerWidth: number) =>
  css({
    '.fabric-editor--full-width-mode': {
      '.code-block, .extension-container': {
        maxWidth: `${
          containerWidth - TOTAL_PADDING - tableMarginFullWidthMode * 2
        }px`,
      },
      '.extension-container.inline': {
        maxWidth: '100%',
      },
      'td .extension-container.inline': {
        maxWidth: 'inherit',
      },
      '.multiBodiedExtension--container': {
        maxWidth: `${
          containerWidth - TOTAL_PADDING - tableMarginFullWidthMode * 2
        }px`,
      },
      '[data-layout-section]': {
        maxWidth: `${
          containerWidth - TOTAL_PADDING + akLayoutGutterOffset * 2
        }px`,
      },
    },
  });

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

const editorContentAreaWithLayoutWith = (layoutMaxWidth: number) =>
  css({
    maxWidth: `${layoutMaxWidth + TOTAL_PADDING}px`,
  });

const editorContentArea = css(
  {
    lineHeight: '24px',
    paddingTop: token('space.600', '48px'),
    paddingBottom: token('space.600', '48px'),
    height: 'calc( 100% - 105px )',
    width: '100%',
    margin: 'auto',
    flexDirection: 'column',
    flexGrow: 1,
    maxWidth: `${akEditorFullWidthLayoutWidth + TOTAL_PADDING}px`,
    transition: `max-width ${SWOOP_ANIMATION}`,
    '& .ProseMirror': {
      flexGrow: 1,
      boxSizing: 'border-box',
      '& > *': {
        clear: 'both',
      },
      [`> p, > ul, > ol:not(${taskListSelector}):not(${decisionListSelector}), > h1, > h2, > h3, > h4, > h5, > h6`]:
        {
          clear: 'none',
        },
      '> p:last-child': {
        marginBottom: token('space.300', '24px'),
      },
    },
  },
  tableFullPageEditorStyles,
  {
    '.fabric-editor--full-width-mode': {
      '.fabric-editor-breakout-mark, .extension-container.block, .pm-table-container':
        {
          width: '100% !important',
        },
      '.fabric-editor-breakout-mark': {
        // eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage/preview
        marginLeft: 'unset !important',
        transform: 'none !important',
      },
    },
  },
);

export const editorContentGutterStyle = css({
  boxSizing: 'border-box',
  padding: `0 ${token('space.400', '32px')}`,
});
