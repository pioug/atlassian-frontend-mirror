import {
  MediaSingleDimensionHelper,
  MediaSingleDimensionHelperProps,
} from '@atlaskit/editor-common';
import styled from 'styled-components';

export const Wrapper: React.ComponentClass<React.HTMLAttributes<{}> &
  MediaSingleDimensionHelperProps> = styled.div`
  img {
    width: 100%;
  }

  & > div {
    ${MediaSingleDimensionHelper};
    position: relative;
    clear: both;
  }
`;
