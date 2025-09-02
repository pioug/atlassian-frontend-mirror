/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React, {
	type KeyboardEventHandler,
	type Ref,
	useCallback,
	useRef,
	useImperativeHandle,
	forwardRef,
} from 'react';
import EditorDoneIcon from '@atlaskit/icon/core/migration/check-mark--editor-done';
import Tooltip from '@atlaskit/tooltip';
import { COLOR_PALETTE_MENU, KEY_ENTER, KEY_SPACE, KEY_TAB } from '../constants';
import { css, jsx } from '@atlaskit/css';
import { css as cssUnbounded } from '@compiled/react';
import { token } from '@atlaskit/tokens';
import { N0, DN600A, B75 } from '@atlaskit/theme/colors';
import { mergeRefs } from 'use-callback-ref';
import type { ColorCardType, ColorCardVariant } from '../types';
import type { IconColor } from '@atlaskit/tokens/css-type-schema';

export interface Props {
	autoFocus?: boolean;
	checkMarkColor?: string;
	focused?: boolean;
	initialFocusRef?: Ref<HTMLDivElement>;
	isInsideMenu?: boolean;
	isOption?: boolean;
	isTabbing?: boolean;
	label: string;
	onClick?: (event: React.MouseEvent | React.KeyboardEvent, value: string) => void;
	onKeyDown?: KeyboardEventHandler<HTMLElement>;
	selected?: boolean;
	type: ColorCardType;
	value: string;
	variant?: ColorCardVariant;
}

export type ColorCardRef = {
	focus: () => void;
};

const ColorCard = forwardRef<ColorCardRef, Props>((props, componentRef) => {
	const {
		type,
		autoFocus = true,
		initialFocusRef,
		isInsideMenu = true,
		value,
		label,
		selected,
		focused,
		checkMarkColor = N0,
		isTabbing,
		onClick,
		onKeyDown,
		variant = 'fill',
	} = props;

	const ref = useRef<HTMLDivElement | null>(null);
	const isInitialFocus = useRef<boolean>(true);
	const isColorPaletteMenu = type === COLOR_PALETTE_MENU;

	const handleMouseDown = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
		event.preventDefault();
	}, []);

	const handleClick = useCallback(
		(event: React.MouseEvent<HTMLDivElement>) => {
			if (onClick) {
				event.preventDefault();
				onClick(event, value);
			}
		},
		[onClick, value],
	);

	const handleKeyDown = useCallback(
		(event: React.KeyboardEvent<HTMLDivElement>) => {
			if (
				(isColorPaletteMenu || isTabbing === undefined || isTabbing) &&
				onClick &&
				(event.key === KEY_ENTER || event.key === KEY_SPACE)
			) {
				event.preventDefault();

				if (isTabbing) {
					event.stopPropagation();
				}

				onClick(event, value);
			}

			if (isColorPaletteMenu) {
				onKeyDown?.(event);
			} else if (event.key === KEY_TAB) {
				event.preventDefault();
				event.stopPropagation();
			}
		},
		[isColorPaletteMenu, isTabbing, value, onClick, onKeyDown],
	);

	useImperativeHandle(
		componentRef,
		() => ({
			focus: () => {
				if (isColorPaletteMenu) {
					if (isInitialFocus.current) {
						autoFocus && !initialFocusRef && ref.current?.focus();
						isInitialFocus.current = false;
					} else {
						ref.current?.focus();
					}
				}
			},
		}),
		[autoFocus, isColorPaletteMenu, initialFocusRef],
	);

	const isInsideMenuRole = isInsideMenu ? 'menuitemradio' : 'radio';
	const role = isColorPaletteMenu ? isInsideMenuRole : 'presentation';

	const ariaChecked = isColorPaletteMenu ? selected : undefined;
	const ariaLabel = isColorPaletteMenu ? label : undefined;
	const isOutlineVariant = variant === 'outline';
	const newCheckmarkColor = isOutlineVariant ? token('color.icon') : checkMarkColor;

	return (
		<Tooltip content={label}>
			{(tooltipProps) => {
				delete tooltipProps['aria-describedby'];
				return (
					// eslint-disable-next-line jsx-a11y/no-static-element-interactions
					<div
						{...tooltipProps}
						ref={
							initialFocusRef
								? mergeRefs([ref, tooltipProps.ref, initialFocusRef])
								: mergeRefs([ref, tooltipProps.ref])
						}
						role={role}
						// eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
						tabIndex={selected ? 0 : -1}
						aria-checked={ariaChecked}
						aria-label={ariaLabel}
						css={[
							sharedColorContainerStyles,
							(isColorPaletteMenu || isTabbing === undefined || isTabbing) &&
								colorCardOptionTabbingStyles,
							focused && (isColorPaletteMenu || !isTabbing) && colorCardOptionFocusedStyles,
						]}
						onClick={handleClick}
						onMouseDown={handleMouseDown}
						onKeyDown={handleKeyDown}
					>
						<div css={colorCardWrapperStyles}>
							<div
								css={[colorCardContentStyles, isOutlineVariant && colorCardContentStylesOutline]}
								// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop
								style={
									isOutlineVariant
										? { borderColor: value || 'grey' }
										: { backgroundColor: value || 'transparent' }
								}
							>
								{selected && (
									<EditorDoneIcon
										color={newCheckmarkColor as IconColor}
										label=""
										spacing="spacious"
										LEGACY_margin="1px"
									/>
								)}
							</div>
						</div>
					</div>
				);
			}}
		</Tooltip>
	);
});

export default ColorCard;

const colorCardOptionTabbingStyles = css({
	'&:hover': {
		borderColor: token('color.border.focused', B75),
	},
	'&:focus': {
		borderColor: token('color.border.focused', B75),
	},
});

const colorCardOptionFocusedStyles = css({
	borderColor: token('color.border.focused', B75),
});

const sharedColorContainerStyles = css({
	display: 'inline-block',
	position: 'relative',
	width: '32px',
	height: '32px',
	border: `${token('border.width.outline', '2px')} solid transparent`,
	boxSizing: 'border-box',
	borderRadius: token('radius.large', '6px'),
	transition: 'border-color 0.15s cubic-bezier(0.47, 0.03, 0.49, 1.38)',
	backgroundColor: token('color.background.neutral.subtle', N0),
	paddingTop: token('space.0', '0px'),
	paddingRight: token('space.0', '0px'),
	paddingBottom: token('space.0', '0px'),
	paddingLeft: token('space.0', '0px'),
	cursor: 'pointer',
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
	width: '24px',
	height: '24px',
	borderRadius: token('radius.small', '3px'),
	boxShadow: `inset 0px 0px 0px 1px ${token('color.background.inverse.subtle', DN600A)}`,
});

const colorCardContentStylesOutline = cssUnbounded({
	boxShadow: 'none',
	borderWidth: token('border.width.outline', '2px'),
	borderStyle: 'solid',
});
