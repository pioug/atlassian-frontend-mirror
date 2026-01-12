import React, { Component } from 'react';

import Button from '@atlaskit/button/new';
import { Checkbox } from '@atlaskit/checkbox';
import DownIcon from '@atlaskit/icon/core/chevron-down';
import { type OptionsType, type OptionType, PopupSelect } from '@atlaskit/select';

const options: OptionsType = [
	{ label: 'Adelaide', value: 'adelaide' },
	{ label: 'Brisbane', value: 'brisbane' },
	{ label: 'Canberra', value: 'canberra' },
	{ label: 'Darwin', value: 'darwin' },
	{ label: 'Hobart', value: 'hobart' },
	{ label: 'Melbourne', value: 'melbourne' },
	{ label: 'Perth', value: 'perth' },
	{ label: 'Sydney', value: 'sydney' },
];

const defaults = { options, placeholder: "" };

interface State {
	values: OptionsType;
	valuesString: string;
	placeholder: string;
	controlShouldRenderValue: boolean;
}

class MultiPopupSelectExample extends Component<{}, State> {
	state = {
		values: [options[0]],
		valuesString: '',
		placeholder: '',
		controlShouldRenderValue: false,
	};

	UNSAFE_componentWillMount() {
		this.setState((state) => ({
			valuesString: state.values.map((v) => v.label).join(', '),
		}));
	}

	onChange = (values: OptionsType<OptionType>) => {
		this.setState({
			values: values,
			valuesString: values.map((option: OptionType) => option.label).join(', '),
		});
	};

	toggleConfig = (event: React.ChangeEvent<HTMLInputElement>) => {
		console.log('toggled');
		this.setState({
			controlShouldRenderValue: event.target.checked,
		});
	};

	render() {
		const { placeholder, valuesString, values, controlShouldRenderValue } = this.state;
		return (
			<div>
				<Checkbox
					value="show value in search"
					name="toggleValue"
					onChange={this.toggleConfig}
					label="show value in search"
				/>
				<p
					style={{
						// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
						display: 'inline-block',
						// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
						maxWidth: '250px',
					}}
				>
					<PopupSelect
						{...defaults}
						controlShouldRenderValue={controlShouldRenderValue}
						backspaceRemovesValue
						closeMenuOnSelect={false}
						onChange={this.onChange}
						value={values}
						target={({ ref }) => (
							<Button ref={ref} iconAfter={DownIcon}>
								{valuesString || placeholder}
							</Button>
						)}
						isMulti
						onMenuOpen={() => console.log('menu opened')}
						onMenuClose={() => console.log('menu closed')}
					/>
				</p>
			</div>
		);
	}
}

export default (): React.JSX.Element => <MultiPopupSelectExample />;
