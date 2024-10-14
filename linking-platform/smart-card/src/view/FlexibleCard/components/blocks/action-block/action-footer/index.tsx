import ErrorIcon from '@atlaskit/icon/utility/migration/error';
import { Box, Inline, xcss } from '@atlaskit/primitives';
import { token } from '@atlaskit/tokens';
import React from 'react';
import { type ActionMessageAppearance } from '../../../actions/action/types';
import MotionWrapper from '../../../common/motion-wrapper';
import { type ActionFooterProps } from './types';

const containerStyles = xcss({
	all: 'unset',
	borderRadius: 'border.radius',
	margin: 'space.100',
	marginBottom: 'space.0',
	lineHeight: '20px',
	padding: 'space.075',
	paddingInline: 'space.100',
	width: '100%',
	':empty': {
		display: 'none',
	},
});

const errorStyles = xcss({
	backgroundColor: 'color.background.danger',
});

const errorContentStyles = xcss({
	paddingInlineStart: 'space.025',
});

const titleStyles = xcss({
	color: 'color.text.subtle',
	fontSize: '12px',
	fontStyle: 'normal',
	fontWeight: '400',
	lineHeight: '16px',
});

const getIcon = (appearance?: ActionMessageAppearance) => {
	switch (appearance) {
		case 'error':
			return (
				<ErrorIcon
					color={token('color.icon.danger', '#C9372C')}
					spacing="compact"
					label="Error"
					LEGACY_size="small"
					testId="action-error-icon"
					LEGACY_margin={`0 ${token('space.negative.025')}`}
				/>
			);
		default:
			return null;
	}
};

export const ActionFooter = ({ message, testId }: ActionFooterProps) => {
	if (!message) {
		return null;
	}

	return (
		<Box
			testId={`${testId}-footer`}
			xcss={[containerStyles, message.appearance === 'error' && errorStyles]}
		>
			<MotionWrapper isFadeIn={true} show={true} showTransition={true}>
				<Inline alignBlock="start" grow="fill" space="space.075" xcss={errorContentStyles}>
					{message.icon || getIcon(message.appearance)}
					<Box xcss={titleStyles}>{message.title}</Box>
				</Inline>
			</MotionWrapper>
		</Box>
	);
};
