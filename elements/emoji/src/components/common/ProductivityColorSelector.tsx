/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import {
	memo,
	useContext,
	useRef,
	type KeyboardEvent,
	type MemoExoticComponent,
	type MouseEvent,
} from 'react';
import { css, jsx } from '@compiled/react';
import { IntlContext } from 'react-intl';
import { Radio } from '@atlaskit/radio';
import { token } from '@atlaskit/tokens';
import type { EmojiDescription } from '../../types';
import { type ProductivityColor, productivityColors } from '../../util/productivity-colors';
import { messages } from '../i18n';
import Emoji from './Emoji';

export const productivityColorSelectorTestId = 'productivity-color-selector';
export const productivityColorSelectorId = 'emoji-picker-productivity-color-selector';

const selectorGrid = css({
	border: 0,
	display: 'grid',
	gap: token('space.050'),
	gridTemplateColumns: 'repeat(5, 32px)',
	gridTemplateRows: 'repeat(2, 32px)',
	marginTop: token('space.0'),
	marginRight: token('space.0'),
	marginBottom: token('space.0'),
	marginLeft: token('space.0'),
	minWidth: 0,
	padding: 0,
});

const visuallyHiddenLegend = css({
	border: 0,
	clip: 'rect(0 0 0 0)',
	height: '1px',
	overflow: 'hidden',
	padding: 0,
	position: 'absolute',
	whiteSpace: 'nowrap',
	width: '1px',
});

const colorOption = css({
	height: '32px',
	position: 'relative',
	width: '32px',

	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Styling the ADS Radio internals as an icon-only colour tile.
	label: {
		alignItems: 'center',
		cursor: 'pointer',
		height: '32px',
		justifyContent: 'center',
		width: '32px',
	},

	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Styling the ADS Radio internals as an icon-only colour tile.
	input: {
		cursor: 'pointer',
		height: '32px',
		marginTop: token('space.0'),
		marginRight: token('space.0'),
		marginBottom: token('space.0'),
		marginLeft: token('space.0'),
		opacity: 0,
		position: 'absolute',
		width: '32px',
		zIndex: 1,
	},

	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Styling the ADS Radio internals as an icon-only colour tile.
	'input + span': {
		alignItems: 'center',
		borderRadius: token('radius.small', '3px'),
		display: 'flex',
		height: '32px',
		justifyContent: 'center',
		paddingBlockEnd: 0,
		paddingBlockStart: 0,
		paddingInlineEnd: 0,
		paddingInlineStart: 0,
		width: '32px',
	},

	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Styling the ADS Radio internals as an icon-only colour tile.
	'input:hover + span': {
		backgroundColor: token('color.background.neutral.hovered'),
	},

	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Styling the ADS Radio internals as an icon-only colour tile.
	'input:checked + span': {
		backgroundColor: token('color.background.accent.gray.subtler'),
	},

	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Styling the ADS Radio internals as an icon-only colour tile.
	'input:focus + span': {
		boxShadow: `0 0 0 2px ${token('color.border.focused')}`,
		outline: 'none',
		transitionDuration: '0s, 0.2s',
	},
});

const colorOptionEmoji = css({
	alignItems: 'center',
	display: 'flex',
	height: '32px',
	justifyContent: 'center',
	width: '32px',
});

export interface Props {
	colorPreviewEmojis: Partial<Record<ProductivityColor, EmojiDescription>>;
	focusSelectedColorOnMount?: boolean;
	onColorSelected: (color: ProductivityColor) => void;
	selectedColor: ProductivityColor;
}

const getColorLabel = (color: ProductivityColor): string =>
	`${color.charAt(0).toUpperCase()}${color.slice(1)} productivity emoji colour`;

export const ProductivityColorSelector = ({
	colorPreviewEmojis,
	focusSelectedColorOnMount = false,
	onColorSelected,
	selectedColor,
}: Props): JSX.Element | null => {
	const intl = useContext(IntlContext);
	const radioRefs = useRef<(HTMLInputElement | null)[]>([]);
	const hasFocusedSelectedColor = useRef(false);
	const availableColors = productivityColors.filter((color) => colorPreviewEmojis[color]);
	const colorSelectorAriaLabel = intl
		? intl.formatMessage(messages.emojiSelectColorListAriaLabelText)
		: messages.emojiSelectColorListAriaLabelText.defaultMessage;

	if (!availableColors.length) {
		return null;
	}

	const onArrowKey = (currentIndex: number, direction: -1 | 1) => {
		const nextIndex = (currentIndex + direction + availableColors.length) % availableColors.length;
		radioRefs.current[nextIndex]?.focus();
	};

	const stopPickerDismissal = (event: MouseEvent<HTMLInputElement>) => {
		event.stopPropagation();
	};

	const selectColorOnMouseDown =
		(color: ProductivityColor) => (event: MouseEvent<HTMLInputElement>) => {
			stopPickerDismissal(event);
			event.preventDefault();
			onColorSelected(color);
		};

	return (
		<fieldset
			id={productivityColorSelectorId}
			css={selectorGrid}
			data-testid={productivityColorSelectorTestId}
		>
			<legend css={visuallyHiddenLegend}>{colorSelectorAriaLabel}</legend>
			{availableColors.map((color, index) => {
				const emoji = colorPreviewEmojis[color];

				if (!emoji) {
					return null;
				}

				const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
					if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
						event.preventDefault();
						onArrowKey(index, -1);
					}

					if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
						event.preventDefault();
						onArrowKey(index, 1);
					}

					if (event.key === 'Enter') {
						event.preventDefault();
						onColorSelected(color);
					}
				};

				return (
					<div css={colorOption} key={color}>
						<Radio
							ref={(el) => {
								radioRefs.current[index] = el;
								if (
									focusSelectedColorOnMount &&
									selectedColor === color &&
									el &&
									!hasFocusedSelectedColor.current
								) {
									el.focus();
									hasFocusedSelectedColor.current = true;
								}
							}}
							ariaLabel={getColorLabel(color)}
							name="productivity-emoji-colour"
							isChecked={selectedColor === color}
							onChange={() => onColorSelected(color)}
							onClick={stopPickerDismissal}
							onKeyDown={handleKeyDown}
							onMouseDown={selectColorOnMouseDown(color)}
							testId={`productivity-color-${color}`}
							value={color}
							label={
								<span css={colorOptionEmoji}>
									<Emoji
										emoji={emoji}
										shouldBeInteractive={false}
										aria-hidden={true}
										fitToHeight={24}
									/>
								</span>
							}
						/>
					</div>
				);
			})}
		</fieldset>
	);
};

const _default_1: MemoExoticComponent<typeof ProductivityColorSelector> =
	memo(ProductivityColorSelector);
export default _default_1;
