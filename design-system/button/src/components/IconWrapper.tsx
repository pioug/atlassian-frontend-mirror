/** @jsx jsx */
import { jsx } from '@emotion/core';
import { getLoadingStyle } from './utils';
import { gridSize } from '@atlaskit/theme/constants';

interface Props {
  icon: React.ReactChild;
  isLoading?: boolean;
  isOnlyChild: boolean;
  spacing: string;
}

export default ({ spacing, icon, isOnlyChild, isLoading, ...rest }: Props) => (
  <span
    css={{
      alignSelf: 'center',
      display: 'flex',
      flexShrink: 0,
      lineHeight: 0,
      fontSize: 0,
      userSelect: 'none',
      margin:
        spacing === 'none'
          ? 0
          : isOnlyChild
          ? `0 -${gridSize() / 4}px`
          : `0 ${gridSize() / 2}px`,
      ...getLoadingStyle(isLoading),
    }}
    {...rest}
  >
    {icon}
  </span>
);
