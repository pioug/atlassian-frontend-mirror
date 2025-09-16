import React from 'react';
import { token } from '@atlaskit/tokens';
import { StatusPicker, type ColorType } from '../src/picker';

export interface Props {
	initialSelectedColor: ColorType;
	initialText: string;
}

export interface State {
	selectedColor: ColorType;
	text: string;
}

export default class ManagedStatusPicker extends React.Component<Props, State> {
	constructor(props: Props) {
		super(props);
		const { initialSelectedColor, initialText } = props;
		this.state = {
			selectedColor: initialSelectedColor,
			text: initialText,
		};
	}

	private handleOnEnter = () => {
		console.log(`Enter pressed`);
	};

	private handleOnColorClick = (selectedColor: ColorType) => {
		console.log(`Color clicked: ${selectedColor}`);
		this.setState({
			selectedColor,
		});
	};

	private handleOnTextChanged = (text: string) => {
		console.log(`Text changed: ${text}`);
		this.setState({
			text,
		});
	};

	render() {
		const { selectedColor, text } = this.state;
		return (
			// eslint-disable-next-line @atlaskit/design-system/prefer-primitives
			<div
				id="container"
				style={{
					border: `${token('border.width')} solid ${token('color.border', '#ccc')}`,
					// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
					width: '225px',
					// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
					borderRadius: token('radius.small'),
					padding: `${token('space.150', '12px')} 0`, // Added 12px padding instead of 10px, since Design tokens supports 8 and 12 px only
				}}
			>
				<StatusPicker
					selectedColor={selectedColor}
					text={text}
					onEnter={this.handleOnEnter}
					onColorClick={this.handleOnColorClick}
					onTextChanged={this.handleOnTextChanged}
				/>
			</div>
		);
	}
}
