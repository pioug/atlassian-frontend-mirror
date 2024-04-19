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

export const UserInfoOuter = styled.div({
  display: 'flex',
  alignItems: 'center',
  width: '100%',
  marginBottom: `${gridSizeTimes(2)}px`,
});

export const Avatar = styled.div({
  display: 'flex',
  flexDirection: 'column',
  marginLeft: `${gridSizeTimes(2.5)}px`,
  marginRight: `${gridSizeTimes(1)}px`,
});

export const UserDetails = styled.div({
  display: 'flex',
  flexDirection: 'column',
  marginLeft: `${gridSizeTimes(0.5)}px`,
});

export const UserName = styled.span(h500, {
  marginTop: 0,
});

export const UserEmail = styled.span(baseHeading(11, 16), {
  color: token('color.text.subtlest', N200),
  fontWeight: 300,
  marginTop: `${gridSizeTimes(0.5)}px`,
});
