/**@jsx jsx */
import { jsx } from '@emotion/react';
import { Box, xcss } from '@atlaskit/primitives';
import { checkeredBg } from './styles';

const containerWrapperStyles = xcss({
  background: `url('${checkeredBg}')`,
  position: `relative`,
  cursor: `move`,
  userSelect: `none`,
  overflow: `hidden`,
});

export type ContainerWrapperProps = React.HTMLAttributes<HTMLDivElement> & {
  width: number;
  height: number;
  margin: number;
};

export const ContainerWrapper = ({
  width,
  height,
  margin,
  children,
  ...props
}: ContainerWrapperProps) => {
  const containerWrapperDimensions = xcss({
    width: `${width !== undefined ? width! + margin * 2 : 0}px`,
    height: `${height !== undefined ? height! + margin * 2 : 0}px`,
  });

  return (
    <Box
      id={'container-wrapper'}
      xcss={[containerWrapperStyles, containerWrapperDimensions]}
      {...props}
    >
      {children}
    </Box>
  );
};
