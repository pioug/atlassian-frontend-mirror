import React, { ComponentClass, HTMLAttributes } from 'react';
import styled from 'styled-components';
import { WidthObserver } from '@atlaskit/width-detector';
import { akEditorMobileMaxWidth } from '@atlaskit/editor-shared-styles';
import { useElementWidth } from './hooks';
import { ToolbarWithSizeDetectorProps } from './toolbar-types';
import { widthToToolbarSize, toolbarSizeToWidth } from './toolbar-size';
import { Toolbar } from './Toolbar';
import { ToolbarSize } from './types';

const StyledToolBar: ComponentClass<
  HTMLAttributes<{}> & {
    minWidth?: string;
  }
> = styled.div`
  width: 100%;
  min-width: ${({ minWidth }) => minWidth};
  position: relative;
  @media (max-width: ${akEditorMobileMaxWidth}px) {
    grid-column: 1 / 2;
    grid-row: 2;
    width: calc(100% - 30px);
    margin: 0 15px;
  }
`;

export const ToolbarWithSizeDetector: React.FunctionComponent<ToolbarWithSizeDetectorProps> = (
  props,
) => {
  const ref = React.createRef<HTMLDivElement>();
  const [width, setWidth] = React.useState<number | undefined>(undefined);
  const elementWidth = useElementWidth(ref, {
    skip: typeof width !== 'undefined',
  });

  const toolbarSize =
    typeof width === 'undefined' && typeof elementWidth === 'undefined'
      ? undefined
      : widthToToolbarSize((width || elementWidth)!, props.appearance);

  const toolbarMinWidth = toolbarSizeToWidth(ToolbarSize.M, props.appearance);

  return (
    <StyledToolBar
      minWidth={props.hasMinWidth ? `${toolbarMinWidth}px` : '254px'}
    >
      <WidthObserver setWidth={setWidth} />
      {props.editorView && toolbarSize ? (
        <Toolbar {...props} toolbarSize={toolbarSize} />
      ) : (
        <div ref={ref} />
      )}
    </StyledToolBar>
  );
};
