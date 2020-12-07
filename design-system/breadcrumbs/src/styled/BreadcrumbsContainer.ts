import styled from 'styled-components';

import { N200, N300 } from '@atlaskit/theme/colors';
import { themed } from '@atlaskit/theme/components';

const fontColor = themed({ light: N200, dark: N300 });

const BreadcrumbsContainer = styled.div`
  color: ${fontColor};
  display: flex;
  flex-wrap: wrap;
`;

BreadcrumbsContainer.displayName = 'BreadcrumbsContainer';

export default BreadcrumbsContainer;
