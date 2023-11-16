/** @jsx jsx */
import React, { useMemo } from 'react';
import type { SerializedStyles } from '@emotion/react';
import { jsx, css, useTheme } from '@emotion/react';
import {
  whitespaceSharedStyles,
  paragraphSharedStyles,
  listsSharedStyles,
  indentationSharedStyles,
  blockMarksSharedStyles,
  shadowSharedStyle,
  dateSharedStyle,
  tasksAndDecisionsStyles,
  annotationSharedStyles,
  smartCardSharedStyles,
  textColorStyles,
  resizerStyles,
  gridStyles,
  smartCardStyles,
  embedCardStyles,
  codeBlockInListSafariFix,
  unsupportedStyles,
} from '@atlaskit/editor-common/styles';
import type { ThemeProps } from '@atlaskit/theme/types';

import {
  akEditorSelectedBorderSize,
  akEditorDeleteBorder,
  akEditorDeleteBackgroundWithOpacity,
  akEditorSelectedNodeClassName,
  blockNodesVerticalMargin,
  editorFontSize,
  getSelectionStyles,
  SelectionStyle,
  akEditorLineHeight,
  akEditorSelectedBorderColor,
} from '@atlaskit/editor-shared-styles';
import { MentionSharedCssClassName } from '@atlaskit/editor-common/mention';
import { token } from '@atlaskit/tokens';

import { telepointerStyle } from '../../plugins/collab-edit/styles';
import { tableStyles } from '@atlaskit/editor-plugin-table/ui/common-styles';
import { blocktypeStyles } from '@atlaskit/editor-plugin-block-type/styles';
import { textHighlightStyle } from '@atlaskit/editor-plugin-paste-options-toolbar/styles';
import { codeBlockStyles } from './code-block';
import { mediaStyles } from './media';
import { layoutStyles } from './layout';
import { panelStyles } from './panel';
import { placeholderTextStyles } from '@atlaskit/editor-plugin-placeholder-text/styles';
import { extensionStyles } from './extension';
import { expandStyles } from './expand';
import { MediaSharedClassNames } from '@atlaskit/editor-common/styles';
import { findReplaceStyles } from '../../plugins/find-replace/styles';
import { taskDecisionStyles } from './tasks-and-decisions';
import { statusStyles } from './status';
import { dateStyles } from './date';
import type { FeatureFlags } from '../../types/feature-flags';
import { InlineNodeViewSharedStyles } from '../../nodeviews/getInlineNodeViewProducer.styles';
import {
  linkSharedStyle,
  codeMarkSharedStyles,
  ruleSharedStyles,
} from '@atlaskit/editor-common/styles';
import { browser } from '@atlaskit/editor-common/utils';
import { EmojiSharedCssClassName } from '@atlaskit/editor-common/emoji';

import { N500, N30A, N200 } from '@atlaskit/theme/colors';
import { gapCursorStyles } from '@atlaskit/editor-common/selection';

export const linkStyles = css`
  .ProseMirror {
    ${linkSharedStyle}
  }
`;

type ContentStylesProps = {
  theme?: any;
  featureFlags?: FeatureFlags;
};

const ruleStyles = (props: ThemeProps) => css`
  .ProseMirror {
    ${ruleSharedStyles(props)};

    hr {
      cursor: pointer;
      padding: ${token('space.050', '4px')} 0;
      margin: calc(${akEditorLineHeight}em - 4px) 0;
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

    & :not([data-node-type='decisionList']) > li {
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

export const placeholderStyles = css`
  .ProseMirror .placeholder-decoration {
    color: ${token('color.text.subtlest', N200)};
    width: 100%;
    pointer-events: none;
    user-select: none;

    .placeholder-android {
      pointer-events: none;
      outline: none;
      user-select: none;
      position: absolute;
    }
  }
`;

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
  ${codeBlockStyles(props)}

  ${blocktypeStyles(props)}
  ${codeMarkSharedStyles(props)}
  ${textColorStyles}
  ${listsStyles}
  ${ruleStyles(props)}
  ${mediaStyles}
  ${layoutStyles(props)}
  ${telepointerStyle}
  ${gapCursorStyles};
  ${tableStyles(props)}
  ${panelStyles(props)}
  ${mentionsStyles}
  ${emojiStyles}
  ${tasksAndDecisionsStyles}
  ${gridStyles}
  ${linkStyles}
  ${blockMarksSharedStyles}
  ${dateSharedStyle}
  ${extensionStyles}
  ${expandStyles(props)}
  ${findReplaceStyles}
  ${textHighlightStyle}
  ${taskDecisionStyles}
  ${statusStyles}
  ${annotationSharedStyles(props)}
  ${smartCardStyles}
  ${smartCardSharedStyles}
  ${dateStyles}
  ${embedCardStyles}
  ${unsupportedStyles}
  ${resizerStyles}

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
    const memoizedStyle = useMemo(
      () =>
        contentStyles({
          theme,
          featureFlags,
        }),
      [theme, featureFlags],
    );

    return (
      <div className={className} ref={ref as any} css={[memoizedStyle, styles]}>
        {children}
      </div>
    );
  });
};

export default createEditorContentStyle();
