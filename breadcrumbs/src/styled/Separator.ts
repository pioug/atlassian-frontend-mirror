import styled from 'styled-components';
import { gridSize } from '@atlaskit/theme/constants';
import { N100 } from '@atlaskit/theme/colors';

const ThemeColor = {
  text: N100,
};

const Separator = styled.div`
  color: ${ThemeColor.text};
  flex-shrink: 0;
  padding: 0 ${gridSize}px;
  text-align: center;
  width: ${gridSize}px;
`;

Separator.displayName = 'Separator';

export default Separator;
