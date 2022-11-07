import { css } from '@emotion/react';
import { borderRadius } from '@atlaskit/theme/constants';
import * as colors from '@atlaskit/theme/colors';
import {
  akEditorUnitZIndex,
  relativeFontSizeToBase16,
} from '@atlaskit/editor-shared-styles';
import { token } from '@atlaskit/tokens';
import { N400 } from '@atlaskit/theme/colors';

export const header = css`
  z-index: ${akEditorUnitZIndex};
  min-height: 24px;
  padding: 20px 40px;
  font-size: ${relativeFontSizeToBase16(24)};
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 'none';
  color: ${token('color.text', colors.N400)};
  background-color: ${token('color.background.neutral.subtle', colors.N0)};
  border-radius: ${borderRadius()}px;
`;

export const footer = css`
  z-index: ${akEditorUnitZIndex};
  font-size: ${relativeFontSizeToBase16(14)};
  line-height: 20px;
  color: ${token('color.text.subtlest', colors.N300)};
  padding: 24px;
  text-align: right;
  box-shadow: 'none';
`;

export const contentWrapper = css`
  padding: 20px 44px;
  border-bottom-right-radius: ${borderRadius()}px;
  overflow: auto;
  position: relative;
  color: ${token('color.text.subtle', colors.N400)};
  background-color: ${token('color.background.neutral.subtle', colors.N0)};
`;

export const line = css`
  background: ${token('color.background.neutral.subtle', '#fff')};
  content: '';
  display: block;
  height: 2px;
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
  margin: 20px 0;
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
  border-radius: ${borderRadius()}px;
  width: 24px;
  display: inline-block;
  height: 24px;
  line-height: 24px;
  text-align: center;
`;

export const codeMd = css`
  background-color: ${token('color.background.neutral', colors.N20)};
  border-radius: ${borderRadius()}px;
  display: inline-block;
  height: 24px;
  line-height: 24px;
  width: 50px;
  text-align: center;
`;

export const codeLg = css`
  background-color: ${token('color.background.neutral', colors.N20)};
  border-radius: ${borderRadius()}px;
  display: inline-block;
  height: 24px;
  line-height: 24px;
  padding: 0 10px;
  text-align: center;
`;
