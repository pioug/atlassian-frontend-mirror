/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { type MouseEvent, useCallback } from 'react';
import Tooltip from '@atlaskit/tooltip';
import { fg } from '@atlaskit/platform-feature-flags';
import { css, jsx } from '@atlaskit/css';
import { css as cssUnbounded } from '@compiled/react';
import { token } from '@atlaskit/tokens';
import { B100, DN600A, N0 } from '@atlaskit/theme/colors';
import { type SwatchSize, type ColorCardVariant } from '../types';

export interface Props {
	value: string;
	label?: string;
	onClick?: () => void;
	expanded?: boolean;
	swatchSize?: SwatchSize;
	isDisabled?: boolean;
	id?: string;
	variant?: ColorCardVariant;
}

const ColorCard = ({
	value,
	label,
	expanded,
	onClick,
	swatchSize = 'default',
	isDisabled,
	id,
	variant = 'fill',
}: Props) => {
	const handleMouseDown = useCallback((event: MouseEvent<HTMLButtonElement>) => {
		event.preventDefault();
	}, []);

	const handleClick = useCallback(
		(event: MouseEvent<HTMLButtonElement>) => {
			/**
			 * The 'platform_dst_layer_observer_select' feature flag updates `PopupSelect` to close itself when
			 * the internal Select's `onMenuClose` prop is called.
			 *
			 * By moving focus to the trigger element after the select menu is open, it causes the select
			 * menu to think it is being closed, and call its `onMenuClose` prop.
			 *
			 * This results in the PopupSelect instantly closing when the user clicks to open it.
			 */
			if (!fg('platform_dst_layer_observer_select')) {
				event.currentTarget.focus();
			}

			if (onClick) {
				event.preventDefault();
				onClick();
			}
		},
		[onClick],
	);
	const isOutlineVariant = variant === 'outline';
	const colorCardStyles = isOutlineVariant
		? { borderColor: value || 'grey' }
		: { backgroundColor: value || 'transparent' };

	return (
		<Tooltip content={label}>
			<button
				css={[
					sharedColorContainerStyles,
					swatchSize === 'small' ? smallColorContainerSize : defaultColorContainerSize,
					colorCardButtonStyles,
					expanded &&
						!fg('platform-design-system-dsp-20821-color-pickr-focus') &&
						colorCardButtonFocusedStyles,
				]}
				disabled={isDisabled}
				onClick={handleClick}
				onMouseDown={handleMouseDown}
				aria-label={label}
				aria-expanded={expanded}
				aria-haspopup
				type="button"
				id={id}
			>
				<span css={colorCardWrapperStyles}>
					<span
						css={[
							isOutlineVariant ? colorCardContentStylesOutline : colorCardContentStyles,
							swatchSize === 'small' ? smallColorCardContentSize : defaultColorCardContentSize,
						]}
						// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop
						style={colorCardStyles}
					/>
				</span>
			</button>
		</Tooltip>
	);
};

export default ColorCard;

const sharedColorContainerStyles = css({
	display: 'inline-block',
	position: 'relative',
	border: `${token('border.width.outline')} solid transparent`,
	boxSizing: 'border-box',
	borderRadius: token('border.radius.200', '6px'),
	transition: 'border-color 0.15s cubic-bezier(0.47, 0.03, 0.49, 1.38)',
	backgroundColor: token('color.background.neutral.subtle', N0),
	paddingTop: token('space.0', '0px'),
	paddingRight: token('space.0', '0px'),
	paddingBottom: token('space.0', '0px'),
	paddingLeft: token('space.0', '0px'),
	cursor: 'pointer',
	outline: 'none',
});

const smallColorContainerSize = css({
	width: '24px',
	height: '24px',
	top: token('space.negative.025', '-2px'),
});

const defaultColorContainerSize = css({
	width: '32px',
	height: '32px',
});

const colorCardButtonStyles = cssUnbounded({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors -- Ignored via go/DSP-18766
	':hover': {
		borderColor: token('color.background.neutral.subtle', N0),
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors -- Ignored via go/DSP-18766
	':not(:focus):hover, :focus': {
		borderColor: token('color.border.focused', B100),
		outline: 'none',
	},
});

const colorCardButtonFocusedStyles = css({
	borderColor: token('color.border.focused', B100),
	outline: 'none',
});

const colorCardWrapperStyles = css({
	width: '100%',
	height: '100%',
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'center',
});

const colorCardContentStyles = cssUnbounded({
	borderRadius: token('border.radius.100', '3px'),
	boxShadow: `inset 0px 0px 0px 1px ${token('color.background.inverse.subtle', DN600A)}`,
});

const colorCardContentStylesOutline = css({
	borderRadius: token('border.radius.100', '3px'),
	borderWidth: token('border.width.outline', '2px'),
	borderStyle: 'solid',
});

const smallColorCardContentSize = css({
	width: '16px',
	height: '16px',
});

const defaultColorCardContentSize = css({
	width: '24px',
	height: '24px',
});
