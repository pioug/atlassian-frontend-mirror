import styled from '@emotion/styled';
import { token } from '@atlaskit/tokens';
import { N100 } from '@atlaskit/theme/colors';

import {
  mentionListWidth,
  noDialogContainerBorderColor,
  noDialogContainerBorderRadius,
  noDialogContainerBoxShadow,
} from '../../shared-styles';

export interface MentionPickerStyleProps {
  visible?: boolean | string;
}

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled -- To migrate as part of go/ui-styling-standard
export const MentionPickerStyle = styled.div<MentionPickerStyleProps>`
  display: ${(props) => (props.visible ? 'block' : 'none')};
`;

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled -- To migrate as part of go/ui-styling-standard
export const MentionPickerInfoStyle = styled.div`
  background: ${token('elevation.surface', '#fff')};
  color: ${token('color.text.subtlest', N100)};
  border: 1px solid ${noDialogContainerBorderColor};
  border-radius: ${noDialogContainerBorderRadius};
  box-shadow: ${noDialogContainerBoxShadow};
  display: block;
  width: ${mentionListWidth};
  white-space: nowrap;

  & {
    p {
      margin: 0;
      overflow: hidden;
      padding: ${token('space.100', '8px')};
      text-overflow: ellipsis;
    }
  }
`;
