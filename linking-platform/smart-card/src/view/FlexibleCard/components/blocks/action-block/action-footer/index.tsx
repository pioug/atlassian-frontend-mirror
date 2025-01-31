/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import { css, cssMap, jsx } from '@compiled/react';

import ErrorIcon from '@atlaskit/icon/utility/migration/error';
import { fg } from '@atlaskit/platform-feature-flags';
import { Box, Inline } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

import { type ActionMessageAppearance } from '../../../actions/action/types';
import MotionWrapper from '../../../common/motion-wrapper';

import { ActionFooterOld } from './ActionFooterOld';
import { type ActionFooterProps } from './types';

const containerStyles = css({
	all: 'unset',
	borderRadius: token('border.radius'),
	margin: token('space.100'),
	marginBottom: token('space.0'),
	// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
	lineHeight: '20px',
	padding: token('space.075'),
	paddingInline: token('space.100'),
	width: '100%',
	'&:empty': {
		display: 'none',
	},
});

const errorStyles = css({
	backgroundColor: token('color.background.danger'),
});

const styles = cssMap({
	errorContentStyles: {
		paddingInlineStart: token('space.025'),
	},
	titleStyles: {
		color: token('color.text.subtle'),
		font: token('font.body.UNSAFE_small'),
	},
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

const ActionFooterNew = ({ message, testId }: ActionFooterProps) => {
	if (!message) {
		return null;
	}

	return (
		// Converted from Box to div due to lineHeight css
		<div
			data-testId={`${testId}-footer`}
			css={[containerStyles, message.appearance === 'error' && errorStyles]}
		>
			<MotionWrapper isFadeIn={true} show={true} showTransition={true}>
				<Inline alignBlock="start" grow="fill" space="space.075" xcss={styles.errorContentStyles}>
					{message.icon || getIcon(message.appearance)}
					<Box xcss={styles.titleStyles}>{message.title}</Box>
				</Inline>
			</MotionWrapper>
		</div>
	);
};

export const ActionFooter = (props: ActionFooterProps) => {
	if (fg('bandicoots-compiled-migration-smartcard')) {
		return <ActionFooterNew {...props} />;
	}
	return <ActionFooterOld {...props} />;
};
