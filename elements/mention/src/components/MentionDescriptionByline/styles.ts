import styled from 'styled-components';
// @ts-ignore: unused variable
// prettier-ignore
import { HTMLAttributes, ClassAttributes, ComponentClass } from 'react';
import { N100 } from '@atlaskit/theme/colors';

export const DescriptionBylineStyle: ComponentClass<HTMLAttributes<{}>> = styled.span`
  color: ${N100};
  font-size: 12px;

  margin-top: 2px;

  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;
