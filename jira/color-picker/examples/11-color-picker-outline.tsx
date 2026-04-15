import React from 'react';
import ColorPicker from '../src';
import { simplePalette } from '../mock-data';
import { token } from '@atlaskit/tokens';
import { IntlProvider } from 'react-intl';
import { DiProvider, injectable } from 'react-magnetic-di';
import { fg } from '@atlaskit/platform-feature-flags';

const platformFgInjectable = injectable(fg, () => true);

class ColorPickerOutlineExample extends React.Component<{}, { color: string }> {
	state = {
		color: token('color.background.accent.purple.subtle'),
	};

	render() {
		return (
			<IntlProvider locale="en">
				<ColorPicker
					label="Change color"
					palette={simplePalette}
					selectedColor={this.state.color}
					onChange={(newColor: string) => this.setState({ color: newColor })}
					variant="outline"
				/>
			</IntlProvider>
		);
	}
}

const Story = (): React.JSX.Element => (
	<DiProvider use={[platformFgInjectable]}>
		<ColorPickerOutlineExample />
	</DiProvider>
);

export default Story;
