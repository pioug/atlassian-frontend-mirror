import React from 'react';
import { ColorPaletteMenu, Compact } from '../src';
import { extendedPalette } from '../mock-data';
import { token } from '@atlaskit/tokens';
import { IntlProvider } from 'react-intl';
import { DiProvider, injectable } from 'react-magnetic-di';
import { fg } from '@atlaskit/platform-feature-flags';

const platformFgInjectable = injectable(fg, () => true);

class ColorPaletteMenuExample extends React.Component<{}, { color: string }> {
	state = {
		color: token('color.background.accent.purple.subtle'),
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
					mode={Compact}
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
