/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import { cssMap, cx, jsx } from '@compiled/react';

import { Pressable } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';
import VisuallyHidden from '@atlaskit/visually-hidden';

import type { DotsAppearance } from './types';

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
		border: `${token('border.width')} solid ${token('color.border.bold')}`,
	},
	help: {
		border: `${token('border.width')} solid ${token('color.border.bold')}`,
	},
	inverted: {
		border: `${token('border.width')} solid ${token('color.border.inverse')}`,
	},
	primary: {
		border: `${token('border.width')} solid ${token('color.border.bold')}`,
	},
});
const buttonStyle = cssMap({
	root: {
		paddingBlockStart: token('space.0'),
		paddingInlineEnd: token('space.0'),
		paddingBlockEnd: token('space.0'),
		paddingInlineStart: token('space.0'),
		cursor: 'pointer',
		outline: 0,
	},
});
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

type ButtonIndicatorProps = {
	panelId: string;
	tabId: string;
	appearance: DotsAppearance;
	isSelected: boolean;
	testId?: string;
	onClick(e: React.MouseEvent<HTMLButtonElement>): void;
};

// TODO: Fill in the component {description} and ensure links point to the correct {packageName} location.
// Remove links that the component does not have (such as usage). If there are no links remove them all.
/**
 * __Button indicator__
 *
 * A button indicator {description}.
 *
 * - [Examples](https://atlassian.design/components/{packageName}/examples)
 * - [Code](https://atlassian.design/components/{packageName}/code)
 * - [Usage](https://atlassian.design/components/{packageName}/usage)
 */
export const ButtonIndicator: ({
	// TODO: Fill in the component {description} and ensure links point to the correct {packageName} location.
	// Remove links that the component does not have (such as usage). If there are no links remove them all.
	/**
	 * __Button indicator__
	 *
	 * A button indicator {description}.
	 *
	 * - [Examples](https://atlassian.design/components/{packageName}/examples)
	 * - [Code](https://atlassian.design/components/{packageName}/code)
	 * - [Usage](https://atlassian.design/components/{packageName}/usage)
	 */
	appearance,
	panelId,
	tabId,
	isSelected,
	onClick,
	testId,
}: ButtonIndicatorProps) => JSX.Element = ({
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
