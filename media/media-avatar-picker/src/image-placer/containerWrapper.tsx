/**@jsx jsx */
import { jsx } from '@emotion/react';
import { containerWrapperStyles } from './styles';

export const ContainerWrapper = ({
  width,
  height,
  margin,
  children,
  ...props
}: any) => (
  <div css={containerWrapperStyles({ width, height, margin })} {...props}>
    {children}
  </div>
);
