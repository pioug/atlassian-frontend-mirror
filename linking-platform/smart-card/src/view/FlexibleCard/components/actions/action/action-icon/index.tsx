/** @jsx jsx */
import React from 'react';
import { css, jsx } from '@emotion/react';
import { SmartLinkSize } from '../../../../../../constants';
import { getIconSizeStyles } from '../../../utils';
import { type ActionIconProps } from './types';
import { token } from '@atlaskit/tokens';

const getIconWidth = (size?: SmartLinkSize): string => {
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

const getIconStyles = (isDisabled?: boolean) =>
	css({
		color: isDisabled ? token('color.text.disabled', '#6B778C') : token('color.icon', '#44546F'),
	});

const stackItemIconSizeStyles = getIconSizeStyles('20px');
const stackItemIconStyles = css(stackItemIconSizeStyles, {
	display: 'inline-block',
	lineHeight: 0,
	padding: token('space.025'),
	'span,svg,img': {
		lineHeight: 0,
	},
});

const ActionIcon: React.FC<ActionIconProps> = ({
	size,
	testId,
	icon,
	isDisabled,
	asStackItemIcon,
}) => (
	<span
		css={[
			getIconStyles(isDisabled),
			asStackItemIcon ? stackItemIconStyles : getIconSizeStyles(getIconWidth(size)),
		]}
		data-testid={`${testId}-icon`}
	>
		{icon}
	</span>
);

export default ActionIcon;
