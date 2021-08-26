import { ComponentClass } from 'react';
import styled from 'styled-components';
import { borderRadius } from '@atlaskit/theme/constants';
import * as colors from '@atlaskit/theme/colors';
import {
  akEditorUnitZIndex,
  relativeFontSizeToBase16,
} from '@atlaskit/editor-shared-styles';

export const Header: any = styled.div`
  z-index: ${akEditorUnitZIndex};
  min-height: 24px;
  padding: 20px 40px;
  font-size: ${relativeFontSizeToBase16(24)};
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 'none';
  color: ${colors.N400};
  background-color: ${colors.N0};
  border-radius: ${borderRadius()}px;
`;

export const Footer: any = styled.div`
  z-index: ${akEditorUnitZIndex};
  font-size: ${relativeFontSizeToBase16(14)};
  line-height: 20px;
  color: ${colors.N300};
  padding: 24px;
  text-align: right;
  box-shadow: 'none';
`;

export const ContentWrapper: ComponentClass = styled.div`
  padding: 18px 20px;
  border-bottom-right-radius: ${borderRadius()}px;
  overflow: auto;
  position: relative;
  color: ${colors.N400};
  background-color: ${colors.N0};
`;

export const Line: ComponentClass = styled.div`
  background: #fff;
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

export const Content: ComponentClass = styled.div`
  min-width: 524px;
  width: 100%;
  position: relative;
  display: flex;
  justify-content: space-between;
`;

export const ColumnLeft: ComponentClass = styled.div`
  width: 44%;
`;

export const ColumnRight: ComponentClass = styled.div`
  width: 44%;
`;

export const Row: ComponentClass = styled.div`
  margin: 20px 0;
  display: flex;
  justify-content: space-between;
`;

export const Title: ComponentClass = styled.div`
  font-size: ${relativeFontSizeToBase16(18)};
  font-weight: 400;
`;

export const CodeSm: ComponentClass = styled.span`
  background-color: ${colors.N20};
  border-radius: ${borderRadius()}px;
  width: 24px;
  display: inline-block;
  height: 24px;
  line-height: 24px;
  text-align: center;
`;

export const CodeMd: ComponentClass = styled.span`
  background-color: ${colors.N20};
  border-radius: ${borderRadius()}px;
  display: inline-block;
  height: 24px;
  line-height: 24px;
  width: 50px;
  text-align: center;
`;

export const CodeLg: ComponentClass = styled.span`
  background-color: ${colors.N20};
  border-radius: ${borderRadius()}px;
  display: inline-block;
  height: 24px;
  line-height: 24px;
  padding: 0 10px;
  text-align: center;
`;
