import React from 'react';
import styled from 'styled-components';

import { colors } from '@atlaskit/theme';

const Separator = styled.div`
  background: ${colors.N30};
  width: 1px;
  height: 20px;
  margin: 0 4px;
`;

export default () => <Separator className="separator" />;
