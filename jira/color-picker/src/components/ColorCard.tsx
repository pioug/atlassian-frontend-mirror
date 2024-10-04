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
import { fg } from '@atlaskit/platform-feature-flags';
import { COLOR_PALETTE_MENU, KEY_ENTER, KEY_SPACE, KEY_TAB } from '../constants';
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';
import { token } from '@atlaskit/tokens';
import { N0, DN600A, B75 } from '@atlaskit/theme/colors';
import { mergeRefs } from 'use-callback-ref';
import type { ColorCardType } from '../types';
import type { IconColor } from '@atlaskit/tokens/css-type-schema';

export interface Props {
	autoFocus?: boolean;
	initialFocusRef?: Ref<HTMLDivElement>;
	isInsideMenu?: boolean;
	type: ColorCardType;
	value: string;
	label: string;
	onClickOld?: (value: string) => void;
	onClick?: (event: React.MouseEvent | React.KeyboardEvent, value: string) => void;
	onKeyDown?: KeyboardEventHandler<HTMLElement>;
	checkMarkColor?: string;
	selected?: boolean;
	focused?: boolean;
	isOption?: boolean;
	isTabbing?: boolean;
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
		onClickOld,
		onKeyDown,
	} = props;

	const ref = useRef<HTMLDivElement | null>(null);
	const isInitialFocus = useRef<boolean>(true);
	const isColorPaletteMenu = type === COLOR_PALETTE_MENU;

	const handleMouseDown = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
		event.preventDefault();
	}, []);

	const handleClick = useCallback(
		(event: React.MouseEvent<HTMLDivElement>) => {
			if (fg('platform_color_palette-expose-event')) {
				if (onClick) {
					event.preventDefault();
					onClick(event, value);
				}
			} else {
				if (onClickOld) {
					event.preventDefault();
					onClickOld(value);
				}
			}
		},
		[onClick, onClickOld, value],
	);

	const handleKeyDown = useCallback(
		(event: React.KeyboardEvent<HTMLDivElement>) => {
			if (
				(isColorPaletteMenu || isTabbing === undefined || isTabbing) &&
				((onClickOld && !fg('platform_color_palette-expose-event')) ||
					(onClick && fg('platform_color_palette-expose-event'))) &&
				(event.key === KEY_ENTER || event.key === KEY_SPACE)
			) {
				event.preventDefault();

				if (isTabbing) {
					event.stopPropagation();
				}

				// Remove optional call on FG cleanup platform_color_palette-expose-event
				fg('platform_color_palette-expose-event') ? onClick?.(event, value) : onClickOld?.(value);
			}

			if (isColorPaletteMenu) {
				onKeyDown?.(event);
			} else if (event.key === KEY_TAB) {
				event.preventDefault();
				event.stopPropagation();
			}
		},
		[isColorPaletteMenu, isTabbing, value, onClick, onClickOld, onKeyDown],
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

	return (
		<Tooltip content={label}>
			{(tooltipProps) => {
				delete tooltipProps['aria-describedby'];
				return (
					<div
						{...tooltipProps}
						ref={
							initialFocusRef
								? mergeRefs([ref, tooltipProps.ref, initialFocusRef])
								: mergeRefs([ref, tooltipProps.ref])
						}
						role={isInsideMenu ? 'menuitemradio' : 'radio'}
						tabIndex={selected ? 0 : -1}
						aria-checked={selected}
						aria-label={label}
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
							<div css={colorCardContentStyles} style={{ background: value || 'transparent' }}>
								{selected && (
									<EditorDoneIcon
										color={checkMarkColor as IconColor}
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
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors -- Ignored via go/DSP-18766
	':hover, :focus': {
		borderColor: token('color.border.focused', B75),
	},
});

const colorCardOptionFocusedStyles = css({
	borderColor: token('color.border.focused', B75),
});

const sharedColorContainerStyles = css({
	display: 'inline-block',
	position: 'relative',
	width: token('space.400', '32px'),
	height: token('space.400', '32px'),
	border: '2px solid transparent',
	boxSizing: 'border-box',
	borderRadius: token('border.radius.200', '6px'),
	transition: 'border-color 0.15s cubic-bezier(0.47, 0.03, 0.49, 1.38)',
	backgroundColor: token('color.background.neutral.subtle', N0),
	borderColor: token('color.background.neutral.subtle', N0),
	padding: token('space.0', '0px'),
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

const colorCardContentStyles = css({
	width: token('space.300', '24px'),
	height: token('space.300', '24px'),
	borderRadius: token('border.radius.100', '3px'),
	boxShadow: `inset 0px 0px 0px 1px ${token('color.background.inverse.subtle', DN600A)}`,
});
