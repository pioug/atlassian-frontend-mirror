import styled from '@emotion/styled';

import { N20, N200 } from '@atlaskit/theme/colors';
import { borderRadius, gridSize } from '@atlaskit/theme/constants';
import { h600 } from '@atlaskit/theme/typography';
import { token } from '@atlaskit/tokens';

import { bgColor, teamHeaderBgColor } from './constants';

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled -- To migrate as part of go/ui-styling-standard
export const CardTriggerWrapper = styled.div({
  display: 'inherit',
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled -- To migrate as part of go/ui-styling-standard
export const CardWrapper = styled.div({
  backgroundColor: bgColor,
  borderRadius: `${borderRadius()}px`,
  width: `${gridSize() * 40}px`,
  position: 'relative',
  WebkitFontSmoothing: 'antialiased',
  MozOsxFontSmoothing: 'grayscale',
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled -- To migrate as part of go/ui-styling-standard
export const TeamForbiddenErrorStateWrapper = styled.div({
  width: `${gridSize() * 40}px`,
  position: 'relative',
});

// eslint-disable-next-line @atlaskit/design-system/no-styled-tagged-template-expression, @atlaskit/ui-styling-standard/no-styled -- To migrate as part of go/ui-styling-standard
export const CardHeader = styled.div<{ image?: string; isLoading?: boolean }>`
  background-color: ${(props) =>
    props.isLoading
      ? token('color.background.neutral', N20)
      : props.image
      ? ''
      : teamHeaderBgColor};
  background-image: ${(props) => (props.image ? `url(${props.image})` : '')};
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
  box-sizing: content-box;
  height: ${gridSize() * 16}px;
`;

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled -- To migrate as part of go/ui-styling-standard
export const CardContent = styled.div({
  display: 'flex',
  flexDirection: 'column',
  padding: token('space.300', '24px'),
  minHeight: `${gridSize() * 13}px`,
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled -- To migrate as part of go/ui-styling-standard
export const TeamName = styled.h6(h600, {
  textTransform: 'none',
  overflow: 'hidden',
  maxHeight: '48px',
  display: '-webkit-box',
  WebkitLineClamp: 2,
  WebkitBoxOrient: 'vertical',
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled -- To migrate as part of go/ui-styling-standard
export const MemberCount = styled.div({
  color: token('color.text.subtlest', N200),
  marginTop: token('space.050', '4px'),
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled -- To migrate as part of go/ui-styling-standard
export const AvatarSection = styled.div({
  marginTop: token('space.200', '16px'),
  marginLeft: token('space.negative.025', '-2px'),
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled -- To migrate as part of go/ui-styling-standard
export const DescriptionWrapper = styled.div({
  marginTop: token('space.200', '16px'),
  alignItems: 'center',
  display: 'flex',
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled -- To migrate as part of go/ui-styling-standard
export const Description = styled.span({
  overflow: 'hidden',
  maxHeight: '60px',
  display: '-webkit-box',
  WebkitLineClamp: 3,
  WebkitBoxOrient: 'vertical',
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled -- To migrate as part of go/ui-styling-standard
export const ActionButtons = styled.div({
  width: 'calc(100% + 8px)',
  display: 'flex',
  justifyContent: 'space-between',
  margin: `${token('space.300', '24px')} ${token(
    'space.negative.300',
    '-24px',
  )} 0 ${token('space.negative.100', '-8px')}`,
  backgroundColor: token(
    'elevation.surface.overlay',
    'hsla(0, 100%, 100%, 0.2)',
  ),
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled -- To migrate as part of go/ui-styling-standard
export const WrappedButton = styled.div({
  flexBasis: 0,
  flexGrow: 1,
  marginLeft: token('space.100', '8px'),
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled -- To migrate as part of go/ui-styling-standard
export const MoreButton = styled.div({
  marginLeft: token('space.100', '8px'),
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled -- To migrate as part of go/ui-styling-standard
export const LoadingWrapper = styled.div({
  textAlign: 'center',
  marginTop: token('space.500', '40px'),
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled -- To migrate as part of go/ui-styling-standard
export const AccessLockSVGWrapper = styled.div({
  marginBottom: token('space.300', '24px'),
});

// export const LoadingTeamName = styled.div`
//   width: 175px;
//   height: ${gridSize () *3)px;
//   border-radius: ${borderRadius}px;
//   background-color: #f4f5f7;
// `;

// export const LoadingMemberCount = styled.div`
//   width: 81px;
//   height: ${gridSize () *2)px;
//   border-radius: 3px;
//   background-color: #f4f5f7;
//   margin: 4px 0;
// `;
