import { fg } from '@atlaskit/platform-feature-flags';
import { mergeStyles, type StylesConfig } from '@atlaskit/select';
import { token } from '@atlaskit/tokens';
import memoizeOne from 'memoize-one';

export const BORDER_PADDING = token('space.075');
export const AVATAR_PADDING = 6;
export const INDICATOR_WIDTH = 39;

export const getStyles = memoizeOne(
	(
		width: string | number,
		isMulti?: boolean,
		isCompact?: boolean,
		overrideStyles?: StylesConfig,
		isVisualRefresh?: boolean,
		isPopupStyles?: boolean,
		height?: number | string,
		minHeight?: number | string,
	): StylesConfig => {
		let styles: StylesConfig = {
			menu: (css, state) => ({
				...css,
				width,
				minWidth: state.selectProps.menuMinWidth,
				zIndex: '400',
			}),
			menuList: (css) => ({
				...css,
				zIndex: '400',
			}),
			control: (css, state) => {
				const isMulti = state.selectProps.isMulti;
				return {
					...css,
					width,
					borderColor: state.isFocused
						? token('color.border.focused')
						: state.isInvalid
							? token('color.border.danger')
							: state.selectProps.subtle || state.selectProps.noBorder
								? 'transparent'
								: token('color.border.input'),
					backgroundColor: state.isFocused
						? token('color.background.input')
						: state.selectProps.subtle
							? 'transparent'
							: state.isDisabled && fg('platform-dst-lozenge-tag-badge-visual-uplifts')
								? token('color.background.disabled')
								: state.selectProps.textFieldBackgroundColor
									? token('color.background.input')
									: token('color.background.input'),
					'&:hover .fabric-user-picker__clear-indicator': { opacity: 1 },
					':hover': {
						...css[':hover'],
						borderColor: state.isFocused
							? css[':hover']
								? token('color.border.focused')
								: token('color.border.focused')
							: state.isInvalid
								? token('color.border.danger')
								: state.selectProps.subtle
									? 'transparent'
									: token('color.border.input'),
						backgroundColor:
							state.selectProps.subtle && state.selectProps.hoveringClearIndicator
								? token('color.background.danger')
								: state.isFocused
									? css[':hover']
										? token('color.background.input')
										: token('color.background.input')
									: state.isDisabled
										? token('color.background.disabled')
										: token('color.background.input.hovered'),
					},
					padding: 0,
					minHeight: minHeight ? minHeight : height || isCompact ? 'none' : 44,
					/* IE 11 needs to set height explicitly to be vertical align when being in not compact mode */
					height: height ? height : isCompact || isMulti ? '100%' : 44,
					maxWidth: '100%',
				};
			},
			clearIndicator: ({ _paddingTop, _paddingBottom, _paddingLeft, _paddingRight, ...css }) => ({
				...css,
				// By default show clear indicator, except for on devices where "hover" is supported.
				// This means mobile devices (which do not support hover) will be able to see the clear indicator.
				opacity: 1,
				'@media (hover: hover) and (pointer: fine)': {
					opacity: 0,
				},
				transition: css.transition + ', opacity 150ms',
				paddingTop: 0,
				padding: 0,
				':hover': {
					color: token('color.icon.danger'),
				},
			}),
			indicatorsContainer: (css) => ({
				...css,
				paddingRight: token('space.050'),
			}),
			valueContainer: ({ _paddingTop, _paddingBottom, _position, ...css }, state) => {
				const isMulti = state.selectProps.isMulti;

				return {
					...css,
					gridTemplateColumns: 'auto 1fr',
					paddingTop: isCompact ? 0 : BORDER_PADDING,
					paddingBottom: isCompact ? 0 : BORDER_PADDING,
					paddingLeft: isMulti ? BORDER_PADDING : 0,
					overflowX: 'hidden',
					overflowY: 'auto',
					scrollbarWidth: 'none',
					maxHeight: state.selectProps.maxPickerHeight || '100%',
					'::-webkit-scrollbar': {
						width: 0,
						background: 'transparent',
					},
				};
			},
			multiValue: (css) => ({
				...css,
				borderRadius: 24,
				cursor: 'default',
			}),
			multiValueLabel: (css) => ({
				...css,
				display: 'flex',
			}),
			multiValueRemove: (css) => ({
				...css,
				borderRadius: 24,
				cursor: 'pointer',
			}),
			placeholder: (css, state) => {
				// fix styling in IE 11: when the position is absolute and `left` prop is not defined,
				// IE and other browsers auto calculate value of "left" prop differently,
				// so we want to explicitly set value for the `left` property
				if (css.position === 'absolute' && !css.left) {
					css.left = `${BORDER_PADDING}px`;
				}

				return {
					...css,
					gridArea: '1/2/2/3',
					paddingLeft: state.selectProps.isMulti ? 0 : BORDER_PADDING,
					/* Margin left right of 2px set by default */
					// margin: `0 ${BORDER_PADDING}px`,
					margin: 0,
					whiteSpace: 'nowrap',
					overflow: 'hidden',
					textOverflow: 'ellipsis',
				};
			},
			option: (css) => {
				if (isVisualRefresh) {
					return {
						...css,
						overflow: 'hidden',
						paddingLeft: isPopupStyles ? token('space.200') : token('space.100'),
						paddingRight: isPopupStyles ? token('space.200') : token('space.100'),
					};
				}
				return {
					...css,
					overflow: 'hidden',
				};
			},
			input: (css, state) => ({
				...css,
				gridArea: '1/2/2/3',
				gridTemplateColumns: isMulti && state.placeholder ? '0 123px' : css.gridTemplateColumns,
				/* Necessary to make input height and tag height the same. */
				margin: `${token('space.050')} 0`,
				/* Padding top and bottom of 2 is set by default. */
				paddingTop: 0,
				paddingBottom: 0,

				paddingLeft: state.selectProps.isMulti ? 0 : BORDER_PADDING,
				'& input::placeholder': {
					/* Chrome, Firefox, Opera, Safari 10.1+ */
					color: token('color.text.subtlest'),
					opacity: 1 /* Firefox */,
				},
				'& input:-ms-input-placeholder': {
					/* Internet Explorer 10-11 */
					color: token('color.text.subtlest'),
				},
			}),
			singleValue: (css) => ({
				...css,
				margin: 0,
				gridArea: '1/2/2/3',
			}),
		};

		return overrideStyles ? mergeStyles(styles, overrideStyles) : styles;
	},
);

export const getPopupStyles = memoizeOne(
	(
		width: string | number,
		isMulti?: boolean,
		overrideStyles?: StylesConfig,
		isVisualRefresh?: boolean,
	): StylesConfig => ({
		...getStyles(width, isMulti, false, overrideStyles, isVisualRefresh, true),
	}),
);
