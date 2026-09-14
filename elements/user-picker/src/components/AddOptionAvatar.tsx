/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import EmailIcon from '@atlaskit/icon/core/email';
import { token } from '@atlaskit/tokens';
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';
import React from 'react';

const getEmailAvatarWrapperStyle = (isLozenge?: boolean, isPendingAction?: boolean) => {
	const padding = isLozenge ? `${token('space.0')}` : `${token('space.050')}`;
	const backgroundColor = isPendingAction
		? token('color.background.warning')
		: token('color.background.neutral');
	return css({
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
		padding,
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
		backgroundColor,
		borderRadius: token('radius.full'),
		display: 'flex',
		alignItems: 'center',
		marginLeft: token('space.025'),
	});
};

export type AddOptionAvatarProps = {
	isLozenge?: boolean;
	isPendingAction?: boolean;
	label?: string;
};

export const AddOptionAvatar: React.FunctionComponent<AddOptionAvatarProps> = ({
	isLozenge,
	label,
	isPendingAction,
}) => {
	return (
		// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766
		<div css={getEmailAvatarWrapperStyle(isLozenge, isPendingAction)}>
			<EmailIcon
				testId="add-option-avatar-email-icon"
				label={label || ''}
				color={isPendingAction ? token('color.text.warning') : token('color.text.subtle')}
			/>
		</div>
	);
};
