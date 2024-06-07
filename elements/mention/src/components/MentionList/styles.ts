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

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled -- To migrate as part of go/ui-styling-standard
export const MentionListStyle = styled.div<MentionListStyleProps>((props) => ({
	display: props.empty ? 'none' : 'block',
	/* list style */
	width: mentionListWidth,
	color: token('color.text.subtle', '#333'),
	border: `1px solid ${noDialogContainerBorderColor}`,
	borderRadius: noDialogContainerBorderRadius,
	boxShadow: noDialogContainerBoxShadow,
}));
