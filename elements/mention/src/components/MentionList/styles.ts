import styled from '@emotion/styled';
import { token } from '@atlaskit/tokens';
import {
  mentionListWidth,
  noDialogContainerBorderColor,
  noDialogContainerBorderRadius,
  noDialogContainerBoxShadow,
} from '../../shared-styles';

export interface MentionListStyleProps {
  empty?: boolean;
}

export const MentionListStyle = styled.div<MentionListStyleProps>`
  display: ${(props) => (props.empty ? 'none' : 'block')};

  /* list style */
  width: ${mentionListWidth};
  color: ${token('color.text.subtle', '#333')};

  border: 1px solid ${noDialogContainerBorderColor};
  border-radius: ${noDialogContainerBorderRadius};
  box-shadow: ${noDialogContainerBoxShadow};
`;
