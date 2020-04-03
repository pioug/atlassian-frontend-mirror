import styled from 'styled-components';
import { TruncateStyleProps, truncateStyle, cellStyle } from './constants';

export const TableBodyCell = styled.td<TruncateStyleProps>`
  ${props => truncateStyle(props)} ${cellStyle};
`;
