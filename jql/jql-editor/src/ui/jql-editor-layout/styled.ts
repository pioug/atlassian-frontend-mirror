import { css, keyframes } from '@emotion/react';
import styled from '@emotion/styled';

import {
  B100,
  B300,
  G300,
  N0,
  N10,
  N100,
  N30,
  N40,
  N700,
  N800,
  N900,
  P400,
  R400,
} from '@atlaskit/theme/colors';
import {
  codeFontFamily,
  fontFamily,
  fontSize,
  // eslint-disable-next-line @atlaskit/design-system/no-deprecated-imports
  gridSize,
  layers,
} from '@atlaskit/theme/constants';
import { token } from '@atlaskit/tokens';

import {
  TOOLTIP_CLASSNAME,
  TOOLTIP_ENTER_CLASSNAME,
  TOOLTIP_EXIT_CLASSNAME,
} from '../../plugins/validation-tooltip/constants';

const fadeIn = keyframes`
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
`;

const fadeOut = keyframes`
  from {
    visibility: visible;
    opacity: 1;
  }

  to {
    opacity: 0;
  }
`;

export const EditorMain = styled.div`
  /* CSS reset */
  font-family: ${fontFamily};
  font-size: ${fontSize}px;
  flex-grow: 1;

  /* These styles and animations are derived from @atlaskit/tooltip */

  .${TOOLTIP_CLASSNAME} {
    background-color: ${token('color.background.neutral.bold', N800)};
    color: ${token('color.text.inverse', N0)};
    border-radius: ${token('border.radius.100', '3px')};
    box-sizing: border-box;
    font-size: 12px;
    line-height: 1.3;
    max-width: 240px;
    padding: ${token('space.025', '2px')} ${token('space.075', '6px')};
    word-wrap: break-word;
    overflow-wrap: break-word;
    z-index: ${layers.tooltip()};
    pointer-events: none;
    position: absolute;
    visibility: hidden;

    /* Horizontally center and vertically position above the target element */
    transform: translate(-50%, calc(-100% - ${token('space.200', '16px')}));

    &.${TOOLTIP_ENTER_CLASSNAME} {
      animation: ${fadeIn} 350ms cubic-bezier(0.15, 1, 0.3, 1);
      visibility: visible;
    }

    &.${TOOLTIP_EXIT_CLASSNAME} {
      animation: ${fadeOut} 350ms cubic-bezier(0.15, 1, 0.3, 1);
    }
  }
`;

export const EditorFooter = styled.div`
  display: flex;
  justify-content: space-between;
  /* We always have at least 1 row of space allocated to the footer */
  min-height: 20px;
`;

// Height (in px) for a single row in the editor
const rowHeight = gridSize() * 2.75;
// Vertical padding for the editor input
const getEditorInputVerticalPadding = (isCompact: boolean) =>
  isCompact ? 3 : 7;
const editorInputHorizontalPadding = 6;

type EditorViewContainerProps = {
  editorViewHasFocus?: boolean;
  editorViewIsInvalid?: boolean;
};
export const EditorViewContainer = styled.div<EditorViewContainerProps>`
  background-color: ${token('color.background.input', N10)};
  border-style: solid;
  border-width: 2px;
  border-color: ${token('color.border', N40)};
  border-radius: ${token('border.radius.100', '3px')};
  box-sizing: border-box;
  color: ${token('color.text', N900)};
  display: flex;
  overflow: auto;
  transition: background-color 0.2s ease-in-out, border-color 0.2s ease-in-out;

  ${props =>
    props.editorViewHasFocus
      ? css`
          background-color: ${token('elevation.surface', N0)};
          border-color: ${token('color.border.focused', B100)};
        `
      : css`
          :hover {
            background-color: ${token('color.background.input.hovered', N30)};
          }
        `}

  ${props =>
    props.editorViewIsInvalid &&
    css`
      border-color: ${token('color.border.danger', R400)};
    `}
`;

export const ReadOnlyEditorViewContainer = styled(EditorViewContainer)`
  background-color: ${token('color.background.disabled', N30)};
  color: ${token('color.text.disabled', N100)};
  pointer-events: none;
`;

export const LineNumberToolbar = styled.div<{ lineNumbersVisible: boolean }>`
  background-color: ${token('color.background.neutral', N30)};
  flex-shrink: 0;
  width: 30px;
  position: sticky;
  top: 0;

  ${props =>
    !props.lineNumbersVisible &&
    css`
      display: none;
    `}
`;

/**
 * The main div which the Prosemirror editor will be rendered into.
 */
export const EditorView = styled.div<{
  defaultMaxRows: number;
  expandedRows: number;
  lineNumbersVisible: boolean;
  isCompact: boolean;
}>`
  counter-reset: lineNumber;
  flex-grow: 1;

  transition: height 250ms cubic-bezier(0.15, 1, 0.3, 1),
    max-height 250ms cubic-bezier(0.15, 1, 0.3, 1);
  max-height: ${props =>
    rowHeight * props.defaultMaxRows +
    getEditorInputVerticalPadding(props.isCompact) * 2}px;

  line-height: ${rowHeight / fontSize()};
  font-family: ${codeFontFamily()};
  word-break: break-word;
  overflow-wrap: anywhere;
  white-space: pre-wrap;

  &[data-expanded] {
    height: ${props =>
      rowHeight * props.expandedRows +
      getEditorInputVerticalPadding(props.isCompact) * 2}px;
    max-height: ${props =>
      rowHeight * props.expandedRows +
      getEditorInputVerticalPadding(props.isCompact) * 2}px;
  }

  .ProseMirror {
    color: ${token('color.text', N700)};
    padding: ${props => getEditorInputVerticalPadding(props.isCompact)}px
      ${editorInputHorizontalPadding}px;

    &:focus {
      outline: none;
    }

    .mark-token-keyword {
      color: ${token('color.text.accent.purple', P400)};
    }

    .mark-token-field {
      color: ${token('color.text.accent.blue', B300)};
    }

    .mark-token-operator {
      color: ${token('color.text.accent.green', G300)};
    }

    .mark-token-error {
      color: ${token('color.text.danger', R400)};
      text-decoration: wavy underline;
      text-decoration-thickness: 1px;
      text-decoration-skip-ink: none;
    }
  }

  p {
    margin: 0;
    counter-increment: lineNumber;
    position: relative;

    /* Show the current line number before each paragraph block. */

    &::before {
      content: counter(lineNumber);
      color: ${token('color.text.subtlest', N100)};
      font-size: 10px;
      line-height: ${rowHeight / 10};
      padding: 0 ${token('space.100', '8px')} 0 ${token('space.025', '2px')};
      position: absolute;
      box-sizing: border-box;
      /* Shift the line number tag 100% (plus 8px padding) to the left to position it inside the LineNumberToolbar */
      transform: translateX(calc(-100% - ${token('space.100', '8px')}));

      /* We can fit 3 digits before ellipses. This is not very responsive but saves us having to add expensive width
        recalculation logic to the LineNumberToolbar for a scenario that *should* never happen. */
      max-width: 30px;
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;

      ${props =>
        !props.lineNumbersVisible &&
        css`
          display: none;
        `}
    }
  }
`;

// FIXME: convert-props-syntax rule doesn't catch this
// eslint-disable-next-line @atlaskit/design-system/no-styled-tagged-template-expression
export const ReadOnlyEditorView = styled(EditorView)`
  /* We need to replicate padding from the inner prosemirror element in our read only state. That means we also need
  recompute max height excluding the child padding. */
  padding: ${props => getEditorInputVerticalPadding(props.isCompact)}px
    ${editorInputHorizontalPadding}px;
  max-height: ${props => rowHeight * props.defaultMaxRows}px;

  > p {
    /* Prevent collapsing empty paragraphs */
    min-height: ${rowHeight}px;
  }
`;

export const EditorControls = styled.div<{
  isSearch: boolean;
  isCompact: boolean;
}>`
  align-items: center;
  display: flex;
  flex-shrink: 0;
  margin-left: auto;
  margin-right: ${props =>
    props.isSearch
      ? getEditorInputVerticalPadding(props.isCompact) - 1 // the search button needs the same vertical & horizontal spacing
      : editorInputHorizontalPadding - 3}px;
  line-height: normal;
  position: sticky;
  top: 0;
  height: ${props =>
    rowHeight + 2 * getEditorInputVerticalPadding(props.isCompact)}px;
`;
