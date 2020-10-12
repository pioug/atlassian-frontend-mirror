import styled from 'styled-components';
// @ts-ignore: unused variable
// prettier-ignore
import { HTMLAttributes, ClassAttributes, ComponentClass } from 'react';

import {
  mentionListWidth,
  noDialogContainerBorderColor,
  noDialogContainerBorderRadius,
  noDialogContainerBoxShadow,
} from '../../shared-styles';

export interface MentionListStyleProps {
  empty?: boolean;
}

export const MentionListStyle: ComponentClass<
  HTMLAttributes<{}> & MentionListStyleProps
> = styled.div`
  display: ${(props: MentionListStyleProps) =>
    props.empty ? 'none' : 'block'};

  /* list style */
  width: ${mentionListWidth};
  color: #333;

  border: 1px solid ${noDialogContainerBorderColor};
  border-radius: ${noDialogContainerBorderRadius};
  box-shadow: ${noDialogContainerBoxShadow};
`;
