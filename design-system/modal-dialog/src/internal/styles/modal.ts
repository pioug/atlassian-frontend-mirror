import { css } from '@emotion/core';
import styled from '@emotion/styled';

import { DN50, N0, N30A, N60A, text } from '@atlaskit/theme/colors';
import { themed } from '@atlaskit/theme/components';
import { borderRadius, layers } from '@atlaskit/theme/constants';

import { gutter, WIDTH_ENUM, WidthNames } from '../constants';

const boxShadow = ({ isChromeless }: { isChromeless?: boolean }) =>
  isChromeless
    ? 'none'
    : `
      0 0 0 1px ${N30A}, 0 2px 1px ${N30A},
      0 0 20px -6px ${N60A}
    `;
const dialogBgColor = ({ isChromeless }: { isChromeless?: boolean }) => {
  return isChromeless ? 'transparent' : themed({ light: N0, dark: DN50 })();
};
const maxDimensions = `calc(100% - ${gutter * 2}px)`;
const maxHeightDimensions = `calc(100% - ${gutter * 2 - 1}px)`;

export const dialogWidth = ({ widthName, widthValue }: PositionerProps) => {
  if (typeof widthValue === 'number') {
    return `${widthValue}px`;
  }

  return widthName ? `${WIDTH_ENUM.widths[widthName]}px` : widthValue || 'auto';
};

export const dialogHeight = ({
  heightValue,
}: {
  heightValue?: string | number;
}) => {
  if (typeof heightValue === 'number') {
    return `${heightValue}px`;
  }
  return heightValue || 'auto';
};

/**
  NOTE:
  z-index
  - temporarily added to beat @atlaskit/navigation

  absolute + top
  - rather than fixed position so popper.js children are properly positioned

  overflow-y
  - only active when popper.js children invoked below the dialog
*/
interface FillScreenProps {
  scrollDistance: number;
}

export const FillScreen = styled.div<FillScreenProps>`
  height: 100vh;
  left: 0;
  overflow-y: auto;
  position: absolute;
  top: ${(props: FillScreenProps) => props.scrollDistance}px;
  width: 100%;
  z-index: ${layers.modal};
  -webkit-overflow-scrolling: touch;
`;

interface PositionerProps {
  widthName?: WidthNames;
  widthValue?: string | number;
}

const positionBaseStyles = (props: PositionerProps) => css`
  display: flex;
  flex-direction: column;
  height: ${maxHeightDimensions};
  left: 0;
  right: 0;
  margin-left: auto;
  margin-right: auto;
  max-width: ${maxDimensions};
  top: ${gutter}px;
  width: ${dialogWidth(props)};
  z-index: ${layers.modal()};
  pointer-events: none;
`;

const positionBaseResponsiveStyles = css`
  height: 100%;
  left: 0;
  position: fixed;
  top: 0;
  max-width: 100%;
  width: 100%;
`;

export const PositionerAbsolute = styled.div<PositionerProps>`
  ${positionBaseStyles};
  position: absolute;

  @media (max-width: 480px) {
    ${positionBaseResponsiveStyles};
  }
`;

export const PositionerRelative = styled.div<PositionerProps>`
  margin: ${gutter}px auto;
  position: relative;
  width: ${dialogWidth};
  z-index: ${layers.modal};

  @media (max-width: 480px) {
    ${positionBaseResponsiveStyles};
    margin: 0;
  }
`;

export const PositionerFixed = styled.div<PositionerProps>`
  ${positionBaseStyles};
  position: fixed;

  @media (max-width: 480px) {
    ${positionBaseResponsiveStyles};
  }
`;

interface DialogProps {
  isChromeless?: boolean;
  heightValue?: string | number;
}
export const Dialog = styled.div<DialogProps>`
  ${(props: DialogProps) =>
    props.isChromeless
      ? null
      : `
          background-color: ${dialogBgColor(props)};
          border-radius: ${borderRadius()}px;
          box-shadow: ${boxShadow(props)};
        `}
  color: ${text};
  display: flex;
  flex-direction: column;
  height: ${(props: DialogProps) =>
    dialogHeight({ heightValue: props.heightValue })};
  max-height: 100%;
  outline: 0;
  pointer-events: auto;

  @media (max-width: 480px) {
    height: 100%;
    max-height: 100%;
    border-radius: 0;
  }
`;

PositionerAbsolute.displayName = 'PositionerAbsolute';
Dialog.displayName = 'Dialog';
FillScreen.displayName = 'FillScreen';
PositionerRelative.displayName = 'PositionerRelative';
PositionerFixed.displayName = 'PositionerFixed';
