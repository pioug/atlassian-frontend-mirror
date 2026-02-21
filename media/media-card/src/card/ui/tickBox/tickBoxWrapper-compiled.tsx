/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { jsx, css } from '@compiled/react';
import { tickBoxClassName } from './styles';
import { type TickBoxProps } from './types';
import { B200 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

const selectedStyles = css({
	backgroundColor: token('color.icon.information', B200),
	color: token('color.icon.inverse', 'white'),
});

const wrapperStyles = css({
	font: token('font.body'),
	width: token('space.200'),
	height: token('space.200'),
	position: 'absolute',
	top: token('space.075', '7px'),
	left: token('space.075', '7px'),
	borderRadius: token('space.250'),
	color: 'transparent',
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	span: {
		display: 'block',
	},
	display: 'grid',
	placeItems: 'center',
	transition: 'all .3s',
});

export const TickBoxWrapper = (props: TickBoxProps) => {
	return (
		<div
			id="tickBoxWrapper"
			css={[wrapperStyles, props.selected && selectedStyles]}
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
			className={tickBoxClassName}
		>
			{props.children}
		</div>
	);
};

TickBoxWrapper.displayName = 'TickBoxWrapper';
