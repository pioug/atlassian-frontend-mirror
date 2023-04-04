/** @jsx jsx */
import styled from '@emotion/styled';
import { token } from '@atlaskit/tokens';

/**
 * Loading styled-components
 */
export const LoadignWhatsNewResultsList = styled.ul`
  width: 100%;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  margin-top: ${token('space.200', '16px')};
`;

export const LoadignWhatsNewResultsListItem = styled.li`
  display: block;
  width: 100%;
  padding: ${token('space.100', '8px')};
  margin: 0;
  box-sizing: border-box;
`;
