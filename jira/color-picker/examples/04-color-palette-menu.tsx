import React from 'react';
import { ColorPaletteMenu } from '../src';
import { simplePalette } from '../mock-data';
// AFP-2532 TODO: Fix automatic suppressions below
// eslint-disable-next-line @atlassian/tangerine/import/entry-points
import { colors } from '@atlaskit/theme';
import { token } from '@atlaskit/tokens';
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
					palette={simplePalette}
					selectedColor={this.state.color}
					onChange={(newColor: string) => this.setState({ color: newColor })}
					cols={3}
				/>
			</IntlProvider>
		);
	}
}

const Story = () => <ColorPaletteMenuExample />;

export default Story;
