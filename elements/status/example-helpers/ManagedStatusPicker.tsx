import React from 'react';
import { StatusPicker, ColorType } from '../src/picker';

export interface Props {
  initialSelectedColor: ColorType;
  initialText: string;
}

export interface State {
  selectedColor: ColorType;
  text: string;
}

export default class ManagedStatusPicker extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    const { initialSelectedColor, initialText } = props;
    this.state = {
      selectedColor: initialSelectedColor,
      text: initialText,
    };
  }

  private handleOnEnter = () => {
    console.log(`Enter pressed`);
  };

  private handleOnColorClick = (selectedColor: ColorType) => {
    console.log(`Color clicked: ${selectedColor}`);
    this.setState({
      selectedColor,
    });
  };

  private handleOnTextChanged = (text: string) => {
    console.log(`Text changed: ${text}`);
    this.setState({
      text,
    });
  };

  render() {
    const { selectedColor, text } = this.state;
    return (
      <div
        id="container"
        style={{
          border: '1px solid #ccc',
          width: '225px',
          borderRadius: '4px',
          padding: '10px 0',
        }}
      >
        <StatusPicker
          selectedColor={selectedColor}
          text={text}
          onEnter={this.handleOnEnter}
          onColorClick={this.handleOnColorClick}
          onTextChanged={this.handleOnTextChanged}
        />
      </div>
    );
  }
}
