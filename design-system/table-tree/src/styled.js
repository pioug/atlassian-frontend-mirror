import styled, { css } from 'styled-components';

import { N30, N300, N800 } from '@atlaskit/theme/colors';

// Future-proofing: Styled Component 2.x no longer tolerate unitless values for CSS length.
// See:
// https://github.com/styled-components/css-to-react-native/issues/20
// https://github.com/styled-components/polished/issues/234
function defaultToPx(length) {
  const number = +length;
  if (number === 0) {
    return 0;
  }
  if (Number.isNaN(number)) {
    return length;
  }
  return `${number}px`;
}

export const iconColor = N800;

export const TreeRowContainer = styled.div`
  border-bottom: 1px solid ${N30};
  display: flex;
`;

export const HeadersContainer = styled.div`
  border-bottom: solid 2px #dfe1e6;
  display: flex;
`;

const indentWidth = 25;

const commonChevronContainer = css`
  display: flex;
  align-items: center;
  position: absolute;
  top: 7px;
  margin-left: ${defaultToPx(-indentWidth)};
`;

export const ChevronContainer = styled.span`
  ${commonChevronContainer};
`;

export const ChevronIconContainer = styled.span`
  position: relative;
  top: 1px;
`;

export const LoaderItemContainer = styled.span`
  ${commonChevronContainer} padding-top: 5px;
  width: 100%;

  ${(props) =>
    props.isRoot &&
    css`
      padding-left: 50%;
    `};
`;

const commonCell = css`
  display: flex;
  align-items: flex-start;
  position: relative;
  box-sizing: border-box;
  min-height: 40px;
  padding: 10px ${defaultToPx(indentWidth)};
  color: ${N800};
  line-height: 20px;
  ${(props) =>
    props.width &&
    css`
      width: ${defaultToPx(props.width)};
    `};
`;

export const OverflowContainer = styled.span`
  ${(props) =>
    props.singleLine &&
    css`
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    `};
`;

export const Cell = styled.div`
  ${commonCell} ${(props) =>
    props.indentLevel &&
    css`
      padding-left: ${defaultToPx(indentWidth * props.indentLevel)};
    `};
`;

export const Header = styled.div`
  ${commonCell} font-weight: bold;
  font-size: 12px;
  line-height: 1.67;
  letter-spacing: -0.1px;
  color: ${N300};
`;

export const TableTreeContainer = styled.div``;
