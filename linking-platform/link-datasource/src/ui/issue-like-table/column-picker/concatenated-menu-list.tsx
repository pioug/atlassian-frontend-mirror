/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import { css, jsx } from '@compiled/react';
import { FormattedMessage } from 'react-intl';

import { components } from '@atlaskit/react-select/components';
import type { MenuListComponentProps, OptionType } from '@atlaskit/select/types';
import { token } from '@atlaskit/tokens';

import { columnPickerMessages } from './messages';

export const SELECT_ITEMS_MAXIMUM_THRESHOLD = 200;

const messageStyles = css({
	color: token('color.text.subtle'),
	font: token('font.body.small'),
	fontWeight: token('font.weight.regular'),
});

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
