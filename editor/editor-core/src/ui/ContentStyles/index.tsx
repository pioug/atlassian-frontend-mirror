/** @jsx jsx */
import React, { useMemo } from 'react';
import { jsx, css, useTheme, SerializedStyles } from '@emotion/react';
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
} from '@atlaskit/editor-common/styles';
import { editorFontSize } from '@atlaskit/editor-shared-styles';
import { token } from '@atlaskit/tokens';

import { unsupportedStyles } from '../../plugins/unsupported-content/styles';
import { telepointerStyle } from '../../plugins/collab-edit/styles';
import { gapCursorStyles } from '../../plugins/selection/gap-cursor/styles';
import { tableStyles } from '@atlaskit/editor-plugin-table/ui/common-styles';
import { placeholderStyles } from '../../plugins/placeholder/styles';
import { blocktypeStyles } from '../../plugins/block-type/styles';
import { codeBlockStyles } from '../../plugins/code-block/styles';
import { listsStyles } from '../../plugins/list/styles';
import { ruleStyles } from '../../plugins/rule/styles';
import { mediaStyles } from '../../plugins/media/styles';
import { layoutStyles } from '../../plugins/layout/styles';
import { panelStyles } from '../../plugins/panel/styles';
import { fakeCursorStyles } from '../../plugins/fake-text-cursor/styles';
import { mentionsStyles } from '../../plugins/mentions/styles';
import { emojiStyles } from '../../plugins/emoji/styles';
import { textFormattingStyles } from '../../plugins/text-formatting/styles';
import { placeholderTextStyles } from '../../plugins/placeholder-text/styles';
import { gridStyles } from '../../plugins/grid/styles';
import { linkStyles } from '../../plugins/hyperlink/styles';
import { extensionStyles } from '../../plugins/extension/ui/styles';
import { expandStyles } from '../../plugins/expand/ui/styles';
import { ClassNames } from '../../plugins/media/pm-plugins/alt-text/style';
import { findReplaceStyles } from '../../plugins/find-replace/styles';
import { taskDecisionStyles } from '../../plugins/tasks-and-decisions/styles';
import { statusStyles } from '../../plugins/status/styles';
import { smartCardStyles } from '../../plugins/card/styles';
import { dateStyles } from '../../plugins/date/styles';
import { embedCardStyles } from '../../plugins/card/ui/styled';
import type { FeatureFlags } from '../../types/feature-flags';
import { useFeatureFlags } from '../../plugins/feature-flags-context';
import { InlineNodeViewSharedStyles } from '../../nodeviews/getInlineNodeViewProducer.styles';

type ContentStylesProps = {
  theme?: any;
  featureFlags?: FeatureFlags;
};

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
  ${textFormattingStyles(props)}
  ${textColorStyles}
  ${listsStyles}
  ${ruleStyles(props)}
  ${mediaStyles}
  ${layoutStyles}
  ${telepointerStyle}
  ${gapCursorStyles};
  ${tableStyles(props)}
  ${panelStyles(props)}
  ${fakeCursorStyles}
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
  ${taskDecisionStyles}
  ${statusStyles}
  ${annotationSharedStyles(props)}
  ${smartCardStyles}
  ${smartCardSharedStyles}
  ${dateStyles}
  ${embedCardStyles}
  ${unsupportedStyles}

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
  .${ClassNames.FLOATING_TOOLBAR_COMPONENT} {
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

type Props = Omit<
  ContentStylesProps & React.HTMLProps<HTMLDivElement>,
  'featureFlags'
>;

export const createEditorContentStyle = (styles?: SerializedStyles) => {
  return React.forwardRef<HTMLDivElement, Props>((props, ref) => {
    const featureFlags = useFeatureFlags();
    const { className, children } = props;
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
