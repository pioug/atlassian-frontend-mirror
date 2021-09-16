/** @jsx jsx */
import { FC, forwardRef, useRef, useState } from 'react';

import { css, jsx } from '@emotion/core';
import { ReactNode } from 'react-redux';

import { N20, N60A } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

import Tooltip from '../src';

import { Target } from './styled';

function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

const color = {
  relative: 'green',
  absolute: 'yellow',
  fixed: 'red',
};

const boxShadow = token(
  'shadow.overlay',
  `0 4px 8px -2px ${N60A}, 0 0 1px ${N60A}`,
);

interface PosTypes {
  children?: ReactNode;
  pos: 'relative' | 'absolute' | 'fixed';
  pinned?: boolean;
  top?: number;
}

const Position = forwardRef<HTMLDivElement, PosTypes>(
  ({ children, pos, pinned, top = 0 }, ref) => (
    <div
      css={css`
        background-color: ${token(
          'color.background.subtleNeutral.resting',
          N20,
        )};
        border-radius: 5px;
        height: 60px;
        padding: 8px;
        position: ${pos};
        width: 280px;
        ${pos === 'fixed' && `box-shadow: ${boxShadow};`}
        ${pinned
          ? `box-shadow: ${boxShadow}; top: ${top}px;`
          : `top: ${top}px;`}
      `}
      ref={ref}
    >
      <Tooltip content={`Position "${pos}"`}>
        <Target color={color[pos]}>{capitalize(pos)}</Target>
      </Tooltip>
      <p>
        Tooltip container position is <code>{pos}</code>.
      </p>
      {children}
    </div>
  ),
);

const PositionExample: FC = () => {
  const panel = useRef<HTMLDivElement>(null);
  const [pinned, setPinned] = useState(false);
  const [top, setTop] = useState(0);

  const pin = () => {
    if (panel.current == null) {
      return;
    }
    const { top } = panel.current.getBoundingClientRect();
    setPinned(true);
    setTop(top);
  };

  const unpin = () => setPinned(false);

  return (
    <div style={{ height: 246, position: 'relative' }}>
      <Position pos="relative" top={0} />
      <Position pos="absolute" top={84} />
      <Position
        ref={panel}
        top={pinned ? top : 92}
        pinned={pinned}
        pos={pinned ? 'fixed' : 'relative'}
      >
        <button
          onClick={pinned ? unpin : pin}
          css={{
            position: 'absolute',
            right: 8,
            top: 8,
          }}
        >
          {pinned ? 'Unpin' : 'Pin'}
        </button>
      </Position>
    </div>
  );
};

export default PositionExample;
