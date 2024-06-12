/** @jsx jsx */
import { type MouseEvent, useCallback } from 'react';
import Tooltip from '@atlaskit/tooltip';
import { css, jsx } from '@emotion/react';
import { token } from '@atlaskit/tokens';
import { B100, DN600A, N0 } from '@atlaskit/theme/colors';
import { type SwatchSize } from '../types';

export interface Props {
	value: string;
	label?: string;
	onClick?: () => void;
	expanded?: boolean;
	swatchSize?: SwatchSize;
	isDisabled?: boolean;
}

const ColorCard = ({
	value,
	label,
	expanded,
	onClick,
	swatchSize = 'default',
	isDisabled,
}: Props) => {
	const handleMouseDown = useCallback((event: MouseEvent<HTMLButtonElement>) => {
		event.preventDefault();
	}, []);

	const handleClick = useCallback(
		(event: MouseEvent<HTMLButtonElement>) => {
			event.currentTarget.focus();

			if (onClick) {
				event.preventDefault();
				onClick();
			}
		},
		[onClick],
	);

	return (
		<Tooltip content={label}>
			<button
				css={[
					sharedColorContainerStyles,
					swatchSize === 'small' ? smallColorContainerSize : defaultColorContainerSize,
					colorCardButtonStyles,
					expanded && colorCardButtonFocusedStyles,
				]}
				disabled={isDisabled}
				onClick={handleClick}
				onMouseDown={handleMouseDown}
				aria-label={label}
				aria-expanded={expanded}
				aria-haspopup
				type="button"
			>
				<span css={colorCardWrapperStyles}>
					<span
						css={[
							colorCardContentStyles,
							swatchSize === 'small' ? smallColorCardContentSize : defaultColorCardContentSize,
						]}
						style={{
							background: value || 'transparent',
						}}
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
	border: '2px solid transparent',
	boxSizing: 'border-box',
	borderRadius: '6px',
	transition: 'border-color 0.15s cubic-bezier(0.47, 0.03, 0.49, 1.38)',
	backgroundColor: token('color.background.neutral.subtle', N0),
	borderColor: token('color.background.neutral.subtle', N0),
	padding: token('space.0', '0px'),
	cursor: 'pointer',
	outline: 'none',
});

const smallColorContainerSize = css({
	width: token('space.300', '24px'),
	height: token('space.300', '24px'),
	top: token('space.negative.025', '-2px'),
});

const defaultColorContainerSize = css({
	width: token('space.400', '32px'),
	height: token('space.400', '32px'),
});

const colorCardButtonStyles = css({
	':hover': {
		borderColor: token('color.background.neutral.subtle', N0),
	},
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

const colorCardContentStyles = css({
	borderRadius: token('border.radius.100', '3px'),
	boxShadow: `inset 0px 0px 0px 1px ${token('color.background.inverse.subtle', DN600A)}`,
});

const smallColorCardContentSize = css({
	width: token('space.200', '16px'),
	height: token('space.200', '16px'),
});

const defaultColorCardContentSize = css({
	width: token('space.300', '24px'),
	height: token('space.300', '24px'),
});
