import styled from 'styled-components';

import { DN300, N300 } from '@atlaskit/theme/colors';
import { themed } from '@atlaskit/theme/components';
import { gridSize } from '@atlaskit/theme/constants';

export default styled.div`
  box-sizing: border-box;
  display: block;
  margin-top: ${gridSize}px;

  &:first-child {
    margin-top: 0;
  }
`;

export const Heading = styled.div`
  align-items: baseline;
  color: ${themed({
    light: N300,
    dark: DN300,
  })};
  display: flex;
  flex: 1 1 auto;
  font-weight: normal;
  font-size: 14px;
  line-height: 1;
  margin: 0;
  padding: ${gridSize}px ${gridSize() * 1.5}px;
`;
export const HeadingAfter = styled.div`
  flex: 0 0 auto;
`;
export const HeadingText = styled.div`
  flex: 1 1 auto;
  font-size: 12px;
  text-transform: uppercase;
`;
