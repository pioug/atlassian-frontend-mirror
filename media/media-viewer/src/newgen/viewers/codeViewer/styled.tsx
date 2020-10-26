import styled from 'styled-components';
import { colors } from '@atlaskit/theme';

export const CodeViewWrapper = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  background-color: ${colors.N20};
  overflow: auto;

  & > span {
    margin-top: 75px;
  }
`;

export const CodeViewerHeaderBar = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  height: 75px;
  background-color: #0e1624;
`;
