import styled from 'styled-components';
// @ts-ignore: unused variable
// prettier-ignore
import { HTMLAttributes, ClassAttributes, ComponentClass } from 'react';
import { N80 } from '@atlaskit/theme/colors';

export type PlaceholderProps = {
  offset: number;
};

export const Placeholder: ComponentClass<
  HTMLAttributes<{}> & PlaceholderProps
> = styled.span`
  margin: ${(props: PlaceholderProps) => `0 0 0 ${props.offset}px;`}
  position: absolute;
  color: ${N80};
  pointer-events: none;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  max-width: calc(100% - 50px);
`;
