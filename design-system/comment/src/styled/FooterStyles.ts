import styled from '@emotion/styled';

import { N500, Y500 } from '@atlaskit/theme/colors';
import { gridSize } from '@atlaskit/theme/constants';
import { token } from '@atlaskit/tokens';

import { actionsPadding } from './constants';

export const ActionsItem = styled.div`
  display: flex;

  & + &::before {
    color: ${token('color.text.mediumEmphasis', N500)};
    content: '·';
    display: inline-block;
    text-align: center;
    vertical-align: middle;
    width: ${actionsPadding}px;
  }
`;

export const ErrorIcon = styled.span`
  color: ${token('color.text.warning', Y500)};
  padding-right: ${gridSize()}px;
`;

export const ActionsContainer = styled.div`
  align-items: center;
  display: flex;
  flex-wrap: wrap;
  margin-top: ${gridSize() * 0.75}px;
`;
