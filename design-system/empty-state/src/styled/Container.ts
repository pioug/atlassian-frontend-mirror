import styled from 'styled-components';
import { gridSize } from '@atlaskit/theme/constants';
import { Sizes } from '../';

const verticalMarginSize = gridSize() * 6;

const columnWidth = gridSize() * 8;
const gutter = gridSize() * 2;

const wideContainerWidth = columnWidth * 6 + gutter * 5;
const narrowContainerWidth = columnWidth * 4 + gutter * 3;

const Container = styled.div<{ size: Sizes }>`
  margin: ${verticalMarginSize}px auto;
  text-align: center;
  /* Use max-width so the component can shrink on smaller viewports. */
  max-width: ${props =>
    props.size === 'narrow' ? narrowContainerWidth : wideContainerWidth}px;
`;

export default Container;
