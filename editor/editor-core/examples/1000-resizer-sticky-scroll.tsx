/** @jsx jsx */
import { useState } from 'react';
import { jsx, css } from '@emotion/react';

import { ResizerNext } from '@atlaskit/editor-common/resizer';
import { HandlerHeightSizeType } from '@atlaskit/editor-common/resizer';
import { resizerStyles } from '@atlaskit/editor-common/styles';

export type HandleResize = (
  stateOriginal: { x: number; y: number; width: number; height: number },
  delta: { width: number; height: number },
) => number;

function Parent(props: {
  text?: string;
  height: number;
  handlerHeightSize?: HandlerHeightSizeType;
}): JSX.Element {
  const [width, setWidth] = useState(80);
  const [_height, setHeight] = useState(props.height);

  const handleResizeStart = () => {
    const newWidth = 55;
    return newWidth;
  };

  const handleResize: HandleResize = (stateOriginal, delta) => {
    const newWidth = stateOriginal.width + delta.width + 5;

    setHeight(stateOriginal.height + -delta.width * 20);
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
      handlerHeightSize={props.handlerHeightSize}
      width={width}
      minWidth={20} // we are adding 10px in the handleResizeStop, so the actual min width will be 20+10 = 30px.
      maxWidth={700} // max width will be 700
      handleAlignmentMethod="sticky"
    >
      <div
        style={{
          height: _height + 'px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fff',
        }}
      >
        {props.text}
      </div>
    </ResizerNext>
  );
}

export default function ExampleForResizerStickyScroll() {
  return (
    <div
      css={css`
        ${resizerStyles};

        // NOTE: This is a tweak to make the resize handles visible in this example
        .resizer-handle-right::after,
        .resizer-handle-left::after {
          background: red;
        }

        display: grid;
        grid-template-columns: 1fr 1fr 1fr 1fr;
        grid-template-rows: 1fr 1fr;
        gap: 10px;
        justify-items: center;
      `}
    >
      {[200, 500, 2000].map((height, i) => (
        <div
          key={i}
          css={css`
            display: block;
            grid-row: 1;
          `}
        >
          <Parent height={height} text={`${height}px`} />
        </div>
      ))}

      <div
        css={css`
          display: block;
          grid-column: 4;
          grid-row: 1 / 3;
        `}
      >
        <Parent height={4010} />
      </div>

      {[200, 500, 2000].map((height, i) => (
        <div
          key={i}
          css={css`
            display: block;
            grid-row: 2;
            place-items: flex-end center;
          `}
        >
          <Parent height={height} text={`${height}px`} />
        </div>
      ))}
    </div>
  );
}
