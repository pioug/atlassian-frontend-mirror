/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { isValidElement, type ReactNode } from 'react';

import { css, jsx } from '@compiled/react';
import { FormattedMessage } from 'react-intl';

import { cssMap } from '@atlaskit/css';
import { Box } from '@atlaskit/primitives/compiled/box';
import { Text } from '@atlaskit/primitives/compiled/text';
import { components } from '@atlaskit/react-select/components';
import type { MenuListComponentProps, OptionProps, OptionType } from '@atlaskit/select/types';
import { token } from '@atlaskit/tokens';

import { columnPickerMessages } from './messages';

export const SELECT_ITEMS_MAXIMUM_THRESHOLD = 200;

const messageStyles = css({
	color: token('color.text.subtle'),
	font: token('font.body.small'),
	fontWeight: token('font.weight.regular'),
});

const maximumLimitReachedMessageStyles = css({
	height: 'auto',
	paddingBlockEnd: token('space.050'),
	paddingBlockStart: token('space.050'),
	paddingInlineEnd: token('space.200'),
	paddingInlineStart: token('space.200'),
});

const separatorStyles = cssMap({
	selectedOptions: {
		borderBlockStartColor: token('color.border.bold'),
		borderBlockStartStyle: 'dashed',
		borderBlockStartWidth: token('border.width'),
		marginBlockEnd: token('space.100'),
		marginBlockStart: token('space.100'),
	},
});

const reorderHintStyles = cssMap({
	container: {
		paddingBlockEnd: token('space.150'),
		paddingBlockStart: token('space.0'),
		paddingInlineEnd: token('space.200'),
		paddingInlineStart: token('space.200'),
	},
});

const isSelectedOption = (child: ReactNode): boolean =>
	isValidElement<OptionProps<OptionType, true>>(child) && !!child.props.isSelected;

const withSelectedOptionsSeparator = (options: ReactNode[]): ReactNode[] => {
	const firstUnselectedIndex = options.findIndex((option) => !isSelectedOption(option));

	if (firstUnselectedIndex === 0) {
		return options;
	}

	const reorderHint = (
		<Box
			key="column-picker-reorder-hint"
			xcss={reorderHintStyles.container}
			testId="column-picker-reorder-hint"
		>
			<Text size="small">
				<FormattedMessage {...columnPickerMessages.reorderHint} />
			</Text>
		</Box>
	);

	if (firstUnselectedIndex === -1) {
		return [reorderHint, ...options];
	}

	return [
		reorderHint,
		...options.slice(0, firstUnselectedIndex),
		<Box
			key="column-picker-selected-options-separator"
			aria-hidden
			xcss={separatorStyles.selectedOptions}
			testId="column-picker-selected-options-separator"
		/>,
		...options.slice(firstUnselectedIndex),
	];
};

export const ConcatenatedMenuListWithSelectedSeparator = ({
	children,
	...props
}: MenuListComponentProps<OptionType, true>): JSX.Element => {
	if (!children || !Array.isArray(children)) {
		return <components.MenuList {...props}>{children}</components.MenuList>;
	}

	if (children.length <= SELECT_ITEMS_MAXIMUM_THRESHOLD) {
		return (
			<components.MenuList {...props}>{withSelectedOptionsSeparator(children)}</components.MenuList>
		);
	}

	return (
		<components.MenuList {...props}>
			{withSelectedOptionsSeparator(children.slice(0, SELECT_ITEMS_MAXIMUM_THRESHOLD))}
			<div css={[messageStyles, maximumLimitReachedMessageStyles]}>
				<FormattedMessage tagName={'div'} {...columnPickerMessages.maximumItemsShownLine1} />
				<FormattedMessage tagName={'div'} {...columnPickerMessages.maximumItemsShownLine2} />
			</div>
		</components.MenuList>
	);
};

export const ConcatenatedMenuList = ({
	children,
	...props
}: MenuListComponentProps<OptionType, true>): JSX.Element => {
	const shouldUseDefaultMenuList =
		!children || !Array.isArray(children) || children.length <= SELECT_ITEMS_MAXIMUM_THRESHOLD;

	if (shouldUseDefaultMenuList) {
		return <components.MenuList {...props}>{children}</components.MenuList>;
	}

	const optionStyle = {
		padding: `${token('space.050')} ${token('space.200')}`,
		height: 'auto',
	};
	const maximumLimitReachedMessage = (
		// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
		<div css={messageStyles} style={optionStyle}>
			<FormattedMessage tagName={'div'} {...columnPickerMessages.maximumItemsShownLine1} />
			<FormattedMessage tagName={'div'} {...columnPickerMessages.maximumItemsShownLine2} />
		</div>
	);

	return (
		<components.MenuList {...props}>
			{children.slice(0, SELECT_ITEMS_MAXIMUM_THRESHOLD)}
			{maximumLimitReachedMessage}
		</components.MenuList>
	);
};
