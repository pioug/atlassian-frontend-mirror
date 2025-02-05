/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { css, cssMap, jsx } from '@compiled/react';

import { fg } from '@atlaskit/platform-feature-flags';
import { token } from '@atlaskit/tokens';

import { SmartLinkSize } from '../../../../../../constants';

import ActionIconOld from './ActionIconOld';
import { type ActionIconProps } from './types';

const getIconWidth = (size?: SmartLinkSize) => {
	switch (size) {
		case SmartLinkSize.XLarge:
		case SmartLinkSize.Large:
			return '1.5rem';
		case SmartLinkSize.Medium:
		case SmartLinkSize.Small:
		default:
			return '1rem';
	}
};

const iconSizeStyleMap = cssMap({
	'1.5rem': {
		flex: '0 0 auto',
		height: '1.5rem',
		minHeight: '1.5rem',
		maxHeight: '1.5rem',
		width: '1.5rem',
		minWidth: '1.5rem',
		maxWidth: '1.5rem',
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'span, svg, img': {
			height: '1.5rem',
			minHeight: '1.5rem',
			maxHeight: '1.5rem',
			width: '1.5rem',
			minWidth: '1.5rem',
			maxWidth: '1.5rem',
		},
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		svg: {
			padding: 0,
		},
	},
	'1rem': {
		flex: '0 0 auto',
		height: '1rem',
		minHeight: '1rem',
		maxHeight: '1rem',
		width: '1rem',
		minWidth: '1rem',
		maxWidth: '1rem',
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'span, svg, img': {
			height: '1rem',
			minHeight: '1rem',
			maxHeight: '1rem',
			width: '1rem',
			minWidth: '1rem',
			maxWidth: '1rem',
		},
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		svg: {
			padding: 0,
		},
	},
	'20px': {
		flex: '0 0 auto',
		height: '20px',
		minHeight: '20px',
		maxHeight: '20px',
		width: '20px',
		minWidth: '20px',
		maxWidth: '20px',
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'span, svg, img': {
			height: '20px',
			minHeight: '20px',
			maxHeight: '20px',
			width: '20px',
			minWidth: '20px',
			maxWidth: '20px',
		},
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		svg: {
			padding: 0,
		},
	},
});

// TODO: Remove on fg cleanup: platform-linking-visual-refresh-v1
const stackItemIconStylesOld = css({
	display: 'inline-block',
	paddingTop: token('space.025'),
	paddingRight: token('space.025'),
	paddingBottom: token('space.025'),
	paddingLeft: token('space.025'),
});

const stackItemIconStylesCompiled = css({
	display: 'inline-block',
});

const stackItemIconStyles = css({
	display: 'inline-flex',
});

const iconStyleMap = cssMap({
	true: {
		color: token('color.text.disabled', '#6B778C'),
	},
	false: {
		color: token('color.icon', '#44546F'),
	},
});

const ActionIconNew = ({ size, testId, icon, isDisabled, asStackItemIcon }: ActionIconProps) => {
	if (!fg('platform-visual-refresh-icons')) {
		return (
			<span
				css={[
					iconStyleMap[isDisabled ? 'true' : 'false'],
					asStackItemIcon && stackItemIconStylesOld,
					asStackItemIcon && iconSizeStyleMap['20px'],
					!asStackItemIcon && iconSizeStyleMap[getIconWidth(size)],
				]}
				data-testid={`${testId}-icon`}
			>
				{icon}
			</span>
		);
	}

	return (
		<span
			css={[
				iconStyleMap[isDisabled ? 'true' : 'false'],
				fg('platform-linking-visual-refresh-v1')
					? stackItemIconStyles
					: stackItemIconStylesCompiled,
			]}
			data-testid={`${testId}-icon`}
		>
			{icon}
		</span>
	);
};

const ActionIcon = (props: ActionIconProps): JSX.Element => {
	return fg('bandicoots-compiled-migration-smartcard') ? (
		<ActionIconNew {...props} />
	) : (
		<ActionIconOld {...props} />
	);
};

export default ActionIcon;
