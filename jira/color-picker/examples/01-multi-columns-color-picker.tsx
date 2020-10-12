import React from 'react';
import ColorPicker from '../src';
import { extendedPalette } from '../mock-data';
import { colors } from '@atlaskit/theme';

class ColorPickerExample extends React.Component<{}, { color: string }> {
  state = {
    color: colors.P200,
  };

  render() {
    return (
      <ColorPicker
        label="Change color"
        palette={extendedPalette}
        selectedColor={this.state.color}
        cols={6}
        onChange={(newColor: string) => this.setState({ color: newColor })}
      />
    );
  }
}

export default () => <ColorPickerExample />;
