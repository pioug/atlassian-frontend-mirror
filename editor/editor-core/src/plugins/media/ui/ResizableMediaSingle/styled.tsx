import { MediaSingleDimensionHelper } from '@atlaskit/editor-common';
import styled from 'styled-components';

export const Wrapper = styled.div`
  & > div {
    ${MediaSingleDimensionHelper};
    position: relative;
    clear: both;
  }
`;

Wrapper.displayName = 'ResizerWrapper';
