/* eslint-disable react/prop-types */
import React, { Component } from 'react';
import { Input } from './styled';

if (process.env.NODE_ENV !== 'production' && !process.env.CI) {
  // eslint-disable-next-line no-console
  console.warn(
    '@atlaskit/field-range has been deprecated. Please use the @atlaskit/range package instead.',
  );
}

export default class Slider extends Component {
  static defaultProps = {
    disabled: false,
    value: 0,
    min: 0,
    max: 100,
    step: 0.1,
    onChange: () => {},
  };

  // eslint-disable-next-line
  inputElement;

  constructor(props) {
    super(props);

    this.inputElement = null;
    this.state = {
      value: props.value,
      valuePercent: this.getPercentValue(props.value, props.min, props.max),
    };
  }

  state;

  UNSAFE_componentWillReceiveProps({ value: nextValue, min, max }) {
    const { value: currentValue } = this.props;

    if (currentValue !== nextValue) {
      const valuePercent = this.getPercentValue(nextValue, min, max);
      this.setState({ value: nextValue, valuePercent });
    }
  }

  getPercentValue = (value, min, max) => {
    let percent = '0';
    if (min < max && value > min) {
      percent = (((value - min) / (max - min)) * 100).toFixed(2);
    }
    return percent;
  };

  handleChange = (e) => {
    // Event.target is typed as an EventTarget but we need to access properties on it which are
    // specific to HTMLInputElement. Due limitations of the HTML spec flow doesn't know that an
    // EventTarget can have these properties, so we cast it to Element through Object. This is
    // the safest thing we can do in this situation.
    // https://flow.org/en/docs/types/casting/#toc-type-casting-through-any
    const { target } = e;
    const value = parseFloat(target.value);
    const { max, onChange, min } = this.props;
    const valuePercent = this.getPercentValue(value, min, max);

    this.setState({ value, valuePercent });

    if (onChange) {
      onChange(value);
    }
  };

  render() {
    const { min, max, step, disabled } = this.props;
    const { value, valuePercent } = this.state;

    return (
      <Input
        type="range"
        value={value.toString()}
        min={min}
        max={max}
        step={step}
        onChange={this.handleChange}
        disabled={disabled}
        valuePercent={valuePercent}
      />
    );
  }
}
