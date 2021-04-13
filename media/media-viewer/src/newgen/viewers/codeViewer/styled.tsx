import styled from 'styled-components';
// AFP-2532 TODO: Fix automatic suppressions below
// eslint-disable-next-line @atlassian/tangerine/import/entry-points
import { colors } from '@atlaskit/theme';

export const CodeViewWrapper = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  background-color: ${colors.N20};
  overflow: auto;
`;

export const CodeViewerHeaderBar = styled.div`
  height: 75px;
  background-color: #0e1624;
`;
