import styled from 'styled-components';
import { HTMLAttributes, ComponentClass } from 'react';
import { gridSize } from '@atlaskit/theme/constants';

export const AlignmentWrapper: ComponentClass<HTMLAttributes<{}>> = styled.div`
  padding: 0 ${gridSize()}px;
  display: flex;
  flex-wrap: wrap;
`;
