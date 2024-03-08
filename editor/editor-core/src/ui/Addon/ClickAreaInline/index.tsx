/** @jsx jsx */
import React from 'react';

import { css, jsx } from '@emotion/react';

import { createParagraphAtEnd } from '@atlaskit/editor-common/commands';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';

const clickArea = css({
  flexGrow: 1,
});

export interface Props {
  editorView?: EditorView;
  children?: React.ReactNode;
}

export const ClickAreaInline = ({ editorView, children }: Props) => {
  const handleMouseDown = React.useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
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
