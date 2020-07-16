import React from 'react';
import { WidthObserver } from '@atlaskit/width-detector';
import { useElementWidth } from './hooks';
import { ToolbarWithSizeDetectorProps } from './toolbar-types';
import { widthToToolbarSize } from './toolbar-size';
import { Toolbar } from './Toolbar';

const style: React.CSSProperties = {
  width: '100%',
  minWidth: '254px',
  position: 'relative',
};

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
    <div style={style}>
      <WidthObserver setWidth={setWidth} />
      {props.editorView && toolbarSize ? (
        <Toolbar {...props} toolbarSize={toolbarSize} />
      ) : (
        <div ref={ref} />
      )}
    </div>
  );
};
