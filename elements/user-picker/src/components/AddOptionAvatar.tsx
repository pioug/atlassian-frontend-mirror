/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import EmailIcon from '@atlaskit/icon/core/migration/email';
import { N40, N500 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';
import React from 'react';

const getEmailAvatarWrapperStyle = (isLozenge?: boolean) => {
	const padding = isLozenge ? `${token('space.0', '0px')}` : `${token('space.050', '4px')}`;

	return css({
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
		padding: padding,
		backgroundColor: token('color.background.neutral', N40),
		borderRadius: '50%',
		display: 'flex',
		alignItems: 'center',
		marginLeft: token('space.025', '2px'),
	});
};

export type AddOptionAvatarProps = {
	label?: string;
	isLozenge?: boolean;
};

export const AddOptionAvatar: React.FunctionComponent<AddOptionAvatarProps> = ({
	isLozenge,
	label,
}) => {
	return (
		// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766
		<div css={getEmailAvatarWrapperStyle(isLozenge)}>
			<EmailIcon
				testId="add-option-avatar-email-icon"
				label={label || ''}
				LEGACY_size={isLozenge ? 'small' : 'medium'}
				LEGACY_margin="0 0 0 -2px"
				color={token('color.text.subtle', N500)}
			/>
		</div>
	);
};
