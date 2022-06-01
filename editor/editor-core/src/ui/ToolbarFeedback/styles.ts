import { css } from '@emotion/react';
import { borderRadius } from '@atlaskit/theme/constants';
import { N60A, N400, P400 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';
import { relativeFontSizeToBase16 } from '@atlaskit/editor-shared-styles';

export const buttonContent = css`
  display: flex;
  height: 24px;
  line-height: 24px;
  min-width: 70px;
`;

export const wrapper = css`
  display: flex;
  margin-right: 0;
`;

export const confirmationPopup = css`
  background: ${token('elevation.surface.overlay', '#fff')};
  border-radius: ${borderRadius()}px;
  box-shadow: ${token(
    'elevation.shadow.overlay',
    `0 4px 8px -2px ${N60A}, 0 0 1px ${N60A}`,
  )};
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  overflow: auto;
  max-height: none;
  height: 410px;
  width: 280px;
`;

export const confirmationText = css`
  font-size: ${relativeFontSizeToBase16(14)};
  word-spacing: 4px;
  line-height: 22px;
  color: ${token('color.text.subtle', N400)};
  margin-top: 30px;
  padding: 20px;
  & > div {
    width: 240px;
  }
  & > div:first-of-type {
    margin-bottom: 12px;
  }
  & > div:nth-of-type(2) {
    margin-bottom: 20px;
  }
`;

export const confirmationHeader = css`
  background-color: ${token('color.background.discovery.bold', P400)};
  height: 100px;
  width: 100%;
  display: inline-block;
`;

export const confirmationImg = css`
  width: 100px;
  display: block;
  margin: 25px auto 0 auto;
`;
