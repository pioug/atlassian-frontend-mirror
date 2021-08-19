/* eslint-disable @atlaskit/design-system/ensure-design-token-usage */
/** @jsx jsx */
import { forwardRef } from 'react';

import { css, jsx, keyframes } from '@emotion/core';

import { AtlassianIcon } from '@atlaskit/logo';
import { B400, N0 } from '@atlaskit/theme/colors';
import { e200 } from '@atlaskit/theme/elevation';

interface BlockProps extends React.HTMLProps<HTMLDivElement> {
  appearance?: 'small' | 'medium' | 'large';
}

interface AnimatedBlockProps extends BlockProps {
  curve: string;
  duration: number;
}

const blockSize = {
  small: 50,
  medium: 150,
  large: 300,
};

const logoSize = {
  large: 'xlarge',
  medium: 'large',
  small: 'small',
};

export const Block = forwardRef<HTMLDivElement, BlockProps>(
  ({ onClick, appearance = 'medium', ...props }: BlockProps, ref) => {
    const size = blockSize[appearance];
    return (
      <div
        ref={ref}
        css={css`
          ${e200()}
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 16px;
          width: ${size}px;
          height: ${size}px;
          background-color: ${N0};
          border-radius: ${Math.floor(size / 7)}px;
          cursor: ${onClick ? 'pointer' : 'default'};
          :hover {
            background-color: ${onClick ? B400 : undefined};
          }
        `}
        {...props}
      >
        {props.children || <AtlassianIcon size={logoSize[appearance] as any} />}
      </div>
    );
  },
);

const movesRight = keyframes`
  from {
    transform: none;
  }

  to {
    transform: translate3d(200%, 0, 0);
  }
`;

export const MovesRightBlock = forwardRef<HTMLDivElement, AnimatedBlockProps>(
  (props: AnimatedBlockProps, ref) => (
    <Block
      ref={ref as any}
      css={{
        animationName: `${movesRight}`,
        animationDuration: `${props.duration}ms`,
        animationTimingFunction: props.curve,
        animationIterationCount: 'infinite',
      }}
      {...props}
    />
  ),
);
