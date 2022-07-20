/**@jsx jsx */
import { jsx } from '@emotion/react';
import { wrapperStyles, animatedWrapperStyles } from './styles';

import { useGlobalTheme } from '@atlaskit/theme/components';
import { WrapperProps } from './types';

export const Wrapper = (props: WrapperProps) => {
  const theme = useGlobalTheme();
  return (
    <div
      css={wrapperStyles({ dimensions: props.dimensions, theme: theme })}
      {...props}
    >
      {props.children}
    </div>
  );
};

export const AnimatedWrapper = (props: WrapperProps) => {
  const theme = useGlobalTheme();
  return (
    <div
      css={animatedWrapperStyles({
        dimensions: props.dimensions,
        theme: theme,
      })}
      {...props}
    >
      {props.children}
    </div>
  );
};
