import styled from 'styled-components';
import { HTMLAttributes, ComponentClass } from 'react';
import { gridSize } from '@atlaskit/theme';

export const ColorPaletteWrapper: ComponentClass<HTMLAttributes<{}>> = styled.div`
  padding: 0 ${gridSize()}px;
  /* Firefox bug fix: https://product-fabric.atlassian.net/browse/ED-1789 */
  display: flex;
  flex-wrap: wrap;
`;
