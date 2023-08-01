/** @jsx jsx */
import React from 'react';
import { css, jsx } from '@emotion/react';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import { createParagraphAtEnd } from '../../../commands';

const clickArea = css`
  flex-grow: 1;
`;

export interface Props {
  editorView?: EditorView;
}

export const ClickAreaInline: React.FC<Props> = ({ editorView, children }) => {
  const handleMouseDown = React.useCallback(
    (event) => {
      if (!editorView) {
        return;
      }

      if (createParagraphAtEnd()(editorView.state, editorView.dispatch)) {
        editorView.focus();
        event.stopPropagation();
      }
    },
    [editorView],
  );

  return (
    <div
      data-testid="click-wrapper"
      css={clickArea}
      onMouseDown={handleMouseDown}
    />
  );
};

export default ClickAreaInline;
