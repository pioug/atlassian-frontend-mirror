import React, { useRef, useEffect } from 'react';
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
			<IntlProvider locale="en">
				<ColorPicker
					label="Change color"
					palette={simplePalette}
					selectedColor={this.state.color}
					onChange={(newColor: string) => this.setState({ color: newColor })}
				/>
			</IntlProvider>
		);
	}
}

const Story = () => {
	const ref = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const button = ref?.current?.querySelector?.('button');
		button?.click();
	}, []);

	return (
		<DiProvider use={[platformFgInjectable]}>
			<div ref={ref}>
				<ColorPickerExample />
			</div>
		</DiProvider>
	);
};

export default Story;
