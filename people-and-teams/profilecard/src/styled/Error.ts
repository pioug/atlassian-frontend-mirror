import styled from 'styled-components';

import { N200 } from '@atlaskit/theme/colors';
import { gridSize } from '@atlaskit/theme/constants';
import { h400 } from '@atlaskit/theme/typography';

import {
  errorIconColor,
  errorTextColor,
  errorTitleColor,
} from '../styled/constants';

export const ErrorWrapper = styled.div`
  text-align: center;
  padding: ${gridSize() * 3}px;
  color: ${errorIconColor};
`;

export const ErrorTitle = styled.p`
  color: ${errorTitleColor};
  line-height: ${gridSize() * 3}px;
  margin: ${gridSize}px 0;
`;

export const ErrorText = styled.span`
  color: ${errorTextColor};
`;

export const TeamErrorTitle = styled.p`
  ${h400};
`;

export const TeamErrorText = styled.p`
  color: ${N200};
  margin-top: ${gridSize() * 1}px;
`;
