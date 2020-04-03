import React, { Component } from 'react';

import {
  createAndFireEvent,
  withAnalyticsContext,
  withAnalyticsEvents,
} from '@atlaskit/analytics-next';

import { name as packageName, version as packageVersion } from './version.json';

import RadioIcon from './RadioIcon';
import { RadioInputWrapper, HiddenInput } from './styled/RadioInput';
import { Label, LabelText } from './styled/Radio';
import { RadioProps } from './types';

interface State {
  isHovered: boolean;
  isFocused: boolean;
  isActive: boolean;
  isMouseDown: boolean;
}

class Radio extends Component<RadioProps, State> {
  static defaultProps = {
    isDisabled: false,
    isInvalid: false,
    isChecked: false,
  };

  state: State = {
    isHovered: false,
    isFocused: false,
    isActive: false,
    isMouseDown: false,
  };

  onBlur: React.FocusEventHandler<HTMLInputElement> = event => {
    this.setState({
      // onBlur is called after onMouseDown if the checkbox was focused, however
      // in this case on blur is called immediately after, and we need to check
      // whether the mouse is down.
      isActive: this.state.isMouseDown && this.state.isActive,
      isFocused: false,
    });
    if (this.props.onBlur) {
      this.props.onBlur(event);
    }
  };

  onFocus: React.FocusEventHandler<HTMLInputElement> = event => {
    this.setState({ isFocused: true });
    if (this.props.onFocus) {
      this.props.onFocus(event);
    }
  };

  onMouseLeave: React.MouseEventHandler = event => {
    this.setState({ isActive: false, isHovered: false });
    if (this.props.onMouseLeave) {
      this.props.onMouseLeave(event);
    }
  };

  onMouseEnter: React.MouseEventHandler = event => {
    this.setState({ isHovered: true });
    if (this.props.onMouseEnter) {
      this.props.onMouseEnter(event);
    }
  };

  onMouseUp: React.MouseEventHandler = event => {
    this.setState({ isActive: false, isMouseDown: false });
    if (this.props.onMouseUp) {
      this.props.onMouseUp(event);
    }
  };

  onMouseDown: React.MouseEventHandler = event => {
    this.setState({ isActive: true, isMouseDown: true });
    if (this.props.onMouseDown) {
      this.props.onMouseDown(event);
    }
  };

  render() {
    const {
      ariaLabel,
      isDisabled,
      isRequired,
      isInvalid,
      isChecked,
      label,
      name,
      onChange,
      onInvalid,
      value,
      testId,
      ...rest
    } = this.props;
    const { isFocused, isHovered, isActive } = this.state;

    return (
      <Label
        isDisabled={isDisabled}
        onMouseDown={this.onMouseDown}
        onMouseEnter={this.onMouseEnter}
        onMouseLeave={this.onMouseLeave}
        onMouseUp={this.onMouseUp}
        data-testid={testId && `${testId}--radio-label`}
      >
        <RadioInputWrapper>
          <HiddenInput
            aria-label={ariaLabel}
            checked={isChecked}
            disabled={isDisabled}
            name={name}
            onChange={onChange}
            onBlur={this.onBlur}
            onInvalid={onInvalid}
            onFocus={this.onFocus}
            required={isRequired}
            type="radio"
            value={value}
            {...rest}
            data-testid={testId && `${testId}--hidden-radio`}
          />
          <RadioIcon
            isActive={isActive}
            isChecked={isChecked}
            isDisabled={isDisabled}
            isFocused={isFocused}
            isHovered={isHovered}
            isInvalid={isInvalid}
          />
        </RadioInputWrapper>
        {label ? <LabelText>{label}</LabelText> : null}
      </Label>
    );
  }
}

const createAndFireEventOnAtlaskit = createAndFireEvent('atlaskit');
export { Radio as RadioWithoutAnalytics };

export default withAnalyticsContext({
  componentName: 'radio',
  packageName,
  packageVersion,
})(
  withAnalyticsEvents({
    onChange: createAndFireEventOnAtlaskit({
      action: 'changed',
      actionSubject: 'radio',
      attributes: {
        componentName: 'radio',
        packageName,
        packageVersion,
      },
    }),
  })(Radio),
);
