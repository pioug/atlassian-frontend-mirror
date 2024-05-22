/* eslint-disable @atlaskit/design-system/no-styled-tagged-template-expression -- needs manual remediation */
import React from 'react';

import { keyframes } from '@emotion/react';
import styled from '@emotion/styled';

import { B200, N50A, N60A } from '@atlaskit/theme/colors';
import {
  borderRadius,
  fontSize,
  fontSizeSmall,
  gridSize,
} from '@atlaskit/theme/constants';
import { token } from '@atlaskit/tokens';

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
} from './constants';

interface FullNameLabelProps {
  noMeta?: boolean;
  isDisabledAccount?: boolean;
}

const getFullNameMargin = (props: FullNameLabelProps) =>
  props.noMeta
    ? `${token('space.400', '32px')} 0 ${token('space.150', '12px')} 0`
    : `${token('space.150', '12px')} 0 0 0`;

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled -- To migrate as part of go/ui-styling-standard
export const CardWrapper = styled.div`
  background-color: ${bgColor};
  border-radius: ${token('border.radius', '3px')};
  width: ${gridSize() * 45}px;
`;

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled -- To migrate as part of go/ui-styling-standard
export const ProfileImage = styled.div`
  position: absolute;
  top: ${token('space.300', '24px')};
  left: ${token('space.300', '24px')};
`;

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled -- To migrate as part of go/ui-styling-standard
export const ActionsFlexSpacer = styled.div`
  flex: 1 0 auto;
`;

// eslint-disable-next-line @atlaskit/design-system/no-keyframes-tagged-template-expression -- needs manual remediation
const kudosButtonAnimationTransformation = keyframes`
  0%   { transform: translate(-80px, -50px); }
  100% { transform: translate(90px, -70px); }
`;

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled -- To migrate as part of go/ui-styling-standard
export const KudosBlobAnimationStyle = styled.div`
  display: none;
  height: 150px;
  width: 150px;
  z-index: -1;
  position: absolute;
  top: ${(gridSize() * 4) / fontSize()}em;
  animation-name: ${kudosButtonAnimationTransformation};
  animation-iteration-count: 1;
  animation-duration: 3s;
  background-image: radial-gradient(
    circle,
    ${token('color.background.information.pressed', '#85B8FF')} 0%,
    ${token('color.background.discovery.pressed', '#B8ACF6')} 25%,
    transparent 50%
  );
  overflow: hidden;
`;

export const KudosBlobAnimation: React.FC = (props) => (
  <KudosBlobAnimationStyle className="kudos-blob-animation" {...props} />
);

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled -- To migrate as part of go/ui-styling-standard
export const AnimationWrapper = styled.div`
  clip-path: inset(0px 0px 0px 0px round ${borderRadius()}px);
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
`;

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled -- To migrate as part of go/ui-styling-standard
export const AnimatedKudosButton = styled.div`
  margin-left: ${token('space.100', '8px')};

  /* Need babel-plugin-emotion to use component selector */
  /* Previously with styled-components: &:hover {KudosBlobAnimation} { */
  &:focus-within .kudos-blob-animation,
  &:focus .kudos-blob-animation,
  &:hover .kudos-blob-animation {
    display: block;
  }
`;

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled -- To migrate as part of go/ui-styling-standard
export const ActionButtonGroup = styled.div`
  user-select: none;
  margin: ${token('space.200', '16px')} 0 0 0;
  text-align: right;
  display: flex;
  justify-content: flex-end;

  button,
  a {
    position: relative;
  }

  button,
  a,
  span {
    margin-left: ${token('space.100', '8px')};

    &:first-child {
      margin-left: ${token('space.0', '0px')};
    }
  }

  a,
  button {
    &:focus {
      outline-color: ${token('color.border.focused', B200)};
      outline-offset: ${token('border.width', '2px')};
      outline-style: solid;
      outline-width: ${token('border.width', '2px')};
    }
  }
`;

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled -- To migrate as part of go/ui-styling-standard
export const OverflowActionButtonsWrapper = styled.div`
  display: inline-block;
  width: ${token('space.400', '32px')};
  height: ${token('space.400', '32px')};
  margin-left: ${token('space.100', '8px')};

  button {
    &:focus {
      outline-color: ${token('color.border.focused', B200)};
      outline-offset: ${token('border.width', '2px')};
      outline-style: solid;
      outline-width: ${token('border.width', '2px')};
    }
  }
`;

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled -- To migrate as part of go/ui-styling-standard
export const CardContent = styled.div`
  display: flex;
  flex-direction: column;
  min-height: ${gridSize() * 17}px;
`;

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled -- To migrate as part of go/ui-styling-standard
export const DetailsGroup = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: ${gridSize() * 14.5}px;
  width: ${gridSize() * 24.5}px;
`;

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled -- To migrate as part of go/ui-styling-standard
export const DisabledInfo = styled.div`
  font-size: ${fontSizeSmall()}px;
  color: ${labelTextColor};
  margin: ${token('space.150', '12px')} 0 0 0;
  line-height: 16px;
`;

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled -- To migrate as part of go/ui-styling-standard
export const FullNameLabel = styled.h2`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  font-size: 18px;
  font-weight: 400;
  letter-spacing: normal;
  color: ${(props: FullNameLabelProps) =>
    props.isDisabledAccount ? headerTextColorInactive : headerTextColor};
  margin: ${(props: FullNameLabelProps) => getFullNameMargin(props)};
  line-height: ${24 / 18}em;
  :first-child {
    margin: ${(props: FullNameLabelProps) => getFullNameMargin(props)};
  }
`;

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled -- To migrate as part of go/ui-styling-standard
export const LozengeWrapper = styled.div`
  margin-top: ${token('space.200', '16px')};
  text-transform: uppercase;
  display: block;
`;

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled -- To migrate as part of go/ui-styling-standard
export const CustomLozengeContainer = styled(LozengeWrapper)`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: flex-start;
  margin-top: ${token('space.150', '12px')};
  > * {
    margin-top: ${token('space.050', '4px')};
    &:not(:last-child) {
      margin-right: ${token('space.050', '4px')};
    }
  }
`;

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled -- To migrate as part of go/ui-styling-standard
export const JobTitleLabel = styled.span`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  font-size: 14px;
  color: ${headerTextColor};
  margin: 0 0 ${token('space.150', '12px')} 0;
  line-height: ${24 / 14}em;
`;

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled -- To migrate as part of go/ui-styling-standard
export const AppTitleLabel = styled.span`
  background: ${appLabelBgColor};
  color: ${appLabelTextColor};
  border-radius: ${borderRadius()};
  padding: 0 ${token('space.075', '6px')};
  width: fit-content;
  font-weight: bold;
  text-transform: uppercase;

  font-size: 12px;
  margin: ${token('space.050', '4px')} 0 ${token('space.150', '12px')} 0;
  line-height: ${24 / 14}em;
`;

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled -- To migrate as part of go/ui-styling-standard
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

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled -- To migrate as part of go/ui-styling-standard
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
  padding: ${token('space.300', '24px')};
  box-shadow: ${(props: CardContainerProps) =>
    props.withoutElevation
      ? ''
      : `${token(
          'elevation.shadow.overlay',
          `0 4px 8px -2px ${N50A}, 0 0 1px ${N60A}`,
        )}`};
  border-radius: ${(props: CardContainerProps) =>
    props.withoutElevation ? '' : `${borderRadius()}px`};

  overflow: hidden;
`;

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled -- To migrate as part of go/ui-styling-standard
export const DetailsLabel = styled.div`
  display: flex;
  align-items: center;
  line-height: 24px;
  font-size: ${gridSize() * 1.5}px;
  margin: ${token('space.200', '16px')} 0 0 0;
  white-space: nowrap;

  & + & {
    margin-top: ${token('space.025', '2px')};
  }
`;

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled -- To migrate as part of go/ui-styling-standard
export const DetailsLabelIcon = styled.div`
  display: flex;
  flex-shrink: 0;
  color: ${labelIconColor};
  width: ${token('space.200', '16px')};
  height: ${token('space.200', '16px')};
  padding: ${token('space.050', '4px')};
  vertical-align: top;

  svg {
    width: 100%;
    height: 100%;
  }
`;

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled -- To migrate as part of go/ui-styling-standard
export const DetailsLabelText = styled.span`
  overflow: hidden;
  text-overflow: ellipsis;
  color: ${labelTextColor};
  padding-left: ${token('space.050', '4px')};
`;
