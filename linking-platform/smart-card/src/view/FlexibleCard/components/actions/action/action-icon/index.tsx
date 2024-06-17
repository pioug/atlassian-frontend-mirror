/** @jsx jsx */
import React from 'react';
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
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
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
		color: isDisabled ? token('color.text.disabled', '#6B778C') : token('color.icon', '#44546F'),
	});

const stackItemIconSizeStyles = getIconSizeStyles('20px');
// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
const stackItemIconStyles = css(stackItemIconSizeStyles, {
	display: 'inline-block',
	lineHeight: 0,
	padding: token('space.025'),
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
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
			// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766
			getIconStyles(isDisabled),
			// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
			asStackItemIcon ? stackItemIconStyles : getIconSizeStyles(getIconWidth(size)),
		]}
		data-testid={`${testId}-icon`}
	>
		{icon}
	</span>
);

export default ActionIcon;
