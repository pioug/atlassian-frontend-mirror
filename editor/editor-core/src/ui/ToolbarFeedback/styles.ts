import styled from 'styled-components';
import { HTMLAttributes, ImgHTMLAttributes, ComponentClass } from 'react';
import { gridSize, borderRadius } from '@atlaskit/theme/constants';
import { N60A, N400, P400 } from '@atlaskit/theme/colors';
import { relativeFontSizeToBase16 } from '@atlaskit/editor-shared-styles';

export const ButtonContent: ComponentClass<HTMLAttributes<{}>> = styled.span`
  display: flex;
  height: 24px;
  line-height: 24px;
  min-width: 70px;
`;

export const Wrapper: ComponentClass<HTMLAttributes<{}>> = styled.span`
  display: flex;
  margin-right: ${({ width }: { width?: 'small' | 'large' }) =>
    !width || width === 'large' ? 0 : gridSize()}px;
`;

export const ConfirmationPopup: ComponentClass<HTMLAttributes<{}>> = styled.div`
  background: #fff;
  border-radius: ${borderRadius()}px;
  box-shadow: 0 4px 8px -2px ${N60A}, 0 0 1px ${N60A};
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  overflow: auto;
  max-height: none;
  height: 410px;
  width: 280px;
`;

export const ConfirmationText: ComponentClass<HTMLAttributes<{}>> = styled.div`
  font-size: ${relativeFontSizeToBase16(14)};
  word-spacing: 4px;
  line-height: 22px;
  color: ${N400};
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

export const ConfirmationHeader: ComponentClass<HTMLAttributes<{}>> = styled.div`
  background-color: ${P400};
  height: 100px;
  width: 100%;
  display: inline-block;
`;

export const ConfirmationImg: ComponentClass<ImgHTMLAttributes<{}>> = styled.img`
  width: 100px;
  display: block;
  margin: 25px auto 0 auto;
`;
