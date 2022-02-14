import styled from '@emotion/styled';
import { token } from '@atlaskit/tokens';
import { borderRadius } from '@atlaskit/theme/constants';
import { scrollableMaxHeight } from '../../shared-styles';

export const ScrollableStyle = styled.div`
  display: block;
  overflow-x: hidden;
  overflow-y: auto;

  padding: 4px 0;
  margin: 0;

  background: ${token('elevation.surface', 'white')};
  max-height: ${scrollableMaxHeight};

  border-radius: ${borderRadius()}px;
`;
