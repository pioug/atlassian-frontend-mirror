import React from 'react';
import { ColorPaletteMenu } from '../src';
import { simplePalette } from '../mock-data';
import { colors } from '@atlaskit/theme';

class ColorPaletteMenuExample extends React.Component<{}, { color: string }> {
  state = {
    color: colors.P200,
  };

  render() {
    return (
      <ColorPaletteMenu
        label="Change color"
        palette={simplePalette}
        selectedColor={this.state.color}
        onChange={(newColor: string) => this.setState({ color: newColor })}
      />
    );
  }
}

export default () => <ColorPaletteMenuExample />;
