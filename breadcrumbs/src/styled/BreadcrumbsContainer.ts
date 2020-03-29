import styled from 'styled-components';
import { themed } from '@atlaskit/theme/components';
import { N300 } from '@atlaskit/theme/colors';

const ThemeColor = themed({ light: N300, dark: N300 });

const BreadcrumbsContainer = styled.div`
  color: ${ThemeColor};
  display: flex;
  flex-wrap: wrap;
`;

BreadcrumbsContainer.displayName = 'BreadcrumbsContainer';

export default BreadcrumbsContainer;
