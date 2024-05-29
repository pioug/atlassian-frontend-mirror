/* eslint-disable @atlaskit/design-system/consistent-css-prop-usage */
/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable @atlaskit/design-system/no-css-tagged-template-expression -- Requires manual remediation over time due to use of unsafe nested mixins */
/** @jsx jsx */
import React, { useMemo } from 'react';

import type { SerializedStyles } from '@emotion/react';
import { css, jsx, useTheme } from '@emotion/react';

import { telepointerStyle } from '@atlaskit/editor-common/collab';
import { EmojiSharedCssClassName } from '@atlaskit/editor-common/emoji';
import { useSharedPluginState } from '@atlaskit/editor-common/hooks';
import { MentionSharedCssClassName } from '@atlaskit/editor-common/mention';
import { gapCursorStyles } from '@atlaskit/editor-common/selection';
import {
  annotationSharedStyles,
  backgroundColorStyles,
  blockMarksSharedStyles,
  codeBlockInListSafariFix,
  codeMarkSharedStyles,
  dateSharedStyle,
  embedCardStyles,
  gridStyles,
  indentationSharedStyles,
  linkSharedStyle,
  listsSharedStyles,
  MediaSharedClassNames,
  paragraphSharedStyles,
  resizerStyles,
  ruleSharedStyles,
  shadowSharedStyle,
  SmartCardSharedCssClassName,
  smartCardSharedStyles,
  smartCardStyles,
  tasksAndDecisionsStyles,
  textColorStyles,
  unsupportedStyles,
  whitespaceSharedStyles,
} from '@atlaskit/editor-common/styles';
import { type OptionalPlugin } from '@atlaskit/editor-common/types';
import { browser } from '@atlaskit/editor-common/utils';
import { blocktypeStyles } from '@atlaskit/editor-plugins/block-type/styles';
import type { EditorViewModePlugin } from '@atlaskit/editor-plugins/editor-viewmode';
import { findReplaceStyles } from '@atlaskit/editor-plugins/find-replace/styles';
import { textHighlightStyle } from '@atlaskit/editor-plugins/paste-options-toolbar/styles';
import { placeholderTextStyles } from '@atlaskit/editor-plugins/placeholder-text/styles';
import { tableStyles } from '@atlaskit/editor-plugins/table/ui/common-styles';
import {
  akEditorDeleteBackgroundWithOpacity,
  akEditorDeleteBorder,
  akEditorSelectedBorderColor,
  akEditorSelectedBorderSize,
  akEditorSelectedNodeClassName,
  blockNodesVerticalMargin,
  editorFontSize,
  getSelectionStyles,
  SelectionStyle,
} from '@atlaskit/editor-shared-styles';
import { N200, N30A, N500 } from '@atlaskit/theme/colors';
import { token, useThemeObserver } from '@atlaskit/tokens';

import { InlineNodeViewSharedStyles } from '../../nodeviews/getInlineNodeViewProducer.styles';
import { usePresetContext } from '../../presets/context';
import type { FeatureFlags } from '../../types/feature-flags';

import { aiPanelStyles } from './ai-panels';
import { codeBlockStyles } from './code-block';
import { dateStyles } from './date';
import { expandStyles } from './expand';
import { extensionStyles } from './extension';
import { layoutStyles } from './layout';
import { mediaStyles } from './media';
import { panelStyles } from './panel';
import { statusStyles } from './status';
import { taskDecisionStyles } from './tasks-and-decisions';

// eslint-disable-next-line @atlaskit/design-system/no-exported-css
export const linkStyles = css`
  .ProseMirror {
    ${linkSharedStyle}
  }
`;

type ContentStylesProps = {
  theme?: any;
  colorMode?: 'light' | 'dark';
  featureFlags?: FeatureFlags;
  viewMode?: 'view' | 'edit';
};

const ruleStyles = () => css`
  .ProseMirror {
    ${ruleSharedStyles()};

    hr {
      cursor: pointer;
      padding: ${token('space.050', '4px')} 0;
      margin: ${token('space.300', '24px')} 0;
      background-clip: content-box;

      &.${akEditorSelectedNodeClassName} {
        outline: none;
        background-color: ${token(
          'color.border.selected',
          akEditorSelectedBorderColor,
        )};
      }
    }
  }
`;

const mentionsStyles = css`
  .${MentionSharedCssClassName.MENTION_CONTAINER} {
    &.${akEditorSelectedNodeClassName} [data-mention-id] > span {
      ${getSelectionStyles([
        SelectionStyle.BoxShadow,
        SelectionStyle.Background,
      ])}

      /* need to specify dark text colour because personal mentions
         (in dark blue) have white text by default */
      color: ${token('color.text.subtle', N500)};
    }
  }

  .danger {
    .${MentionSharedCssClassName.MENTION_CONTAINER}.${akEditorSelectedNodeClassName}
      > span
      > span
      > span {
      box-shadow: 0 0 0 ${akEditorSelectedBorderSize}px ${akEditorDeleteBorder};
      background-color: ${token(
        'color.background.danger',
        akEditorDeleteBackgroundWithOpacity,
      )};
    }
    .${MentionSharedCssClassName.MENTION_CONTAINER} > span > span > span {
      background-color: ${token('color.background.neutral', N30A)};
      color: ${token('color.text.subtle', N500)};
    }
  }
`;

const listsStyles = css`
  .ProseMirror {
    li {
      position: relative;

      > p:not(:first-child) {
        margin: ${token('space.050', '4px')} 0 0 0;
      }

      // In SSR the above rule will apply to all p tags because first-child would be a style tag.
      // The following rule resets the first p tag back to its original margin
      // defined in packages/editor/editor-common/src/styles/shared/paragraph.ts
      > style:first-child + p {
        margin-top: ${blockNodesVerticalMargin};
      }
    }

    &:not([data-node-type='decisionList']) > li,
    // This prevents https://product-fabric.atlassian.net/browse/ED-20924
    &:not(.${SmartCardSharedCssClassName.BLOCK_CARD_CONTAINER}) > li {
      ${browser.safari ? codeBlockInListSafariFix : ''}
    }
  }
`;

const emojiStyles = css`
  .${EmojiSharedCssClassName.EMOJI_CONTAINER} {
    display: inline-block;

    .${EmojiSharedCssClassName.EMOJI_NODE} {
      cursor: pointer;

      &.${EmojiSharedCssClassName.EMOJI_IMAGE} > span {
        /** needed for selection style to cover custom emoji image properly */
        display: flex;
      }
    }

    &.${akEditorSelectedNodeClassName} {
      .${EmojiSharedCssClassName.EMOJI_SPRITE},
        .${EmojiSharedCssClassName.EMOJI_IMAGE} {
        border-radius: 2px;
        ${getSelectionStyles([
          SelectionStyle.Blanket,
          SelectionStyle.BoxShadow,
        ])}
      }
    }
  }
`;

// eslint-disable-next-line @atlaskit/design-system/no-exported-css
export const placeholderStyles = css({
  '.ProseMirror .placeholder-decoration': {
    color: token('color.text.subtlest', N200),
    width: '100%',
    pointerEvents: 'none',
    userSelect: 'none',
    '.placeholder-android': {
      pointerEvents: 'none',
      outline: 'none',
      userSelect: 'none',
      position: 'absolute',
    },
  },
});

const contentStyles = (props: ContentStylesProps) => css`
  .ProseMirror {
    outline: none;
    font-size: ${editorFontSize({ theme: props.theme })}px;
    ${whitespaceSharedStyles};
    ${paragraphSharedStyles};
    ${listsSharedStyles};
    ${indentationSharedStyles};
    ${shadowSharedStyle};
    ${InlineNodeViewSharedStyles};
  }

  .ProseMirror[contenteditable='false'] .taskItemView-content-wrap {
    pointer-events: none;
    opacity: 0.7;
  }

  .ProseMirror-hideselection *::selection {
    background: transparent;
  }

  .ProseMirror-hideselection *::-moz-selection {
    background: transparent;
  }

  .ProseMirror-selectednode {
    outline: none;
  }

  .ProseMirror-selectednode:empty {
    outline: 2px solid ${token('color.border.focused', '#8cf')};
  }

  ${placeholderTextStyles}
  ${placeholderStyles}
  ${codeBlockStyles()}

  ${blocktypeStyles()}
  ${codeMarkSharedStyles()}
  ${textColorStyles}
  ${backgroundColorStyles(props.colorMode)}
  ${listsStyles}
  ${ruleStyles()}
  ${mediaStyles}
  ${layoutStyles(props.viewMode)}
  ${telepointerStyle}
  ${gapCursorStyles};
  ${tableStyles(props)}
  ${panelStyles()}
  ${mentionsStyles}
  ${emojiStyles}
  ${tasksAndDecisionsStyles}
  ${gridStyles}
  ${linkStyles}
  ${blockMarksSharedStyles}
  ${dateSharedStyle}
  ${extensionStyles}
  ${expandStyles()}
  ${findReplaceStyles}
  ${textHighlightStyle}
  ${taskDecisionStyles}
  ${statusStyles}
  ${annotationSharedStyles()}
  ${smartCardStyles}
  ${smartCardSharedStyles}
  ${dateStyles}
  ${embedCardStyles}
  ${unsupportedStyles}
  ${resizerStyles}
  ${aiPanelStyles(props.colorMode)}

  .panelView-content-wrap {
    box-sizing: border-box;
  }

  .mediaGroupView-content-wrap ul {
    padding: 0;
  }

  /** Needed to override any cleared floats, e.g. image wrapping */

  div.fabric-editor-block-mark[class^='fabric-editor-align'] {
    clear: none !important;
  }

  .fabric-editor-align-end {
    text-align: right;
  }

  .fabric-editor-align-start {
    text-align: left;
  }

  .fabric-editor-align-center {
    text-align: center;
  }

  .pm-table-header-content-wrap :not(.fabric-editor-alignment),
  .pm-table-header-content-wrap
    :not(p, .fabric-editor-block-mark)
    + div.fabric-editor-block-mark,
  .pm-table-cell-content-wrap
    :not(p, .fabric-editor-block-mark)
    + div.fabric-editor-block-mark {
    p:first-of-type {
      margin-top: 0;
    }
  }
  .pm-table-cell-content-wrap .mediaGroupView-content-wrap {
    clear: both;
  }

  .hyperlink-floating-toolbar,
  .${MediaSharedClassNames.FLOATING_TOOLBAR_COMPONENT} {
    padding: 0;
  }

  /* Link icon in the Atlaskit package
     is bigger than the others
  */
  .hyperlink-open-link {
    svg {
      max-width: 18px;
    }
    &[href] {
      padding: 0 4px;
    }
  }
`;

type Props = ContentStylesProps & React.HTMLProps<HTMLDivElement>;

export const createEditorContentStyle = (styles?: SerializedStyles) => {
  return React.forwardRef<HTMLDivElement, Props>((props, ref) => {
    const { className, children, featureFlags } = props;
    const theme = useTheme();
    const { colorMode } = useThemeObserver();
    const editorAPI =
      usePresetContext<[OptionalPlugin<EditorViewModePlugin>]>();
    const { editorViewModeState } = useSharedPluginState(editorAPI, [
      'editorViewMode',
    ]);
    const viewMode = editorViewModeState?.mode;
    const memoizedStyle = useMemo(
      () =>
        contentStyles({
          theme,
          colorMode,
          featureFlags,
          viewMode,
        }),
      [theme, colorMode, featureFlags, viewMode],
    );

    return (
// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
      <div className={className} ref={ref as any} css={[memoizedStyle, styles]}>
        {children}
      </div>
    );
  });
};

export default createEditorContentStyle();
