import React, { Component } from 'react';
import Button from '@atlaskit/button/standard-button';
import { Checkbox } from '@atlaskit/checkbox';
import DownIcon from '@atlaskit/icon/glyph/hipchat/chevron-down';
import { PopupSelect, OptionType, OptionsType } from '../src';

const options: OptionsType = [
  { label: 'Adelaide', value: 'adelaide' },
  { label: 'Brisbane', value: 'brisbane' },
  { label: 'Canberra', value: 'canberra' },
  { label: 'Darwin', value: 'darwin' },
  { label: 'Hobart', value: 'hobart' },
  { label: 'Melbourne', value: 'melbourne' },
  { label: 'Perth', value: 'perth' },
  { label: 'Sydney', value: 'sydney' },
];

const defaults = { options, placeholder: 'Choose a City' };

interface State {
  values: OptionsType;
  valuesString: string;
  placeholder: string;
  controlShouldRenderValue: boolean;
}

class MultiPopupSelectExample extends Component<{}, State> {
  state = {
    values: [options[0]],
    valuesString: '',
    placeholder: 'Choose value...',
    controlShouldRenderValue: false,
  };

  UNSAFE_componentWillMount() {
    this.setState((state) => ({
      valuesString: state.values.map((v) => v.label).join(', '),
    }));
  }

  onChange = (values: OptionsType<OptionType>) => {
    this.setState({
      values: values,
      valuesString: values.map((option: OptionType) => option.label).join(', '),
    });
  };

  toggleConfig = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log('toggled');
    this.setState({
      controlShouldRenderValue: event.target.checked,
    });
  };

  render() {
    const {
      placeholder,
      valuesString,
      values,
      controlShouldRenderValue,
    } = this.state;
    return (
      <div>
        <Checkbox
          value="show value in search"
          name="toggleValue"
          onChange={this.toggleConfig}
          label="show value in search"
        />
        <p
          style={{
            display: 'inline-block',
            maxWidth: '250px',
          }}
        >
          <PopupSelect
            {...defaults}
            controlShouldRenderValue={controlShouldRenderValue}
            backspaceRemovesValue
            closeMenuOnSelect={false}
            onChange={this.onChange}
            value={values}
            target={({ ref }) => (
              <Button ref={ref} iconAfter={<DownIcon label="open" />}>
                {valuesString || placeholder}
              </Button>
            )}
            isMulti
          />
        </p>
      </div>
    );
  }
}

export default MultiPopupSelectExample;
