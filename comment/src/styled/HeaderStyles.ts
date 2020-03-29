import styled from 'styled-components';
import { gridSize } from '@atlaskit/theme/constants';
import { N100A } from '@atlaskit/theme/colors';

const ThemeColor = {
  Restricted: {
    text: N100A,
  },
};

export const BulletSpacer = styled.span`
  padding-right: ${gridSize() / 2}px;
`;

export const Restricted = styled.div`
  color: ${ThemeColor.Restricted.text};
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

  &:first-child {
    margin-left: 0;

    [dir='rtl'] & {
      margin-right: 0;
    }
  }
`;

export const TopItemsContainer = styled.div`
  display: flex;
`;
