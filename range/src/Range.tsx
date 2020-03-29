import { ThemeProp } from '@atlaskit/theme/components';
import React, { Component } from 'react';
import { Input } from './styled';
import { Theme, ThemeTokens } from './theme';

interface Props {
  /** if the field range needs to be disabled */
  isDisabled?: boolean;
  /** Maximum value of the range */
  max: number;
  /** Minimum value of the range */
  min: number;
  /** Hook to be invoked on change of the range */
  onChange?: (value: number) => any;
  /** Step value for the range */
  step?: number;
  /** Value of the range */
  value?: number;
  /** The default value */
  defaultValue: number;
  /** Callback to receive a reference. */
  inputRef?: (input?: HTMLInputElement) => any;
  /** The theme object to be passed down. See
  [@atlaskit/theme](https://atlaskit.atlassian.com/packages/core/theme) for more details on themeing.
  */
  theme?: ThemeProp<any, any>;
}

interface State {
  value: number;
}

const getPercentValue = (value: number, min: number, max: number): string => {
  let percent = '0';
  if (min < max && value > min) {
    percent = (((value - min) / (max - min)) * 100).toFixed(2);
  }
  return percent;
};

export default class Slider extends Component<Props, State> {
  static defaultProps = {
    isDisabled: false,
    defaultValue: 50,
    min: 0,
    max: 100,
    step: 1,
    onChange: () => {},
  };

  state: State = {
    value:
      this.props.value !== undefined
        ? this.props.value
        : this.props.defaultValue,
  };

  range?: HTMLInputElement;

  componentDidMount() {
    if (this.range) {
      if (this.props.inputRef) {
        this.props.inputRef(this.range);
      }
    }
  }

  getValue = () =>
    this.props.value !== undefined ? this.props.value : this.state.value;

  handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    const { onChange } = this.props;

    this.setState({ value });

    if (onChange) {
      onChange(value);
    }
  };

  render() {
    const { isDisabled, defaultValue, theme, ...rest } = this.props;
    const { min, max } = this.props;
    const value = this.getValue();

    return (
      <Theme.Provider value={theme}>
        <Theme.Consumer>
          {(computedTheme: ThemeTokens) => (
            <Input
              {...computedTheme}
              type="range"
              value={value}
              disabled={isDisabled}
              valuePercent={getPercentValue(value, min, max)}
              innerRef={(ref: HTMLInputElement) => {
                this.range = ref;
              }}
              {...rest}
              onChange={this.handleChange}
            />
          )}
        </Theme.Consumer>
      </Theme.Provider>
    );
  }
}
