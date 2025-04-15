/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { css, jsx } from '@compiled/react';
import { FormattedMessage } from 'react-intl-next';

import {
	CheckboxOption,
	components,
	type MenuListComponentProps,
	type OptionProps,
	type OptionType,
} from '@atlaskit/select';
import { fontFallback } from '@atlaskit/theme/typography';
import { token } from '@atlaskit/tokens';

import { columnPickerMessages } from './messages';

export const SELECT_ITEMS_MAXIMUM_THRESHOLD = 200;

const messageStyles = css({
	color: token('color.text.subtle', '#44546F'),
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
	font: token('font.body.small', fontFallback.body.small),
	fontWeight: token('font.weight.regular', '400'),
});

const listItemStylesSelected = css({
	backgroundColor: token('color.background.selected'),
	'&:hover': {
		backgroundColor: token('color.background.selected.hovered'),
	},
	'&:active': {
		backgroundColor: token('color.background.selected.pressed'),
	},
	boxShadow: 'none',
});

const listItemStyles = css({
	'&:hover': {
		backgroundColor: token('color.background.neutral.hovered'),
	},
	'&:active': {
		backgroundColor: token('color.background.neutral.pressed'),
	},
	boxShadow: 'none',
});

export const ConcatenatedMenuList = ({
	children,
	...props
}: MenuListComponentProps<OptionType, true>) => {
	const shouldUseDefaultMenuList =
		!children || !Array.isArray(children) || children.length <= SELECT_ITEMS_MAXIMUM_THRESHOLD;

	if (shouldUseDefaultMenuList) {
		return <components.MenuList {...props}>{children}</components.MenuList>;
	}

	const optionStyle = {
		padding: `${token('space.050', '4px')} ${token('space.200', '16px')}`,
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

export const MenuItem = ({ children, ...props }: OptionProps<OptionType, true>) => {
	return (
		<CheckboxOption css={[props.isSelected ? listItemStylesSelected : listItemStyles]} {...props}>
			{children}
		</CheckboxOption>
	);
};
