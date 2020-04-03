import styled from 'styled-components';
import { borderRadius } from '@atlaskit/theme/constants';
import { N30 } from '@atlaskit/theme/colors';

interface Props {
  readViewFitContainerWidth?: boolean;
}

const ReadViewContentWrapper = styled.div<Props>`
  box-sizing: border-box;
  border: 2px solid transparent;
  border-radius: ${borderRadius()}px;
  display: inline-block;
  max-width: 100%;
  transition: background 0.2s;
  width: ${({ readViewFitContainerWidth }) =>
    readViewFitContainerWidth ? '100%' : 'auto'};

  &:hover {
    background: ${N30};
  }
`;

ReadViewContentWrapper.displayName = 'ReadViewContentWrapper';

export default ReadViewContentWrapper;
