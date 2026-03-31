/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { forwardRef } from 'react';
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx, css, cssMap } from '@compiled/react';
import { type CardActionButtonOwnProps } from './styles';
import { token } from '@atlaskit/tokens';
import { fg } from '@atlaskit/platform-feature-flags';

const variantStyleMap = cssMap({
	filled: {
		backgroundColor: token('elevation.surface.overlay'),
		'&:hover': {
			backgroundColor: token('elevation.surface.overlay.hovered'),
		},
	},
	default: {
		'&:hover': {
			backgroundColor: token('color.background.neutral.subtle.hovered'),
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
	color: token('color.icon'),
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
				{...(fg('platform_media_card_action_button_type_fix') ? { type: 'button' } : {})}
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
