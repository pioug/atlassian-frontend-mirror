import styled from '@emotion/styled';
import { token } from '@atlaskit/tokens';
import { borderRadius } from '@atlaskit/theme/constants';
import { scrollableMaxHeight } from '../../shared-styles';

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled -- To migrate as part of go/ui-styling-standard
export const ScrollableStyle = styled.div`
  display: block;
  overflow-x: hidden;
  overflow-y: auto;

  padding: ${token('space.050', '4px')} 0;
  margin: 0;

  background: ${token('elevation.surface', 'white')};
  max-height: ${scrollableMaxHeight};

  border-radius: ${borderRadius()}px;
`;
