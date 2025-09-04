/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { forwardRef } from 'react';
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx, css, cssMap } from '@compiled/react';
import { type CardActionButtonOwnProps } from './styles';
import { token } from '@atlaskit/tokens';
import { N500 } from '@atlaskit/theme/colors';

const variantStyleMap = cssMap({
	filled: {
		backgroundColor: token('elevation.surface.overlay', 'rgba(255, 255, 255, 0.8)'),
		'&:hover': {
			backgroundColor: token('elevation.surface.overlay.hovered', 'rgba(255, 255, 255, 0.6)'),
		},
	},
	default: {
		'&:hover': {
			backgroundColor: token('color.background.neutral.subtle.hovered', 'rgba(9, 30, 66, 0.06)'),
		},
	},
});

const cardActionButtonStyles = css({
	appearance: 'none',
	border: 'none',
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'center',
	borderRadius: token('radius.small', '3px'),
	width: '26px',
	height: '26px',
	color: token('color.icon', N500),
	'&:hover': {
		cursor: 'pointer',
	},
});

export const CardActionButton = forwardRef<HTMLButtonElement, CardActionButtonOwnProps>(
	(props, ref) => {
		return (
			// eslint-disable-next-line @atlaskit/design-system/no-html-button
			<button
				{...props}
				id="cardActionButton"
				data-testid="media-card-primary-action"
				aria-label={props.label}
				css={[cardActionButtonStyles, variantStyleMap[props.variant ?? 'default']]}
				// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
				style={{ ...props.style, cursor: props.disabled ? 'not-allowed' : 'default' }}
				onClick={props.onClick}
				onMouseDown={props.onMouseDown}
				ref={ref}
			>
				{props.children}
			</button>
		);
	},
);
