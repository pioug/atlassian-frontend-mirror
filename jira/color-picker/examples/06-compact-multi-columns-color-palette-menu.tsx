import React from 'react';
import { ColorPaletteMenu, Compact } from '../src';
import { extendedPalette } from '../mock-data';
// AFP-2532 TODO: Fix automatic suppressions below
// eslint-disable-next-line @atlassian/tangerine/import/entry-points
import { colors } from '@atlaskit/theme';

class ColorPaletteMenuExample extends React.Component<{}, { color: string }> {
  state = {
    color: colors.P200,
  };

  render() {
    return (
      <ColorPaletteMenu
        label="Change color"
        palette={extendedPalette}
        selectedColor={this.state.color}
        cols={6}
        onChange={(newColor: string) => this.setState({ color: newColor })}
        mode={Compact}
      />
    );
  }
}

export default () => <ColorPaletteMenuExample />;
