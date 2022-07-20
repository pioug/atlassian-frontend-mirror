import { css } from '@emotion/react';

export const avatarPickerViewWrapperStyles = css`
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  min-height: 339px;
`;

export const modalHeaderStyles = css`
  margin: 15px;
  font-weight: 500;
  font-size: 20px;
`;

export const croppingWrapperStyles = css`
  display: inline-block;
  user-select: none;

  * {
    user-select: none;
  }
`;

export const modalFooterButtonsStyles = css`
  text-align: right;
  width: 100%;

  button:first-child {
    margin-right: 3px;
  }
`;
