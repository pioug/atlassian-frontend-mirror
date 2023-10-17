/** @jsx jsx */
import type { FocusEvent, KeyboardEvent } from 'react';
import { PureComponent } from 'react';

import { jsx } from '@emotion/react';

import { browser } from '../../utils';

import { panelTextInput, panelTextInputWithCustomWidth } from './styles';

export interface Props {
  autoFocus?: boolean | FocusOptions;
  defaultValue?: string;
  onChange?: (value: string) => void;
  onSubmit?: (value: string) => void;
  onCancel?: (e: KeyboardEvent) => void;
  placeholder?: string;
  onMouseDown?: Function;
  onKeyDown?: (e: KeyboardEvent<any>) => void;
  // overrides default browser undo behaviour (cmd/ctrl + z) with that function
  onUndo?: Function;
  // overrides default browser redo behaviour (cm + shift + z / ctrl + y) with that function
  onRedo?: Function;
  onBlur?: Function;
  width?: number;
  maxLength?: number;
  testId?: string;
  ariaLabel?: string;
  describedById?: string;
  ariaExpanded?: boolean;
  ariaActiveDescendant?: string;
  ariaControls?: string;
  role?: string;
  ariaAutoComplete?: boolean;
  ariaRequired?: boolean;
  ariaInvalid?: boolean;
  inputId?: string;
}

export interface State {
  value?: string;
}

const KeyZCode = 90;
const KeyYCode = 89;

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
        css={[
          panelTextInput,
          width !== undefined && panelTextInputWithCustomWidth(width),
        ]}
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
      const focusOpts =
        typeof this.props.autoFocus === 'object' ? this.props.autoFocus : {};
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

  private handleKeydown = (e: KeyboardEvent<any>) => {
    const { onUndo, onRedo, onSubmit, onCancel } = this.props;
    if (e.keyCode === 13 && onSubmit) {
      e.preventDefault(); // Prevent from submitting if an editor is inside a form.
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

  private isUndoEvent(event: KeyboardEvent<any>) {
    return (
      event.keyCode === KeyZCode &&
      // cmd + z for mac
      ((browser.mac && event.metaKey && !event.shiftKey) ||
        // ctrl + z for non-mac
        (!browser.mac && event.ctrlKey))
    );
  }

  private isRedoEvent(event: KeyboardEvent<any>) {
    return (
      // ctrl + y for non-mac
      (!browser.mac && event.ctrlKey && event.keyCode === KeyYCode) ||
      (browser.mac &&
        event.metaKey &&
        event.shiftKey &&
        event.keyCode === KeyZCode) ||
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
