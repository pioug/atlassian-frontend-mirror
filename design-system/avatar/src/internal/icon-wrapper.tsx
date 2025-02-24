/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { type FC, type ReactNode } from 'react';

import { css, jsx } from '@emotion/react';

import { N0 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

import { BORDER_WIDTH } from '../constants';

interface IconWrapperProps {
	bgColor?: string;
	children?: ReactNode;
	label?: string;
}

const iconWrapperStyles = css({
	display: 'flex',
	boxSizing: 'border-box',
	width: '100%',
	height: '100%',
	alignItems: 'center',
	alignContent: 'center',
	borderRadius: token('border.radius.circle', '50%'),
	overflow: 'hidden',
});

/**
 * __Icon wrapper__
 *
 * An icon wrapper is used internally only.
 */
const IconWrapper: FC<IconWrapperProps> = ({
	bgColor = token('elevation.surface.overlay', N0),
	children,
}) => (
	<span
		css={iconWrapperStyles}
		role="presentation"
		style={{
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
			border: `${BORDER_WIDTH}px solid ${bgColor}`,
			backgroundColor: bgColor,
		}}
	>
		{children}
	</span>
);

export default IconWrapper;
