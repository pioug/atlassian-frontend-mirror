/** @jsx jsx */
import React from 'react';
import { css, jsx } from '@emotion/react';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import { clickAreaClickHandler } from '../click-area-helper';

const clickWrapper = css`
  flex-grow: 1;
  height: 100%;
`;

export interface Props {
  editorView?: EditorView;
  children?: any;
  editorDisabled?: boolean;
}

export const ClickAreaBlock: React.FC<Props> = ({
  editorView,
  editorDisabled,
  children,
}) => {
  const handleMouseDown = React.useCallback(
    (event) => {
      if (!editorView) {
        return;
      }

      if (!editorDisabled) {
        clickAreaClickHandler(editorView, event);
      }
    },
    [editorView, editorDisabled],
  );

  return (
    <div
      data-testid="click-wrapper"
      css={clickWrapper}
      onMouseDown={handleMouseDown}
    >
      {children}
    </div>
  );
};

export default ClickAreaBlock;
