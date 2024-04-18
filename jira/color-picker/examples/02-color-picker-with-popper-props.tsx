import React from 'react';
import ColorPicker from '../src';
import { simplePalette } from '../mock-data';
// AFP-2532 TODO: Fix automatic suppressions below
// eslint-disable-next-line @atlassian/tangerine/import/entry-points
import { colors } from '@atlaskit/theme';
import { withPlatformFeatureFlags } from '@atlassian/feature-flags-storybook-utils';
import { token } from '@atlaskit/tokens';

class ColorPickerExample extends React.Component<{}, { color: string }> {
  state = {
    color: token('color.background.accent.purple.subtle', colors.P200),
  };

  render() {
    return (
      <div style={{ padding: token('space.250', '20px') }}>
        <ColorPicker
          label="Change color"
          palette={simplePalette}
          selectedColor={this.state.color}
          popperProps={{
            strategy: 'fixed',
            modifiers: [
              {
                name: 'offset',
                options: {
                  offset: [-10, 5],
                },
              },
            ],
          }}
          cols={3}
          onChange={(newColor: string) => this.setState({ color: newColor })}
        />
      </div>
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
