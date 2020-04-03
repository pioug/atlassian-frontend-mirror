import styled from 'styled-components';
import { gridSize } from '@atlaskit/theme/constants';
import { h600 } from '@atlaskit/theme/typography';

const Header = styled.h4`
  ${h600()};
  margin-top: 0;
  margin-bottom: ${gridSize() * 2}px;
`;

export default Header;
