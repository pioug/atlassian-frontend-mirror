/** @jsx jsx */
import { useState } from 'react';

import { css, jsx } from '@emotion/react';

import { ResizerNext } from '@atlaskit/editor-common/resizer';
import type { HandleResize, HandleSize } from '@atlaskit/editor-common/resizer';
import { resizerStyles } from '@atlaskit/editor-common/styles';
import { token } from '@atlaskit/tokens';

function Parent(props: {
  text?: string;
  height: number;
  handleSize?: HandleSize;
}): JSX.Element {
  const [width, setWidth] = useState(80);
  const [_height, setHeight] = useState(props.height);

  const handleResizeStart = () => {};

  const handleResize: HandleResize = (stateOriginal, delta) => {
    setHeight(stateOriginal.height + -delta.width * 20);
  };

  const handleResizeStop: HandleResize = (stateOriginal, delta) => {
    const newWidth = stateOriginal.width + delta.width + 10;
    setWidth(newWidth);
  };

  return (
    <ResizerNext
      // eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage/preview
      enable={{ left: true, right: true }}
      handleResizeStart={handleResizeStart}
      handleResize={handleResize}
      handleResizeStop={handleResizeStop}
      handleSize={props.handleSize}
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
      css={css(resizerStyles, {
        '.resizer-handle-right::after, .resizer-handle-left::after': {
          background: 'red',
        },
        display: 'grid',
        gridTemplateColumns: '1fr 1fr 1fr 1fr',
        gridTemplateRows: '1fr 1fr',
        gap: token('space.150', '12px'),
        justifyItems: 'center',
      })}
    >
      {[200, 500, 2000].map((height, i) => (
        <div
          key={i}
          css={css({
            display: 'block',
            gridRow: 1,
          })}
        >
          <Parent height={height} text={`${height}px`} />
        </div>
      ))}

      <div
        css={css({
          display: 'block',
          gridColumn: 4,
          gridRow: '1 / 3',
        })}
      >
        <Parent height={4010} />
      </div>

      {[200, 500, 2000].map((height, i) => (
        <div
          key={i}
          css={css({
            display: 'block',
            gridRow: 2,
            placeItems: 'flex-end center',
          })}
        >
          <Parent height={height} text={`${height}px`} />
        </div>
      ))}
    </div>
  );
}
