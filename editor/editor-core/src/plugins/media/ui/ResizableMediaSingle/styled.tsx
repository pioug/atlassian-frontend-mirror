import {
  MediaSingleDimensionHelper,
  MediaSingleDimensionHelperProps,
} from '@atlaskit/editor-common';
import styled from 'styled-components';

export const Wrapper: React.ComponentClass<React.HTMLAttributes<{}> &
  MediaSingleDimensionHelperProps> = styled.div`
  & > div {
    ${MediaSingleDimensionHelper};
    position: relative;
    clear: both;

    > div {
      position: absolute;
      height: 100%;
    }
  }

  & > div::after {
    content: '';
    display: block;
    padding-bottom: ${p => p.ratio + '%'};

    /* Fixes extra padding problem in Firefox */
    font-size: 0;
    line-height: 0;
  }
`;
