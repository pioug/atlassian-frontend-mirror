/** @jsx jsx */

import styled from 'styled-components';
import * as colors from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

// eslint-disable-next-line @atlaskit/design-system/no-styled-tagged-template-expression, @atlaskit/ui-styling-standard/no-styled -- To migrate as part of go/ui-styling-standard
export const HelpContentButtonContainer = styled.a`
	display: block;
	cursor: pointer;
	width: calc(100% - ${token('space.200', '16px')});
	color: ${token('color.text.subtle', colors.N600)};
	padding: ${token('space.100', '8px')};
	border-radius: 3px;

	&:hover,
	&:focus,
	&:visited,
	&:active {
		text-decoration: none;
		outline: none;
		outline-offset: none;
		color: ${token('color.text.subtle', colors.N600)};
	}

	&:focus {
		box-shadow: ${token('color.border.focused', colors.B100)} 0 0 0 2px inset;
	}

	&:hover {
		background-color: ${token('color.background.neutral.subtle.hovered', colors.N30)};
	}

	&:active {
		background-color: ${token('color.background.neutral.subtle.pressed', colors.B50)};
	}
`;

// eslint-disable-next-line @atlaskit/design-system/no-styled-tagged-template-expression, @atlaskit/ui-styling-standard/no-styled -- To migrate as part of go/ui-styling-standard
export const HelpContentButtonIcon = styled.div`
	display: inline-block;
	vertical-align: middle;
	width: 20px;
	height: 20px;
	border-radius: 4px;
	position: relative;

	& span {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
	}
`;

// eslint-disable-next-line @atlaskit/design-system/no-styled-tagged-template-expression, @atlaskit/ui-styling-standard/no-styled -- To migrate as part of go/ui-styling-standard
export const HelpContentButtonText = styled.div`
	width: calc(100% - 20px);
	display: inline-block;
	vertical-align: middle;
	padding: 0 ${token('space.100', '8px')};
	box-sizing: border-box;
`;

// eslint-disable-next-line @atlaskit/design-system/no-styled-tagged-template-expression, @atlaskit/ui-styling-standard/no-styled -- To migrate as part of go/ui-styling-standard
export const HelpContentButtonExternalLinkIcon = styled.div`
	display: inline-block;
	vertical-align: middle;
	padding-left: ${token('space.050', '4px')};
`;

// eslint-disable-next-line @atlaskit/design-system/no-styled-tagged-template-expression, @atlaskit/ui-styling-standard/no-styled -- To migrate as part of go/ui-styling-standard
export const HelpContentButtonExternalNotificationIcon = styled.div`
	display: inline-block;
	vertical-align: middle;
	margin-top: ${token('space.negative.050', '-4px')};
	padding-left: ${token('space.050', '4px')};
`;
