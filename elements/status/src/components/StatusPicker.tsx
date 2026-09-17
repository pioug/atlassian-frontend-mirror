/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { fg } from '@atlaskit/platform-feature-flags/fg';
import TextField from '@atlaskit/textfield/text-field';
import { token } from '@atlaskit/tokens';
import React, { type FormEvent, PureComponent, type ReactNode } from 'react';
import { injectIntl, type WithIntlProps, type WrappedComponentProps } from 'react-intl';
import { css, cssMap, jsx } from '@compiled/react';
import ColorPalette from './internal/color-palette';
import { type Color } from './Status';
import { messages } from './i18n';

export type ColorType = Color;

/**
 * Which set of selectable values the picker offers.
 * - `default`: the six named colours.
 * - `extended`: ten colours; hues without an existing name are persisted as hex.
 */
export type StatusPaletteVariant = 'default' | 'extended';

const fieldTextWrapperStyles = css({
	marginTop: 0,
	marginBottom: 0,
	marginRight: token('space.100'),
	marginLeft: token('space.100'),
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'& [data-ds--text-field--container]': {
		borderColor: token('color.border.bold'),
	},
});

const scrollContainerStyles = css({
	overflowY: 'auto',
	overscrollBehaviorY: 'none',
	width: '100%',
});

const paletteWrapperStyles = css({
	marginTop: token('space.100'),
});

const scrollHeightStyles = cssMap({
	// Remove when cleaning up `platform_editor_status_popup_suggestions_patch_2`.
	scrolling: {
		marginTop: token('space.050'),
		maxHeight: '232px',
		paddingTop: token('space.050'),
	},
	default: { maxHeight: '204px' },
	extended: { maxHeight: '176px' },
});

export interface Props {
	autoFocus?: boolean;
	onColorClick: (value: ColorType) => void;
	onColorHover?: (value: ColorType) => void;
	onEnter: () => void;
	onTextChanged: (value: string) => void;
	/**
	 * Which set of selectable colours to offer. Defaults to the six named colours;
	 * `extended` offers ten and can emit hex values through `onColorClick`.
	 */
	palette?: StatusPaletteVariant;
	scrollableContent?: ReactNode;
	selectedColor: ColorType;
	text: string;
}

class Picker extends PureComponent<Props & WrappedComponentProps, any> {
	private inputRef: HTMLInputElement | undefined;
	private autofocusTimeout: NodeJS.Timeout | undefined;
	private fieldTextWrapperKey = Math.random().toString();
	private colorPaletteKey = Math.random().toString();

	static defaultProps = {
		autoFocus: true,
	};

	render() {
		const { text, selectedColor, onColorClick, onColorHover, intl, scrollableContent, palette } =
			this.props;
		const colorPalette = (
			<ColorPalette
				key={this.colorPaletteKey}
				onClick={onColorClick}
				onHover={onColorHover}
				selectedColor={selectedColor}
				palette={palette}
			/>
		);
		// Using <React.Fragment> instead of [] to workaround Enzyme
		// (https://github.com/airbnb/enzyme/issues/1149)
		return (
			<React.Fragment>
				<div css={fieldTextWrapperStyles} key={this.fieldTextWrapperKey}>
					<TextField
						value={text}
						isCompact
						ref={this.handleInputRef}
						onChange={this.onChange}
						onKeyPress={this.onKeyPress}
						spellCheck={false}
						autoComplete="off"
						aria-label={intl.formatMessage(messages.statusInputLabel)}
					/>
				</div>
				{fg('platform_editor_status_popup_suggestions_patch_2') ? (
					<React.Fragment>
						<div css={paletteWrapperStyles}>{colorPalette}</div>
						{scrollableContent ? (
							<div
								css={[scrollContainerStyles, scrollHeightStyles[palette ?? 'default']]}
								data-status-picker-scroll-container
							>
								{scrollableContent}
							</div>
						) : null}
					</React.Fragment>
				) : scrollableContent ? (
					<div
						css={[scrollContainerStyles, scrollHeightStyles.scrolling]}
						data-status-picker-scroll-container
					>
						{colorPalette}
						{scrollableContent}
					</div>
				) : (
					colorPalette
				)}
			</React.Fragment>
		);
	}

	private onChange = (evt: FormEvent<HTMLInputElement>) => {
		// @ts-ignore
		this.props.onTextChanged(evt.target.value);
	};

	private onKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
		if (event.key === 'Enter') {
			this.props.onEnter();
		}
	};

	private handleInputRef = (ref?: HTMLInputElement) => {
		this.inputRef = ref;
		if (ref && this.props.autoFocus) {
			this.focusInput();
		}
	};

	private focusInput = () => {
		if (!this.inputRef) {
			return;
		}
		// Defer to prevent editor scrolling to top
		this.autofocusTimeout = setTimeout(() => {
			this.inputRef?.focus();
		});
	};

	componentDidUpdate() {
		if (this.inputRef && this.props.autoFocus) {
			this.focusInput();
		}
	}

	componentWillUnmount() {
		if (this.autofocusTimeout !== undefined) {
			clearTimeout(this.autofocusTimeout);
		}
	}
}

// eslint-disable-next-line @typescript-eslint/no-restricted-types
export const StatusPicker: React.FC<WithIntlProps<Props & WrappedComponentProps>> & {
	WrappedComponent: React.ComponentType<Props & WrappedComponentProps>;
} = injectIntl(Picker);
