import styled from 'styled-components';

import {
  borderRadius,
  fontSizeSmall,
  gridSize,
} from '@atlaskit/theme/constants';
import { divide, multiply } from '@atlaskit/theme/math';

import {
  appLabelBgColor,
  appLabelTextColor,
  bgColor,
  headerBgColor,
  headerBgColorDisabledUser,
  headerTextColor,
  headerTextColorInactive,
  labelIconColor,
  labelTextColor,
} from '../styled/constants';

interface FullNameLabelProps {
  noMeta?: boolean;
  isDisabledAccount?: boolean;
}

const getFullNameMargin = (props: FullNameLabelProps) =>
  props.noMeta
    ? `${gridSize() * 4.5}px 0 ${gridSize() * 1.5}px 0`
    : `${gridSize() * 1.5}px 0 0 0`;

export const CardContainerEmpty = styled.div``;

export const CardTriggerWrapper = styled.div`
  display: inherit;
`;

export const CardWrapper = styled.div`
  background-color: ${bgColor};
  border-radius: ${borderRadius}px;
  width: ${multiply(gridSize, 45)}px;
`;

export const ProfileImage = styled.div`
  position: absolute;
  top: ${multiply(gridSize, 3)}px;
  left: ${multiply(gridSize, 3)}px;
`;

export const ActionsFlexSpacer = styled.div`
  flex: 1 0 auto;
`;

export const ActionButtonGroup = styled.div`
  user-select: none;
  margin: ${multiply(gridSize, 2)}px 0 0 0;
  text-align: right;

  button {
    margin-left: ${gridSize}px;

    &:first-child {
      margin-left: 0;
    }
  }
`;

export const CardContent = styled.div`
  display: flex;
  flex-direction: column;
  min-height: ${multiply(gridSize, 17)}px;
`;

export const DetailsGroup = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: ${multiply(gridSize, 14.5)}px;
  width: ${multiply(gridSize, 24.5)}px;
`;

export const DisabledInfo = styled.div`
  font-size: ${fontSizeSmall}px;
  color: ${labelTextColor};
  margin: ${multiply(gridSize, 1.5)}px 0 0 0;
  line-height: ${multiply(gridSize, 2)}px;
`;

export const FullNameLabel = styled.span`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  font-size: 18px;
  color: ${(props: FullNameLabelProps) =>
    props.isDisabledAccount ? headerTextColorInactive : headerTextColor};
  margin: ${(props: FullNameLabelProps) => getFullNameMargin(props)};
  line-height: ${divide(() => 24, 18)}em;
`;

export const LozengeWrapper = styled.div`
  margin-top: ${multiply(gridSize, 2)}px;
  text-transform: uppercase;
  display: block;
`;

export const JobTitleLabel = styled.span`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  font-size: 14px;
  color: ${headerTextColor};
  margin: 0 0 ${multiply(gridSize, 1.5)}px 0;
  line-height: ${divide(() => 24, 14)}em;
`;

export const AppTitleLabel = styled.span`
  background: ${appLabelBgColor};
  color: ${appLabelTextColor};
  border-radius: ${borderRadius()};
  padding: 0 6px;
  width: fit-content;
  font-weight: bold;
  text-transform: uppercase;

  font-size: 12px;
  margin: 4px 0 ${multiply(gridSize, 1.5)}px 0;
  line-height: ${divide(() => 24, 14)}em;
`;

export const SpinnerContainer = styled.div`
  align-items: center;
  display: flex;
  height: ${multiply(gridSize, 12)}px;
  justify-content: center;
  position: relative;
`;

export const CardContainer = styled.div`
  position: relative;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background-image: linear-gradient(
    to bottom,
    ${(props: { isDisabledUser: boolean }) =>
        props.isDisabledUser ? headerBgColorDisabledUser : headerBgColor}
      0%,
    ${props =>
        props.isDisabledUser ? headerBgColorDisabledUser : headerBgColor}
      100%
  );
  background-repeat: no-repeat;
  background-size: 100% ${multiply(gridSize, 12)}px;
  box-sizing: content-box;
  padding: ${multiply(gridSize, 3)}px;
`;

export const DetailsLabel = styled.div`
  display: flex;
  align-items: center;
  line-height: ${multiply(gridSize, 3)}px;
  font-size: ${multiply(gridSize, 1.5)}px;
  margin: ${multiply(gridSize, 2)}px 0 0 0;
  white-space: nowrap;

  & + & {
    margin-top: ${multiply(gridSize, 0.25)}px;
  }
`;

export const DetailsLabelIcon = styled.div`
  display: flex;
  flex-shrink: 0;
  color: ${labelIconColor};
  width: ${multiply(gridSize, 2)}px;
  height: ${multiply(gridSize, 2)}px;
  padding: ${multiply(gridSize, 0.5)}px;
  vertical-align: top;

  svg {
    width: 100%;
    height: 100%;
  }
`;

export const DetailsLabelText = styled.span`
  overflow: hidden;
  text-overflow: ellipsis;
  color: ${labelTextColor};
  padding-left: ${multiply(gridSize, 0.5)}px;
`;
