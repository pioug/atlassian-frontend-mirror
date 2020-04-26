import React from 'react';
import { WidthObserver } from '@atlaskit/width-detector';
import { ToolbarWithSizeDetectorProps } from './toolbar-types';
import { widthToToolbarSize } from './toolbar-size';
import { Toolbar } from './Toolbar';

export const ToolbarWithSizeDetector: React.FunctionComponent<ToolbarWithSizeDetectorProps> = props => {
  const [width, setWidth] = React.useState<number | undefined>(undefined);
  const toolbarSize = widthToToolbarSize(width || 0, props.appearance);

  return (
    <div style={{ width: '100%', minWidth: '254px', position: 'relative' }}>
      <WidthObserver setWidth={setWidth} />
      {width === undefined ? null : (
        <Toolbar {...props} toolbarSize={toolbarSize} />
      )}
    </div>
  );
};
