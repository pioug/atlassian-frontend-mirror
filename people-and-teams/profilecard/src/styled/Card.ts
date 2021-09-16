import styled, { css } from 'styled-components';

import {
  borderRadius,
  fontSizeSmall,
  gridSize,
} from '@atlaskit/theme/constants';
import { e200 } from '@atlaskit/theme/elevation';

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

export const CardWrapper = styled.div`
  background-color: ${bgColor};
  border-radius: ${borderRadius}px;
  width: ${gridSize() * 45}px;
`;

export const ProfileImage = styled.div`
  position: absolute;
  top: ${gridSize() * 3}px;
  left: ${gridSize() * 3}px;
`;

export const ActionsFlexSpacer = styled.div`
  flex: 1 0 auto;
`;

export const ActionButtonGroup = styled.div`
  user-select: none;
  margin: ${2 * gridSize()}px 0 0 0;
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
  min-height: ${gridSize() * 17}px;
`;

export const DetailsGroup = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: ${gridSize() * 14.5}px;
  width: ${gridSize() * 24.5}px;
`;

export const DisabledInfo = styled.div`
  font-size: ${fontSizeSmall}px;
  color: ${labelTextColor};
  margin: ${gridSize() * 1.5}px 0 0 0;
  line-height: ${gridSize() * 2}px;
`;

export const FullNameLabel = styled.span`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  font-size: 18px;
  color: ${(props: FullNameLabelProps) =>
    props.isDisabledAccount ? headerTextColorInactive : headerTextColor};
  margin: ${(props: FullNameLabelProps) => getFullNameMargin(props)};
  line-height: ${24 / 18}em;
`;

export const LozengeWrapper = styled.div`
  margin-top: ${gridSize() * 2}px;
  text-transform: uppercase;
  display: block;
`;

export const CustomLozengeContainer = styled(LozengeWrapper)`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: flex-start;
  margin-top: ${gridSize() * 1.5}px;
  > * {
    margin-top: ${gridSize() / 2}px;
    &:not(:last-child) {
      margin-right: ${gridSize() / 2}px;
    }
  }
`;

export const JobTitleLabel = styled.span`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  font-size: 14px;
  color: ${headerTextColor};
  margin: 0 0 ${gridSize() * 1.5}px 0;
  line-height: ${24 / 14}em;
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
  margin: 4px 0 ${gridSize() * 1.5}px 0;
  line-height: ${24 / 14}em;
`;

export const SpinnerContainer = styled.div`
  align-items: center;
  display: flex;
  height: ${gridSize() * 12}px;
  justify-content: center;
  position: relative;
`;

interface CardContainerProps {
  isDisabledUser?: boolean;
  withoutElevation?: boolean;
}

export const CardContainer = styled.div`
  position: relative;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background-image: linear-gradient(
    to bottom,
    ${(props: CardContainerProps) =>
        props.isDisabledUser ? headerBgColorDisabledUser : headerBgColor}
      0%,
    ${(props) =>
        props.isDisabledUser ? headerBgColorDisabledUser : headerBgColor}
      100%
  );
  background-repeat: no-repeat;
  background-size: 100% ${gridSize() * 12}px;
  box-sizing: content-box;
  padding: ${gridSize() * 3}px;
  ${(props: CardContainerProps) => {
    if (props.withoutElevation) {
      return '';
    }

    return css`
      ${e200}
      border-radius: ${borderRadius}px;
    `;
  }}
`;

export const DetailsLabel = styled.div`
  display: flex;
  align-items: center;
  line-height: ${gridSize() * 3}px;
  font-size: ${gridSize() * 1.5}px;
  margin: ${gridSize() * 2}px 0 0 0;
  white-space: nowrap;

  & + & {
    margin-top: ${gridSize() / 4}px;
  }
`;

export const DetailsLabelIcon = styled.div`
  display: flex;
  flex-shrink: 0;
  color: ${labelIconColor};
  width: ${gridSize() * 2}px;
  height: ${gridSize() * 2}px;
  padding: ${gridSize() / 2}px;
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
  padding-left: ${gridSize() / 2}px;
`;
