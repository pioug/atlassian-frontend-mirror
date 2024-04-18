import React from 'react';
import ColorPicker from '../src';
import { simplePalette } from '../mock-data';
// AFP-2532 TODO: Fix automatic suppressions below
// eslint-disable-next-line @atlassian/tangerine/import/entry-points
import { colors } from '@atlaskit/theme';
import { token } from '@atlaskit/tokens';
import { withPlatformFeatureFlags } from '@atlassian/feature-flags-storybook-utils';

class ColorPickerExample extends React.Component<{}, { color: string }> {
  state = {
    color: token('color.background.accent.purple.subtle', colors.P200),
  };

  render() {
    return (
      <ColorPicker
        label="Change color"
        palette={simplePalette}
        selectedColor={this.state.color}
        onChange={(newColor: string) => this.setState({ color: newColor })}
        selectedColourSwatchSize="small"
      />
    );
  }
}

const Story = () => <ColorPickerExample />;

Story.decorators = [
  withPlatformFeatureFlags({
    'platform.color-picker-radio-button-functionality_6hkcy': true,
    'platform.design-tokens-color-picker-portfolio-plan-wizard_w8rcl': true,
  }),
];

export default Story;
