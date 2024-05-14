import React from 'react';
import ColorPicker from '../src';
import { extendedPalette } from '../mock-data';
// AFP-2532 TODO: Fix automatic suppressions below
// eslint-disable-next-line @atlassian/tangerine/import/entry-points
import { colors } from '@atlaskit/theme';
import { token } from '@atlaskit/tokens';
import { withPlatformFeatureFlags } from '@atlassian/feature-flags-storybook-utils';
import { IntlProvider } from 'react-intl-next';

class ColorPickerExample extends React.Component<{}, { color: string }> {
  state = {
    color: token('color.background.accent.purple.subtle', colors.P200),
  };

  render() {
    return (
      <IntlProvider locale="en">
        <ColorPicker
          label="Change color"
          palette={extendedPalette}
          selectedColor={this.state.color}
          cols={6}
          onChange={(newColor: string) => this.setState({ color: newColor })}
        />
      </IntlProvider>
    );
  }
}

const Story = () => <ColorPickerExample />;

Story.decorators = [
  withPlatformFeatureFlags({
    'platform.color-picker-radio-button-functionality_6hkcy': true,
    'platform.jca11y-1480-inappropriate-label-for-color-picker_76tfe': true,
  }),
];

export default Story;
