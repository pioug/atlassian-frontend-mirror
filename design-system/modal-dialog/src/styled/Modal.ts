import styled from '@emotion/styled';
import { themed } from '@atlaskit/theme/components';
import { borderRadius, layers } from '@atlaskit/theme/constants';
import { N30A, N60A, N0, DN50, text } from '@atlaskit/theme/colors';
import { WIDTH_ENUM, gutter, WidthNames } from '../shared-variables';

import {
  flexMaxHeightIEFix,
  IEMaxHeightCalcPx,
} from '../utils/flex-max-height-ie-fix';

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
const maxHeightDimensions = `calc(100% - ${gutter * 2 - IEMaxHeightCalcPx}px)`;

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

export const PositionerAbsolute = styled.div<PositionerProps>`
  display: flex;
  flex-direction: column;
  height: ${maxHeightDimensions};
  left: 0;
  margin-left: auto;
  margin-right: auto;
  max-width: ${maxDimensions};
  position: absolute;
  right: 0;
  top: ${gutter}px;
  width: ${dialogWidth};
  z-index: ${layers.modal};
  pointer-events: none;

  @media (min-width: 320px) and (max-width: 480px) {
    height: 100%;
    left: 0;
    position: fixed;
    top: 0;
    max-width: 100%;
    width: 100%;
  }
`;
export const PositionerRelative = styled.div<PositionerProps>`
  margin: ${gutter}px auto;
  position: relative;
  width: ${dialogWidth};
  z-index: ${layers.modal};
  pointer-events: none;

  @media (min-width: 320px) and (max-width: 480px) {
    height: 100%;
    left: 0;
    position: fixed;
    top: 0;
    margin: 0;
    max-width: 100%;
    width: 100%;
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
  ${flexMaxHeightIEFix};
  outline: 0;
  pointer-events: auto;

  @media (min-width: 320px) and (max-width: 480px) {
    height: 100%;
    max-height: 100%;
    border-radius: 0;
  }
`;

PositionerAbsolute.displayName = 'PositionerAbsolute';
Dialog.displayName = 'Dialog';
FillScreen.displayName = 'FillScreen';
PositionerRelative.displayName = 'PositionerRelative';
