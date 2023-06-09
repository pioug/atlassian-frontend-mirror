import { css } from '@emotion/react';

import {
  MediaSingleDimensionHelper,
  MediaSingleWrapperProps as MediaSingleDimensionHelperProps,
} from '../MediaSingle/styled';

export const wrapperStyle = (props: MediaSingleDimensionHelperProps) => css`
  & > div {
    ${MediaSingleDimensionHelper(props)};
    position: relative;
    clear: both;

    > div {
      position: absolute;
      height: 100%;
      width: 100%;
    }
  }
`;
