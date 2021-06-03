import styled from 'styled-components';

import { cellStyle, truncateStyle, TruncateStyleProps } from './constants';

export const TableBodyCell = styled.td<TruncateStyleProps>`
  ${(props) => truncateStyle(props)} ${cellStyle};
`;
