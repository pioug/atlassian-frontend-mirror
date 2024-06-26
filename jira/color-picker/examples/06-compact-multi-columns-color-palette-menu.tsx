import React from 'react';
import { ColorPaletteMenu, Compact } from '../src';
import { extendedPalette } from '../mock-data';
// AFP-2532 TODO: Fix automatic suppressions below
// eslint-disable-next-line @atlassian/tangerine/import/entry-points
import { colors } from '@atlaskit/theme';
import { token } from '@atlaskit/tokens';
import { withPlatformFeatureFlags } from '@atlassian/feature-flags-storybook-utils';
import { IntlProvider } from 'react-intl-next';

class ColorPaletteMenuExample extends React.Component<{}, { color: string }> {
	state = {
		color: token('color.background.accent.purple.subtle', colors.P200),
	};

	render() {
		return (
			<IntlProvider locale="en">
				<ColorPaletteMenu
					label="Change color"
					palette={extendedPalette}
					selectedColor={this.state.color}
					cols={6}
					onChange={(newColor: string) => this.setState({ color: newColor })}
					mode={Compact}
				/>
			</IntlProvider>
		);
	}
}

const Story = () => <ColorPaletteMenuExample />;

Story.decorators = [
	withPlatformFeatureFlags({
		'platform.jca11y-2997-remove-duplicate-screen-reader-announcements_fz13s': true,
	}),
];

export default Story;
