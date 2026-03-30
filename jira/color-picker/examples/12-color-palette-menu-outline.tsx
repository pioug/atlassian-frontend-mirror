import React from 'react';
import { ColorPaletteMenu } from '../src';
import { simplePalette } from '../mock-data';
import { token } from '@atlaskit/tokens';
import { IntlProvider } from 'react-intl-next';
import { DiProvider, injectable } from 'react-magnetic-di';
import { fg } from '@atlaskit/platform-feature-flags';

const platformFgInjectable = injectable(fg, () => true);

class ColorPaletteMenuOutlineExample extends React.Component<{}, { color: string }> {
	state = {
		color: token('color.background.accent.purple.subtle'),
	};

	render() {
		return (
			<IntlProvider locale="en">
				<ColorPaletteMenu
					label="Change color"
					palette={simplePalette}
					selectedColor={this.state.color}
					onChange={(_, newColor: string) => this.setState({ color: newColor })}
					cols={3}
					variant="outline"
				/>
			</IntlProvider>
		);
	}
}

const Story = (): React.JSX.Element => (
	<DiProvider use={[platformFgInjectable]}>
		<ColorPaletteMenuOutlineExample />
	</DiProvider>
);

export default Story;
