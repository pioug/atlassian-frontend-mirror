/** @jsx jsx */
import React from 'react';

import { css, jsx } from '@emotion/react';

import type { EditorView } from '@atlaskit/editor-prosemirror/view';

import { clickAreaClickHandler } from '../click-area-helper';

const clickWrapper = css({
  flexGrow: 1,
  height: '100%',
});

export interface Props {
  editorView?: EditorView;
  children?: any;
  editorDisabled?: boolean;
}

export const ClickAreaBlock = ({
  editorView,
  editorDisabled,
  children,
}: Props) => {
  const handleMouseDown = React.useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
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
