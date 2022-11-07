/* eslint-disable @atlaskit/design-system/ensure-design-token-usage */
/** @jsx jsx */
import { forwardRef } from 'react';

import { css, jsx, keyframes } from '@emotion/react';

import { AtlassianIcon } from '@atlaskit/logo';
import { B400, N0, N50A, N60A } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

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
        css={css({
          display: 'flex',
          width: `${size}px`,
          height: `${size}px`,
          // TODO Delete this comment after verifying spacing token -> previous value `'16px'`
          margin: token('spacing.scale.200', '16px'),
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: N0,
          borderRadius: `${Math.floor(size / 7)}px`,
          boxShadow: token(
            'elevation.shadow.overlay',
            `0 4px 8px -2px ${N50A}, 0 0 1px ${N60A}`,
          ),
          cursor: onClick ? 'pointer' : 'default',
          ':hover': {
            backgroundColor: onClick ? B400 : undefined,
          },
        })}
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
