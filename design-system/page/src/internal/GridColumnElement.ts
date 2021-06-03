import styled from 'styled-components';

import { GridColumnProps, ThemeProps } from '../types';

import { spacing } from './vars';

interface Props {
  medium?: number;
  theme: ThemeProps;
}

const getColumnRatio = (props: Props) => {
  if (props.medium === props.theme.columns) {
    return '100%';
  }
  return `99.9999% / ${props.theme.columns} * ${props.medium}`;
};
const getColumnWidth = (props: any) =>
  props.medium > 0
    ? `calc(${getColumnRatio(props)} - ${spacing[props.theme.spacing]}px)`
    : 'auto';
const availableColumns = (props: Props) => props.theme.columns;
const specifiedColumns = (props: Props) =>
  props.medium ? props.medium : availableColumns(props);
const columns = (props: Props) =>
  Math.min(availableColumns(props), specifiedColumns(props));
const gridSpacing = (props: Props) => spacing[props.theme.spacing];
const getMaxWidthColumnRatio = (props: Props) => {
  if (columns(props) >= availableColumns(props)) {
    return '100%';
  }
  return `99.9999% / ${availableColumns(props)} * ${columns(props)}`;
};

// Unable to use the flexbox shorthand rules because Styled Components doesn't
// handle them correctly for IE11.
// Also IE11 and Edge both have rounding issues for flexbox which is why a width of
// 99.9999% is used. Using 100% here causes columns to wrap prematurely.
const GridColumn = styled.div<GridColumnProps>`
  flex-grow: 1;
  flex-shrink: 0;
  flex-basis: ${getColumnWidth};
  margin: 0 ${(props) => spacing[props.theme.spacing] / 2}px;
  max-width: calc(${getMaxWidthColumnRatio} - ${gridSpacing}px);
  min-width: calc(99.9999% / ${availableColumns} - ${gridSpacing}px);
  word-wrap: break-word;
`;

export default GridColumn;
export { getColumnWidth };
