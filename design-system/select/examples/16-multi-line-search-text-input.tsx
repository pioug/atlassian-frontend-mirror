import React, { Component, type KeyboardEvent } from 'react';

import { Label } from '@atlaskit/form';
import { CreatableSelect, type OptionsType } from '@atlaskit/select';

const components = {
	DropdownIndicator: null,
};

const createOption = (label: string) => ({
	label,
	value: label,
});

interface State {
	inputValue: string;
	value: OptionsType;
}

class MultiLineSearchInput extends Component<{}, State> {
	state = {
		inputValue: '',
		value: [],
	};

	handleChange = (value: any, actionMeta: any) => {
		console.group('Value Changed');
		console.log(value);
		console.log(`action: ${actionMeta.action}`);
		console.groupEnd();
		this.setState({ value });
	};

	handleInputChange = (inputValue: string) => {
		this.setState({ inputValue });
	};

	handleKeyDown = (event: KeyboardEvent) => {
		const { inputValue, value } = this.state;
		if (!inputValue) {
			return;
		}
		switch (event.key) {
			case 'Enter':
			case 'Tab':
				console.group('Value Added');
				console.log(value);
				console.groupEnd();
				this.setState({
					inputValue: '',
					value: [...value, createOption(inputValue)],
				});
				event.preventDefault();
				break;
			default:
				break;
		}
	};

	render() {
		const { inputValue, value } = this.state;

		return (
			<>
				<Label htmlFor="multi-line-search-example">Which city do you live in?</Label>
				<CreatableSelect
					inputId="multi-line-search-example"
					components={components}
					inputValue={inputValue}
					isClearable
					isMulti
					menuIsOpen={false}
					onChange={this.handleChange}
					onInputChange={this.handleInputChange}
					onKeyDown={this.handleKeyDown}
					placeholder="Type something and press enter..."
					value={value}
				/>
			</>
		);
	}
}

export default (): React.JSX.Element => <MultiLineSearchInput />;
