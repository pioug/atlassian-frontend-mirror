/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import { cssMap, cx, jsx } from '@compiled/react';

import { Box, Pressable } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';
import VisuallyHidden from '@atlaskit/visually-hidden';

type DotsAppearance = 'default' | 'help' | 'inverted' | 'primary';

const commonStyles: any = cssMap({
	common: {
		width: `var(--ds-dots-size)`,
		height: `var(--ds-dots-size)`,
		position: 'relative',
		borderRadius: token('radius.full'),

		'&::before': {
			display: 'block',
			width: `calc(var(--ds-dots-size) + var(--ds-dots-margin))`,
			height: `calc(var(--ds-dots-size) + var(--ds-dots-margin))`,
			position: 'absolute',
			content: '""',
			insetBlockStart: `calc(-1 * var(--ds-dots-margin) / 2)`,
			insetInlineStart: `calc(-1 * var(--ds-dots-margin) / 2)`,
		},
	},
});

const colorBorderMap = cssMap({
	default: {
		border: `${token('border.width', '1px')} solid ${token('color.border.bold')}`,
	},
	help: {
		border: `${token('border.width', '1px')} solid ${token('color.border.bold')}`,
	},
	inverted: {
		border: `${token('border.width', '1px')} solid ${token('color.border.inverse')}`,
	},
	primary: {
		border: `${token('border.width', '1px')} solid ${token('color.border.bold')}`,
	},
});

const buttonStyle = cssMap({
	root: {
		paddingTop: token('space.0'),
		paddingRight: token('space.0'),
		paddingBottom: token('space.0'),
		paddingLeft: token('space.0'),
		cursor: 'pointer',
		outline: 0,
	},
});

type CommonProps = {
	appearance: DotsAppearance;
	isSelected: boolean;
	testId?: string;
};

const backgroundColor = (isSelected: boolean) => {
	if (!isSelected) {
		return {
			default: token('elevation.surface'),
			help: token('elevation.surface'),
			inverted: token('color.background.neutral.subtle'),
			primary: token('elevation.surface'),
		} as const;
	}
	return {
		default: token('color.icon'),
		help: token('color.icon.discovery'),
		inverted: token('color.icon.inverse'),
		primary: token('color.icon.brand'),
	} as const;
};

/**
 * __Presentational indicator__
 *
 * A presentational indicator with no interactivity
 */
export const PresentationalIndicator: ({ appearance, isSelected, testId }: CommonProps) => JSX.Element = ({ appearance, isSelected, testId }: CommonProps) => {
	return (
		<Box
			testId={testId}
			// here we set it dynamic because that backgroundColor and xcss don't support the colors we need here eg. token('color.icon')
			style={{ backgroundColor: backgroundColor(isSelected)[appearance] }}
			xcss={cx(commonStyles.common, colorBorderMap[appearance])}
		/>
	);
};

type ButtonIndicatorProps = {
	panelId: string;
	tabId: string;
	onClick(e: React.MouseEvent<HTMLButtonElement>): void;
} & CommonProps;

/**
 * __Button indicator__
 *
 * An interactive indicator.
 */
export const ButtonIndicator: ({ appearance, panelId, tabId, isSelected, onClick, testId, }: ButtonIndicatorProps) => JSX.Element = ({
	appearance,
	panelId,
	tabId,
	isSelected,
	onClick,
	testId,
}: ButtonIndicatorProps) => {
	return (
		<Pressable
			role="tab"
			style={{ backgroundColor: backgroundColor(isSelected)[appearance] }}
			xcss={cx(commonStyles.common, buttonStyle.root, colorBorderMap[appearance])}
			aria-controls={panelId}
			aria-selected={isSelected}
			id={tabId}
			onClick={onClick}
			tabIndex={isSelected ? -1 : undefined}
			testId={testId}
		>
			<VisuallyHidden>{tabId}</VisuallyHidden>
		</Pressable>
	);
};
