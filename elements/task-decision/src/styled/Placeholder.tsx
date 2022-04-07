import styled from 'styled-components';
// @ts-ignore: unused variable
// prettier-ignore
import { HTMLAttributes, ClassAttributes, ComponentClass } from 'react';
import { N100 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

export type PlaceholderProps = {
  offset: number;
};

export const Placeholder: ComponentClass<
  HTMLAttributes<{}> & PlaceholderProps
> = styled.span`
  margin: ${(props: PlaceholderProps) => `0 0 0 ${props.offset}px;`};
  position: absolute;
  color: ${token('color.text.subtlest', N100)};
  pointer-events: none;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  max-width: calc(100% - 50px);
`;
