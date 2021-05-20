import React from 'react';
import { ChangeEventHandler, Component, FocusEventHandler } from 'react';
import uuid from 'uuid/v1';

function noModifiers(event: React.KeyboardEvent<HTMLInputElement>) {
  return !event.altKey && !event.ctrlKey && !event.metaKey && !event.shiftKey;
}

export interface OnAction {
  (): void;
}

export interface OnInputRef {
  (ref: HTMLInputElement): void;
}

export interface Props {
  inputId: string;
  inputRef?: OnInputRef;
  label: string;
  onBlur?: FocusEventHandler<any>;
  onChange?: ChangeEventHandler<HTMLInputElement>;
  onDown?: OnAction;
  onEnter?: OnAction;
  onEscape?: OnAction;
  onFocus?: FocusEventHandler<any>;
  onUp?: OnAction;
}

class SearchTextInput extends Component<Props, {}> {
  constructor(props: Props) {
    super(props);
  }

  private handleKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (
    event,
  ) => {
    if (noModifiers(event)) {
      let notify;
      switch (event.keyCode /* eslint default-case: 0 */) {
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

  private inputRefUpdate = (ref: HTMLInputElement) => {
    if (this.props.inputRef) {
      this.props.inputRef(ref);
    }
  };

  render() {
    // /* eslint no-unused-vars: 0 */
    // const { onUp, onDown, onEnter, onEscape, label, inputRef, inputId, ...other } = this.props;
    const { label, inputId, onBlur, onChange, onFocus } = this.props;
    let labelComponent;
    const id = inputId || uuid();
    if (label) {
      labelComponent = <label htmlFor={id}>{label}</label>;
    }
    return (
      <div id="search-text" className="pf-search-text-input">
        {labelComponent}
        <input
          id={id}
          type="text"
          onBlur={onBlur}
          onChange={onChange}
          onFocus={onFocus}
          onKeyDown={this.handleKeyDown}
          ref={this.inputRefUpdate}
          style={{
            height: '20px',
            marginLeft: '10px',
          }}
        />
      </div>
    );
  }
}

export default SearchTextInput;
