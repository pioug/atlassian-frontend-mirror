import styled from '@emotion/styled';
import { fontSize } from '@atlaskit/theme/constants';
import { h500 } from '@atlaskit/theme/typography';
import { N200 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

import gridSizeTimes from '../../util/gridSizeTimes';

const baseHeading = (size: number, lineHeight: number) => `
  font-size: ${size / fontSize()}em;
  font-style: inherit;
  line-height: ${lineHeight / size};
`;

export const UserInfoOuter = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  margin-bottom: ${gridSizeTimes(2)}px;
`;

export const Avatar = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: ${gridSizeTimes(2.5)}px;
  margin-right: ${gridSizeTimes(1)}px;
`;

export const UserDetails = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: ${gridSizeTimes(0.5)}px;
`;

export const UserName = styled.span`
  ${h500};
  margin-top: 0;
`;

export const UserEmail = styled.span`
  ${baseHeading(11, 16)} color: ${token('color.text.subtlest', N200)};
  font-weight: 300;
  margin-top: ${gridSizeTimes(0.5)}px;
`;
