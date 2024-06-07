/**@jsx jsx */
import { jsx } from '@emotion/react';
import { tickBoxClassName } from './styles';
import { type TickBoxProps } from './types';
import { css } from '@emotion/react';
import { transition } from '../styles';
import { B200 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

const getSelectedStyles = (selected?: boolean) =>
	selected
		? `background-color: ${token('color.icon.information', B200)};
      color: ${token('color.icon.inverse', 'white')};`
		: ``;

const wrapperStyles = (selected?: boolean) =>
	css(
		transition && transition(),
		{
			fontSize: '14px',
			width: '14px',
			height: '14px',
			position: 'absolute',
			top: token('space.075', '7px'),
			left: token('space.075', '7px'),
			borderRadius: '20px',
			color: 'transparent',
			span: {
				display: 'block',
				svg: {
					height: '14px',
				},
			},
		},
		getSelectedStyles(selected),
	);

wrapperStyles.displayName = 'TickBoxWrapper';

export const TickBoxWrapper = (props: TickBoxProps) => {
	return (
		<div
			id="tickBoxWrapper"
			css={wrapperStyles(props.selected)}
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
			className={tickBoxClassName}
		>
			{props.children}
		</div>
	);
};
