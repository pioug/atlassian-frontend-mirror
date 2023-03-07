import styled from '@emotion/styled';

import { N20, N200 } from '@atlaskit/theme/colors';
import { borderRadius, gridSize } from '@atlaskit/theme/constants';
import { h600 } from '@atlaskit/theme/typography';
import { token } from '@atlaskit/tokens';

import { bgColor, teamHeaderBgColor } from './constants';

export const CardTriggerWrapper = styled.div`
  display: inherit;
`;

export const CardWrapper = styled.div`
  background-color: ${bgColor};
  border-radius: ${borderRadius}px;
  width: ${gridSize() * 40}px;
  position: relative;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
`;

export const TeamForbiddenErrorStateWrapper = styled.div`
  width: ${gridSize() * 40}px;
  position: relative;
`;

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

export const CardContent = styled.div`
  display: flex;
  flex-direction: column;
  padding: ${gridSize() * 3}px;
  min-height: ${gridSize() * 13}px;
`;

export const TeamName = styled.h6`
  ${h600};
  text-transform: none;
  overflow: hidden;
  max-height: 48px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
`;

export const MemberCount = styled.div`
  color: ${token('color.text.subtlest', N200)};
  margin-top: ${gridSize() * 0.5}px;
`;

export const AvatarSection = styled.div`
  margin-top: ${gridSize() * 2}px;
  margin-left: -2px;
`;

export const DescriptionWrapper = styled.div`
  margin-top: ${gridSize() * 2}px;
  align-items: center;
  display: flex;
`;

export const Description = styled.span`
  overflow: hidden;
  max-height: 60px;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
`;

export const ActionButtons = styled.div`
  width: calc(100% + 8px);
  display: flex;
  justify-content: space-between;
  margin: ${gridSize() * 3}px -${gridSize() * 3}px 0 -${gridSize()}px;
  background-color: ${token(
    'elevation.surface.overlay',
    'hsla(0, 100%, 100%, 0.2)',
  )};
`;

export const WrappedButton = styled.div`
  flex-basis: 0;
  flex-grow: 1;
  margin-left: 8px;
`;

export const MoreButton = styled.div`
  margin-left: 8px;
`;

export const LoadingWrapper = styled.div`
  text-align: center;
  margin-top: ${gridSize() * 5}px;
`;

export const AccessLockSVGWrapper = styled.div`
  margin-bottom: ${gridSize() * 3}px;
`;

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
