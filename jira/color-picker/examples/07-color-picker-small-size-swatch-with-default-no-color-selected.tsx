import React from 'react';
import ColorPicker from '../src';
import { simplePalette } from '../mock-data';
// AFP-2532 TODO: Fix automatic suppressions below
// eslint-disable-next-line @atlassian/tangerine/import/entry-points
import { colors } from '@atlaskit/theme';
import { token } from '@atlaskit/tokens';
import { IntlProvider } from 'react-intl-next';
import { DiProvider, injectable } from 'react-magnetic-di';
import { fg } from '@atlaskit/platform-feature-flags';

const platformFgInjectable = injectable(fg, () => true);

class ColorPickerExample extends React.Component<{}, { color: string }> {
	state = {
		color: token('color.background.accent.purple.subtle', colors.P200),
	};

	render() {
		return (
			// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
			<div style={{ padding: token('space.250', '20px') }}>
				<IntlProvider locale="en">
					<ColorPicker
						label="Change color"
						palette={simplePalette}
						selectedColor={this.state.color}
						showDefaultSwatchColor={false}
						selectedColourSwatchSize="small"
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
				</IntlProvider>
			</div>
		);
	}
}

const Story = () => (
	<DiProvider use={[platformFgInjectable]}>
		<ColorPickerExample />
	</DiProvider>
);

export default Story;
