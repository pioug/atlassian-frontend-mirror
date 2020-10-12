import styled from 'styled-components';
// @ts-ignore: unused variable
// prettier-ignore
import { HTMLAttributes, ClassAttributes, ComponentClass } from 'react';
import { themed } from '@atlaskit/theme/components';
import { gridSize } from '@atlaskit/theme/constants';
import { N100, G300, G200 } from '@atlaskit/theme/colors';

export interface EditorIconWrapperProps {
  showPlaceholder?: boolean;
}

export const EditorIconWrapper: ComponentClass<
  HTMLAttributes<{}> & EditorIconWrapperProps
> = styled.span`
  flex: 0 0 16px;
  height: 16px;
  width: 16px;
  color: ${(props: EditorIconWrapperProps) =>
    props.showPlaceholder ? N100 : themed({ light: G300, dark: G200 })};
  margin: 4px ${gridSize() * 1.5}px 0 0;

  > span {
    margin: -8px;
  }
`;
