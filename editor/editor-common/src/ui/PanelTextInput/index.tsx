/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import type { FocusEvent, KeyboardEvent } from 'react';
import { PureComponent } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx } from '@emotion/react';

import { browser } from '../../utils';

import { panelTextInput, panelTextInputWithCustomWidth } from './styles';

export interface Props {
	ariaActiveDescendant?: string;
	ariaAutoComplete?: boolean;
	ariaControls?: string;
	ariaExpanded?: boolean;
	ariaInvalid?: boolean;
	ariaLabel?: string;
	ariaRequired?: boolean;
	autoFocus?: boolean | FocusOptions;
	defaultValue?: string;
	describedById?: string;
	inputId?: string;
	maxLength?: number;
	onBlur?: Function;
	onCancel?: (e: KeyboardEvent) => void;
	onChange?: (value: string) => void;
	// Ignored via go/ees005
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	onKeyDown?: (e: KeyboardEvent<any>) => void;
	onMouseDown?: Function;
	// overrides default browser redo behaviour (cm + shift + z / ctrl + y) with that function
	onRedo?: Function;
	onSubmit?: (value: string) => void;
	// overrides default browser undo behaviour (cmd/ctrl + z) with that function
	onUndo?: Function;
	placeholder?: string;
	role?: string;
	testId?: string;
	width?: number;
}

export interface State {
	value?: string;
}

const KeyZCode = 90;
const KeyYCode = 89;

// Ignored via go/ees005
// eslint-disable-next-line @repo/internal/react/no-class-components
export default class PanelTextInput extends PureComponent<Props, State> {
	private input?: HTMLInputElement;
	private focusTimeoutId: number | undefined;

	constructor(props: Props) {
		super(props);

		this.state = {
			value: props.defaultValue || '',
		};
	}

	componentDidUpdate(prevProps: Props) {
		if (prevProps.defaultValue !== this.props.defaultValue) {
			this.setState({
				value: this.props.defaultValue,
			});
		}
	}

	componentWillUnmount() {
		window.clearTimeout(this.focusTimeoutId);
	}

	onMouseDown = () => {
		const { onMouseDown } = this.props;
		if (onMouseDown) {
			onMouseDown();
		}
	};

	// Ignored via go/ees005
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	onBlur = (e: FocusEvent<any>) => {
		const { onBlur } = this.props;
		if (onBlur) {
			onBlur(e);
		}
	};

	render() {
		const {
			placeholder,
			width,
			maxLength,
			testId,
			ariaLabel,
			describedById,
			ariaActiveDescendant,
			ariaControls,
			ariaExpanded,
			ariaAutoComplete,
			role,
			inputId,
		} = this.props;
		const { value } = this.state;
		return (
			<input
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766
				css={[panelTextInput, width !== undefined && panelTextInputWithCustomWidth(width)]}
				role={role}
				aria-autocomplete={ariaAutoComplete ? 'list' : undefined}
				aria-expanded={ariaExpanded}
				aria-controls={ariaControls}
				aria-activedescendant={ariaActiveDescendant}
				aria-describedby={describedById}
				data-testid={testId || ''}
				type="text"
				placeholder={placeholder}
				value={value}
				onChange={this.handleChange}
				onKeyDown={this.handleKeydown}
				onMouseDown={this.onMouseDown}
				onBlur={this.onBlur}
				ref={this.handleRef}
				maxLength={maxLength}
				aria-label={ariaLabel}
				aria-required={this.props?.ariaRequired}
				aria-invalid={this.props?.ariaInvalid}
				id={inputId}
			/>
		);
	}

	focus() {
		const { input } = this;
		if (input) {
			const focusOpts = typeof this.props.autoFocus === 'object' ? this.props.autoFocus : {};
			input.focus(focusOpts);
		}
	}

	private handleChange = () => {
		const { onChange } = this.props;
		if (this.input) {
			this.setState({
				value: this.input.value,
			});
		}

		if (onChange && this.input) {
			onChange(this.input.value);
		}
	};

	// Ignored via go/ees005
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	private handleKeydown = (e: KeyboardEvent<any>) => {
		const { onUndo, onRedo, onSubmit, onCancel } = this.props;
		if (e.keyCode === 13 && onSubmit) {
			e.preventDefault(); // Prevent from submitting if an editor is inside a form.
			// Ignored via go/ees005
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			onSubmit(this.input!.value);
		} else if (e.keyCode === 27 && onCancel) {
			onCancel(e);
		} else if (typeof onUndo === 'function' && this.isUndoEvent(e)) {
			e.preventDefault();
			onUndo();
		} else if (typeof onRedo === 'function' && this.isRedoEvent(e)) {
			e.preventDefault();
			onRedo();
		}

		if (this.props.onKeyDown) {
			this.props.onKeyDown(e);
		}
	};

	// Ignored via go/ees005
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	private isUndoEvent(event: KeyboardEvent<any>) {
		return (
			event.keyCode === KeyZCode &&
			// cmd + z for mac
			((browser.mac && event.metaKey && !event.shiftKey) ||
				// ctrl + z for non-mac
				(!browser.mac && event.ctrlKey))
		);
	}

	// Ignored via go/ees005
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	private isRedoEvent(event: KeyboardEvent<any>) {
		return (
			// ctrl + y for non-mac
			(!browser.mac && event.ctrlKey && event.keyCode === KeyYCode) ||
			(browser.mac && event.metaKey && event.shiftKey && event.keyCode === KeyZCode) ||
			(event.ctrlKey && event.shiftKey && event.keyCode === KeyZCode)
		);
	}

	private handleRef = (input: HTMLInputElement | null) => {
		if (input instanceof HTMLInputElement) {
			this.input = input;
			if (this.props.autoFocus) {
				// Need this to prevent jumping when we render TextInput inside Portal @see ED-2992
				this.focusTimeoutId = window.setTimeout(() => this.focus());
			}
		} else {
			this.input = undefined;
		}
	};
}
