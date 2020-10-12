import React from 'react';
import styled from 'styled-components';
import { colors, elevation, gridSize, ThemedValue } from '@atlaskit/theme';
import { ComponentType } from 'react';

interface IconBaseProps {
  bgColor?: string;
  iconElevation?: ThemedValue<string>;
}

const IconBase = styled.div<IconBaseProps>`
  display: flex;
  justify-content: center;
  align-items: center;
  width: ${4 * gridSize()}px;
  height: ${4 * gridSize()}px;
  border-radius: ${gridSize()}px;
  ${({ iconElevation }) => (iconElevation ? iconElevation : '')};
  background-color: ${({ bgColor }) => bgColor};
  overflow: hidden;
`;

const ImageIconBase = styled.img`
  width: ${gridSize() * 4}px;
  height: ${gridSize() * 4}px;
`;

interface AkIconProps {
  primaryColor?: string;
  secondaryColor?: string;
  size?: 'small' | 'medium' | 'large' | 'xlarge';
}

interface AkLogoProps {
  iconGradientStart?: string;
  iconGradientStop?: string;
  iconColor?: string;
  size?: 'xsmall' | 'small' | 'medium' | 'large' | 'xlarge';
}

interface IconBackgroundTheme {
  backgroundColor?: string;
}

interface IconTheme {
  primaryColor?: string | ThemedValue<string>;
  iconColor?: string | ThemedValue<string>;
  iconElevation?: ThemedValue<string>;
  iconGradientStart?: string;
  iconGradientStop?: string;
}

type IconThemeMap = {
  [index: string]: IconTheme & IconBackgroundTheme;
};

export const themes: IconThemeMap = {
  default: {
    backgroundColor: '#fff',
    primaryColor: '#000',
    iconElevation: elevation.e100,
  },
  product: {
    iconColor: colors.N0,
    backgroundColor: colors.B400,
    primaryColor: colors.N0,
    iconElevation: elevation.e100,
  },
  admin: {
    backgroundColor: colors.DN70,
    primaryColor: colors.N0,
    iconElevation: elevation.e100,
  },
  custom: {
    backgroundColor: colors.N0,
    primaryColor: colors.DN70,
    iconElevation: elevation.e100,
  },
  subtle: {
    backgroundColor: 'transparent',
    primaryColor: colors.text,
  },
  recommendedProduct: {
    backgroundColor: colors.N30,
    iconColor: colors.B200,
    iconGradientStart: colors.B400,
    iconGradientStop: colors.B200,
    iconElevation: elevation.e100,
  },
  discover: {
    backgroundColor: colors.N30,
    primaryColor: colors.DN90,
    iconElevation: elevation.e100,
  },
};

interface IconProps {
  theme: string;
}

export type IconType = ComponentType<IconProps>;

export const createIcon = (
  InnerIcon: React.ComponentType<any>,
  defaultProps?: AkIconProps | AkLogoProps,
): IconType => props => {
  const { backgroundColor, iconElevation, ...iconProps } =
    themes[props.theme] || themes.default;

  return (
    <IconBase bgColor={backgroundColor} iconElevation={iconElevation}>
      <InnerIcon {...defaultProps} {...iconProps} />
    </IconBase>
  );
};

export const createImageIcon = (url: string): IconType => props => {
  const { backgroundColor } = themes[props.theme] || themes.default;

  return (
    <IconBase bgColor={backgroundColor}>
      <ImageIconBase src={url} />
    </IconBase>
  );
};
