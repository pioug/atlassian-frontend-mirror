/** @jsx jsx */
import React from 'react';
import { jsx } from '@emotion/react';

import { ResizerNext } from '@atlaskit/editor-common/resizer';

import { resizerStyles } from '@atlaskit/editor-common/styles';

export type HandleResize = (
  stateOriginal: { x: number; y: number; width: number; height: number },
  delta: { width: number; height: number },
) => number;

function Parent(): JSX.Element {
  const [width, setWidth] = React.useState(50);

  const handleResizeStart = () => {
    const newWidth = 55;
    return newWidth;
  };

  const handleResize: HandleResize = (stateOriginal, delta) => {
    const newWidth = stateOriginal.width + delta.width + 5;
    return newWidth;
  };

  const handleResizeStop: HandleResize = (stateOriginal, delta) => {
    const newWidth = stateOriginal.width + delta.width + 10;
    setWidth(newWidth);
    return newWidth;
  };

  return (
    <ResizerNext
      enable={{ left: true, right: true }}
      handleResizeStart={handleResizeStart}
      handleResize={handleResize}
      handleResizeStop={handleResizeStop}
      width={width}
      minWidth={20} // we are adding 10px in the handleResizeStop, so the actual min width will be 20+10 = 30px.
      maxWidth={700} // max width will be 700
    >
      <div
        style={{
          height: '200px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fff',
        }}
      >
        Resizable element
      </div>
    </ResizerNext>
  );
}

export default function Example() {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
      }}
      css={resizerStyles}
    >
      <div style={{ display: 'block' }}>
        <Parent />
      </div>
    </div>
  );
}
