import styled, { css } from 'styled-components';

import { N200, N20 } from '@atlaskit/theme/colors';
import { borderRadius, gridSize } from '@atlaskit/theme/constants';
import { multiply } from '@atlaskit/theme/math';
import { h600 } from '@atlaskit/theme/typography';

import { teamHeaderBgColor, bgColor } from '../styled/constants';

export const CardTriggerWrapper = styled.div`
  display: inherit;
`;

export const CardElevationWrapper = styled.div`
  background-color: ${bgColor};
  border-radius: ${borderRadius}px;
  width: ${multiply(gridSize, 40)}px;
`;

export const CardContainer = styled.div`
  position: relative;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
`;

const loadingImage = css`
  background-color: ${N20};
`;

const defaultImage = css`
  background-color: ${teamHeaderBgColor};
`;

export const CardHeader = styled.div<{ image?: string; isLoading?: boolean }>`
  ${props => {
    if (props.isLoading) {
      return loadingImage;
    }

    if (props.image) {
      return css`
        background-image: url('${props.image}');
      `;
    }

    return defaultImage;
  }};
  background-repeat: no-repeat;
  background-size: cover;
  box-sizing: content-box;
  height: ${multiply(gridSize, 16)}px;
`;

export const CardContent = styled.div`
  display: flex;
  flex-direction: column;
  padding: ${multiply(gridSize, 3)}px;
  min-height: ${multiply(gridSize, 13)}px;
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
  color: ${N200};
  margin-top: ${multiply(gridSize, 0.5)}px;
`;

export const AvatarSection = styled.div`
  margin-top: ${multiply(gridSize, 2)}px;
  margin-left: -2px;
`;

export const DescriptionWrapper = styled.div`
  margin-top: ${multiply(gridSize, 2)}px;
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
  margin: ${multiply(gridSize, 3)}px -${multiply(gridSize, 3)}px 0 -${gridSize}px;
  background-color: hsla(0, 100%, 100%, 0.2);
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
  margin-top: ${multiply(gridSize, 5)}px;
`;

// export const LoadingTeamName = styled.div`
//   width: 175px;
//   height: ${multiply(gridSize, 3)}px;
//   border-radius: ${borderRadius}px;
//   background-color: #f4f5f7;
// `;

// export const LoadingMemberCount = styled.div`
//   width: 81px;
//   height: ${multiply(gridSize, 2)}px;
//   border-radius: 3px;
//   background-color: #f4f5f7;
//   margin: 4px 0;
// `;
