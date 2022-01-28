import { MediaSingleDimensionHelper } from '@atlaskit/editor-common/ui';
import type { MediaSingleDimensionHelperProps } from '@atlaskit/editor-common/ui';
import styled from 'styled-components';

export const Wrapper: React.ComponentClass<
  React.HTMLAttributes<{}> & MediaSingleDimensionHelperProps
> = styled.div`
  & > div {
    ${MediaSingleDimensionHelper};
    position: relative;
    clear: both;

    > div {
      position: absolute;
      height: 100%;
      width: 100%;
    }
  }
`;
