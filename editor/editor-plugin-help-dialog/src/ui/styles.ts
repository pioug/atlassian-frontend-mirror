import { css } from '@emotion/react';

import {
  akEditorUnitZIndex,
  relativeFontSizeToBase16,
} from '@atlaskit/editor-shared-styles';
import * as colors from '@atlaskit/theme/colors';
import { N400 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

export const header = css`
  z-index: ${akEditorUnitZIndex};
  min-height: ${token('space.300', '24px')};
  padding: ${token('space.250', '20px')} ${token('space.500', '40px')};
  font-size: ${relativeFontSizeToBase16(24)};
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 'none';
  color: ${token('color.text', colors.N400)};
  background-color: ${token('color.background.neutral.subtle', colors.N0)};
  border-radius: ${token('border.radius', '3px')};
`;

export const footer = css`
  z-index: ${akEditorUnitZIndex};
  font-size: ${relativeFontSizeToBase16(14)};
  line-height: ${token('space.250', '20px')};
  color: ${token('color.text.subtlest', colors.N300)};
  padding: ${token('space.300', '24px')};
  text-align: right;
  box-shadow: 'none';
`;

export const contentWrapper = css`
  padding: ${token('space.250', '20px')} ${token('space.500', '40px')};
  border-bottom-right-radius: ${token('border.radius', '3px')};
  overflow: auto;
  position: relative;
  color: ${token('color.text.subtle', colors.N400)};
  background-color: ${token('color.background.neutral.subtle', colors.N0)};
`;

export const line = css`
  background: ${token('color.background.neutral.subtle', '#fff')};
  content: '';
  display: block;
  height: ${token('space.025', '2px')};
  left: 0;
  position: absolute;
  top: 0;
  right: 0;
  width: 100%;
  min-width: 604px;
`;

export const content = css`
  min-width: 524px;
  width: 100%;
  position: relative;
  display: flex;
  justify-content: space-between;
`;

export const column = {
  width: '44%',
  '& > ul': {
    padding: 0,
  },
};

export const row = css`
  margin: ${token('space.250', '20px')} 0;
  display: flex;
  justify-content: space-between;
`;

export const dialogHeader = {
  '&': {
    fontSize: relativeFontSizeToBase16(24),
    fontWeight: 400,
    color: token('color.text.subtle', N400),
    letterSpacing: 'normal',
    lineHeight: 1.42857142857143,
  },
};
export const title = {
  '&': {
    fontSize: relativeFontSizeToBase16(18),
    fontWeight: 400,
    color: token('color.text.subtle', N400),
    letterSpacing: 'normal',
    lineHeight: 1.42857142857143,
  },
};

export const codeSm = css`
  background-color: ${token('color.background.neutral', colors.N20)};
  border-radius: ${token('border.radius', '3px')};
  width: ${token('space.300', '24px')};
  display: inline-block;
  height: ${token('space.300', '24px')};
  line-height: 24px;
  text-align: center;
`;

export const codeMd = css`
  background-color: ${token('color.background.neutral', colors.N20)};
  border-radius: ${token('border.radius', '3px')};
  display: inline-block;
  height: ${token('space.300', '24px')};
  line-height: 24px;
  width: 50px;
  text-align: center;
`;

export const codeLg = css`
  background-color: ${token('color.background.neutral', colors.N20)};
  border-radius: ${token('border.radius', '3px')};
  display: inline-block;
  height: ${token('space.300', '24px')};
  line-height: ${token('space.300', '24px')};
  padding: 0 ${token('space.150', '12px')};
  text-align: center;
`;

export const shortcutsArray = css`
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  gap: ${token('space.150', '12px')};
`;

export const componentFromKeymapWrapperStyles = css`
  flex-shrink: 0;
`;
