import React from 'react';
import { ColorPaletteMenu } from '../src';
import { extendedPalette } from '../mock-data';
// AFP-2532 TODO: Fix automatic suppressions below
// eslint-disable-next-line @atlassian/tangerine/import/entry-points
import { colors } from '@atlaskit/theme';
import { token } from '@atlaskit/tokens';
import { IntlProvider } from 'react-intl-next';
import { DiProvider, injectable } from 'react-magnetic-di';
import { fg } from '@atlaskit/platform-feature-flags';

const platformFgInjectable = injectable(fg, () => true);

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
					onChange={(_, newColor: string) => this.setState({ color: newColor })}
				/>
			</IntlProvider>
		);
	}
}

const Story = (): React.JSX.Element => (
	<DiProvider use={[platformFgInjectable]}>
		<ColorPaletteMenuExample />
	</DiProvider>
);

export default Story;
