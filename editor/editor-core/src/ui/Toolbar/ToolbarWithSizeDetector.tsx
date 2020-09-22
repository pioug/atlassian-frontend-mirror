import React from 'react';
import { WidthObserver } from '@atlaskit/width-detector';
import { useElementWidth } from './hooks';
import { ToolbarWithSizeDetectorProps } from './toolbar-types';
import { widthToToolbarSize } from './toolbar-size';
import { Toolbar } from './Toolbar';
import styled from 'styled-components';
import { akEditorMobileMaxWidth } from '@atlaskit/editor-shared-styles';

const StyledToolBar = styled.div`
  width: 100%;
  min-width: 254px;
  position: relative;
  @media (max-width: ${akEditorMobileMaxWidth}px) {
    grid-column: 1 / 2;
    grid-row: 2;
    width: calc(100% - 30px);
    margin: 0 15px;
  }
`;
export const ToolbarWithSizeDetector: React.FunctionComponent<ToolbarWithSizeDetectorProps> = props => {
  const ref = React.createRef<HTMLDivElement>();
  const [width, setWidth] = React.useState<number | undefined>(undefined);
  const elementWidth = useElementWidth(ref, {
    skip: typeof width !== 'undefined',
  });

  const toolbarSize =
    typeof width === 'undefined' && typeof elementWidth === 'undefined'
      ? undefined
      : widthToToolbarSize((width || elementWidth)!, props.appearance);

  return (
    <StyledToolBar>
      <WidthObserver setWidth={setWidth} />
      {props.editorView && toolbarSize ? (
        <Toolbar {...props} toolbarSize={toolbarSize} />
      ) : (
        <div ref={ref} />
      )}
    </StyledToolBar>
  );
};
