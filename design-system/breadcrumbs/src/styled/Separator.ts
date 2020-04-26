import styled from 'styled-components';

import { N100 } from '@atlaskit/theme/colors';
import { gridSize } from '@atlaskit/theme/constants';

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
