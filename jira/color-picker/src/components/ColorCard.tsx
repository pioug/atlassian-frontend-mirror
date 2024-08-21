/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React, {
	type KeyboardEventHandler,
	type Ref,
	useCallback,
	useEffect,
	useRef,
	useImperativeHandle,
	forwardRef,
} from 'react';
import EditorDoneIcon from '@atlaskit/icon/glyph/editor/done';
import Tooltip from '@atlaskit/tooltip';
import { fg } from '@atlaskit/platform-feature-flags';
import { KEY_ENTER, KEY_SPACE } from '../constants';
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';
import { token } from '@atlaskit/tokens';
import { N0, DN600A, B75 } from '@atlaskit/theme/colors';
import { mergeRefs } from 'use-callback-ref';

export interface Props {
	initialFocusRef?: Ref<HTMLDivElement>;
	value: string;
	label: string;
	onClick?: (value: string) => void;
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
		initialFocusRef,
		value,
		label,
		selected,
		focused,
		checkMarkColor = N0,
		isTabbing,
		onClick,
		onKeyDown,
	} = props;

	const ref = useRef<HTMLDivElement | null>(null);
	const isInitialFocus = useRef<boolean>(true);

	const handleMouseDown = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
		event.preventDefault();
	}, []);

	const handleClick = useCallback(
		(event: React.MouseEvent<HTMLDivElement>) => {
			if (onClick) {
				event.preventDefault();
				onClick(value);
			}
		},
		[onClick, value],
	);

	const handleKeyDownOld = useCallback(
		(event: React.KeyboardEvent<HTMLElement>) => {
			const { key } = event;

			if (
				(isTabbing === undefined || isTabbing) &&
				onClick &&
				(key === KEY_ENTER || key === KEY_SPACE)
			) {
				event.preventDefault();
				if (isTabbing) {
					event.stopPropagation();
				}
				onClick(value);
			}
		},
		[isTabbing, onClick, value],
	);

	const handleKeyDown = useCallback(
		(event: React.KeyboardEvent<HTMLDivElement>) => {
			const { key } = event;

			if ((isTabbing === undefined || isTabbing) && (key === KEY_ENTER || key === KEY_SPACE)) {
				event.preventDefault();
				if (isTabbing) {
					event.stopPropagation();
				}
				onClick?.(value);
			}

			onKeyDown?.(event);
		},
		[isTabbing, onClick, onKeyDown, value],
	);

	// TODO: Remove this useEffect when the feature flag 'platform_color_palette_menu_timeline_bar_a11y' is cleaned up
	useEffect(() => {
		if (!fg('platform_color_palette_menu_timeline_bar_a11y')) {
			const refCurrent = ref.current;
			const handleTabKey = (e: KeyboardEvent) => {
				if (e.key === 'Tab') {
					e.stopPropagation();
					e.preventDefault();
				}
			};

			refCurrent?.addEventListener('keydown', handleTabKey);

			return () => {
				refCurrent?.removeEventListener('keydown', handleTabKey);
			};
		}
	}, []);

	useImperativeHandle(
		componentRef,
		() => ({
			focus: () => {
				if (fg('platform_color_palette_menu_timeline_bar_a11y')) {
					if (isInitialFocus.current) {
						!initialFocusRef && ref.current?.focus();
						isInitialFocus.current = false;
					} else {
						ref.current?.focus();
					}
				}
			},
		}),
		[initialFocusRef],
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
						tabIndex={fg('platform_color_palette_menu_timeline_bar_a11y') ? (selected ? 0 : -1) : 0}
						role={fg('platform_color_palette_menu_timeline_bar_a11y') ? 'menuitemradio' : 'radio'}
						aria-checked={selected}
						aria-label={label}
						css={[
							sharedColorContainerStyles,
							(isTabbing === undefined || isTabbing) && colorCardOptionTabbingStyles,
							focused && !isTabbing && colorCardOptionFocusedStyles,
						]}
						onClick={handleClick}
						onMouseDown={handleMouseDown}
						onKeyDown={
							fg('platform_color_palette_menu_timeline_bar_a11y') ? handleKeyDown : handleKeyDownOld
						}
					>
						<div css={colorCardWrapperStyles}>
							<div
								css={colorCardContentStyles}
								style={{
									background: value || 'transparent',
								}}
							>
								{selected && (
									<div css={colorCardContentCheckMarkStyles}>
										<EditorDoneIcon primaryColor={checkMarkColor} label="" />
									</div>
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

const colorCardContentCheckMarkStyles = css({
	// eslint-disable-next-line @atlaskit/design-system/use-tokens-space
	margin: '1px',
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
