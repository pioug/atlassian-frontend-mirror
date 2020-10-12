import React from 'react';
import {
  FocusEventHandler,
  FormEventHandler,
  KeyboardEvent,
  MouseEvent,
  PureComponent,
} from 'react';
import uuid from 'uuid/v1';

function noModifiers(event: MouseEvent<any> | KeyboardEvent<any>): boolean {
  return !event.altKey && !event.ctrlKey && !event.metaKey && !event.shiftKey;
}

export interface Callback {
  (): void;
}

export interface Props {
  inputId?: string;
  onUp?: Callback;
  onDown?: Callback;
  onEnter?: Callback;
  onEscape?: Callback;
  onChange?: FormEventHandler<any>;
  onFocus?: FocusEventHandler<any>;
  onBlur?: FocusEventHandler<any>;
  inputRef?: any;
  label?: string;
}

class SearchTextInput extends PureComponent<Props, {}> {
  handleKeyDown = (event: React.KeyboardEvent) => {
    if (noModifiers(event)) {
      let notify: Callback | undefined;
      switch (event.keyCode) {
        case 38: // Up
          notify = this.props.onUp;
          break;
        case 40: // Down
          notify = this.props.onDown;
          break;
        case 13: // Enter
          notify = this.props.onEnter;
          break;
        case 27: // Escape
          notify = this.props.onEscape;
          break;
      }
      if (notify) {
        event.preventDefault();
        notify();
      }
    }
  };

  inputRefUpdate = (ref: HTMLInputElement | null) => {
    if (this.props.inputRef) {
      this.props.inputRef(ref);
    }
  };

  private handleRef = (ref: HTMLInputElement | null) => {
    this.inputRefUpdate(ref);
  };

  render() {
    const {
      onUp,
      onDown,
      onEnter,
      onEscape,
      label,
      inputRef,
      inputId,
      ...other
    } = this.props;
    let labelComponent;
    const id = inputId || uuid();
    if (label) {
      labelComponent = (
        <label htmlFor={id}>
          <b>{label}</b>
        </label>
      );
    }
    return (
      <div id="search-text" className="ak-search-text-input">
        {labelComponent}
        <input
          {...other}
          id={id}
          onKeyDown={this.handleKeyDown}
          ref={this.handleRef}
          style={{
            height: '20px',
            margin: '10px',
          }}
        />
      </div>
    );
  }
}

export default SearchTextInput;
