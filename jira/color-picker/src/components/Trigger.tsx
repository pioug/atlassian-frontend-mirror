/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { type MouseEvent, useCallback } from 'react';
import Tooltip from '@atlaskit/tooltip';
import { css, jsx } from '@atlaskit/css';
import { css as cssUnbounded } from '@compiled/react';
import { token } from '@atlaskit/tokens';
import { type SwatchSize, type ColorCardVariant } from '../types';

export interface Props {
	expanded?: boolean;
	id?: string;
	isDisabled?: boolean;
	label?: string;
	onClick?: () => void;
	swatchSize?: SwatchSize;
	tooltipContent?: string;
	value: string;
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
	tooltipContent,
	variant = 'fill',
}: Props) => {
	const handleMouseDown = useCallback((event: MouseEvent<HTMLButtonElement>) => {
		event.preventDefault();
	}, []);

	const handleClick = useCallback(
		(event: MouseEvent<HTMLButtonElement>) => {
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
		<Tooltip content={tooltipContent ?? label}>
			<button
				css={[
					sharedColorContainerStyles,
					swatchSize === 'small' ? smallColorContainerSize : defaultColorContainerSize,
					colorCardButtonStyles,
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
	border: `${token('border.width.selected')} solid transparent`,
	boxSizing: 'border-box',
	borderRadius: token('radius.large', '6px'),
	transition: 'border-color 0.15s cubic-bezier(0.47, 0.03, 0.49, 1.38)',
	backgroundColor: token('color.background.neutral.subtle'),
	paddingTop: token('space.0'),
	paddingRight: token('space.0'),
	paddingBottom: token('space.0'),
	paddingLeft: token('space.0'),
	cursor: 'pointer',
	outline: 'none',
});

const smallColorContainerSize = css({
	width: '24px',
	height: '24px',
	top: token('space.negative.025'),
});

const defaultColorContainerSize = css({
	width: '32px',
	height: '32px',
});

const colorCardButtonStyles = cssUnbounded({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors -- Ignored via go/DSP-18766
	':hover': {
		borderColor: token('color.background.neutral.subtle'),
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors -- Ignored via go/DSP-18766
	':not(:focus):hover, :focus': {
		borderColor: token('color.border.focused'),
		outline: 'none',
	},
});

const colorCardWrapperStyles = css({
	width: '100%',
	height: '100%',
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'center',
});

const colorCardContentStyles = cssUnbounded({
	borderRadius: token('radius.small', '3px'),
	boxShadow: `inset 0px 0px 0px 1px ${token('color.background.inverse.subtle')}`,
});

const colorCardContentStylesOutline = css({
	borderRadius: token('radius.small', '3px'),
	borderWidth: token('border.width.selected'),
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
