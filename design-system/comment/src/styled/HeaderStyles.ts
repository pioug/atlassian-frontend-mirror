import styled from '@emotion/styled';

import { N100A } from '@atlaskit/theme/colors';
import { gridSize } from '@atlaskit/theme/constants';
import { token } from '@atlaskit/tokens';

export const BulletSpacer = styled.span`
  padding-right: ${gridSize() / 2}px;
`;

export const Restricted = styled.div`
  color: ${token('color.text.lowEmphasis', N100A)};
  display: flex;
`;

export const RestrictedIconWrapper = styled.span`
  margin-right: ${gridSize() / 2}px;
`;
RestrictedIconWrapper.displayName = 'RestrictedIconWrapper';

export const TopItem = styled.div`
  display: inline-block;
  margin-left: ${gridSize()}px;

  [dir='rtl'] & {
    margin-left: 0;
    margin-right: ${gridSize()}px;
  }

  &:first-of-type {
    margin-left: 0;

    [dir='rtl'] & {
      margin-right: 0;
    }
  }
`;

export const TopItemsContainer = styled.div`
  display: flex;
`;
