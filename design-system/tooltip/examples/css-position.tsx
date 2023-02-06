/** @jsx jsx */
import { CSSProperties, FC, forwardRef, useRef, useState } from 'react';

import { css, jsx } from '@emotion/react';
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
  'elevation.shadow.overlay',
  `0 4px 8px -2px ${N60A}, 0 0 1px ${N60A}`,
);

const positionStyles = css({
  width: '280px',
  height: '60px',
  padding: token('space.100', '8px'),
  backgroundColor: `${token('color.background.neutral', N20)}`,
  borderRadius: '5px',
});

interface PosTypes {
  children?: ReactNode;
  pos: 'relative' | 'absolute' | 'fixed';
  pinned?: boolean;
  top?: number;
}

const Position = forwardRef<HTMLDivElement, PosTypes>(
  ({ children, pos, pinned, top = 0 }, ref) => {
    const dynamicStyles: CSSProperties = {
      position: `${pos}`,
      top: `${top}px`,
      boxShadow: pinned || pos === 'fixed' ? boxShadow : 'none',
    } as CSSProperties;

    return (
      <div css={positionStyles} ref={ref} style={dynamicStyles}>
        <Tooltip content={`Position "${pos}"`}>
          {(tooltipProps) => (
            <Target color={color[pos]} tabIndex={0} {...tooltipProps}>
              {capitalize(pos)}
            </Target>
          )}
        </Tooltip>
        <p>
          Tooltip container position is <code>{pos}</code>.
        </p>
        {children}
      </div>
    );
  },
);

const positionExampleStyles = css({
  position: 'absolute',
  top: 8,
  right: 8,
});

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
        <button onClick={pinned ? unpin : pin} css={positionExampleStyles}>
          {pinned ? 'Unpin' : 'Pin'}
        </button>
      </Position>
    </div>
  );
};

export default PositionExample;
