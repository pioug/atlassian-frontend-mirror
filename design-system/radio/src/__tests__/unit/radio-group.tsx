import React from 'react';

import { fireEvent, render, screen } from '@testing-library/react';

import RadioGroup from '../../radio-group';

const sampleOptions = [
	{ name: 'test', value: '1', label: 'one' },
	{ name: 'test', value: '2', label: 'two' },
	{ name: 'test', value: '3', label: 'three', isDisabled: true },
];

describe('@atlaskit/radio', () => {
	describe('RadioGroup', () => {
		describe('props', () => {
			describe('options prop', () => {
				it('renders a Radio with correct props for each option in the array', () => {
					render(<RadioGroup options={sampleOptions} />);
					expect(screen.getAllByRole('radio').length).toBe(sampleOptions.length);

					sampleOptions.forEach((option) => {
						const radio = screen.getByDisplayValue(option.value) as HTMLInputElement;
						expect(radio.name).toBe(option.name);
						expect(radio.value).toBe(option.value);
						if (Boolean(option.isDisabled)) {
							expect(radio).toBeDisabled();
						} else {
							expect(radio).toBeEnabled();
						}
					});
				});
			});
			describe('isDisabled prop', () => {
				it('is reflected to each Radio option', () => {
					const isDisabled = true;
					render(<RadioGroup isDisabled={isDisabled} options={sampleOptions} />);
					sampleOptions.forEach((option) => {
						expect(screen.getByDisplayValue(option.value) as HTMLInputElement).toBeDisabled();
					});
				});
				it('if set, overrides isDisabled values set on each option', () => {
					const isDisabled = true;
					render(
						<RadioGroup
							isDisabled={isDisabled}
							options={[
								...sampleOptions,
								{
									name: 'color',
									value: 'red',
									label: 'Red',
									isDisabled: false,
								},
							]}
						/>,
					);
					sampleOptions.forEach((option) => {
						expect(screen.getByDisplayValue(option.value) as HTMLInputElement).toBeDisabled();
					});
				});
			});
			describe('isRequired prop', () => {
				it('is reflected to each Radio option', () => {
					const isRequired = true;
					render(<RadioGroup isRequired={isRequired} options={sampleOptions} />);
					sampleOptions.forEach((option) => {
						expect(screen.getByDisplayValue(option.value) as HTMLInputElement).toBeRequired();
					});
				});
			});

			describe('name prop', () => {
				it('is reflected to each Radio option and takes precedence over the name property in options', () => {
					const testName = 'test-name';
					render(<RadioGroup name={testName} options={sampleOptions} />);
					sampleOptions.forEach((option) => {
						expect((screen.getByDisplayValue(option.value) as HTMLInputElement).name).toBe(
							testName,
						);
					});
				});

				it('name property in options is used if there is no name passed into RadioGroup', () => {
					render(<RadioGroup options={sampleOptions} />);
					sampleOptions.forEach((option) => {
						expect((screen.getByDisplayValue(option.value) as HTMLInputElement).name).toBe(
							option.name,
						);
					});
				});
			});

			describe('value prop', () => {
				it('sets the corresponding Radio instance isChecked prop to true', () => {
					render(<RadioGroup value={sampleOptions[0].value} options={sampleOptions} />);
					sampleOptions.forEach((option, index) => {
						if (index === 0) {
							expect(screen.getByDisplayValue(option.value) as HTMLInputElement).toBeChecked();
						} else {
							expect(screen.getByDisplayValue(option.value) as HTMLInputElement).not.toBeChecked();
						}
					});
				});
				it('Ignores internal state values, if a value prop is specified', () => {
					render(<RadioGroup value={sampleOptions[0].value} options={sampleOptions} />);

					sampleOptions.forEach((option, index) => {
						if (index === 0) {
							expect(screen.getByDisplayValue(option.value) as HTMLInputElement).toBeChecked();
						} else {
							expect(screen.getByDisplayValue(option.value) as HTMLInputElement).not.toBeChecked();
						}
					});

					const secondRadio = screen.getByDisplayValue(sampleOptions[1].value);
					fireEvent.click(secondRadio);

					sampleOptions.forEach((option, index) => {
						if (index === 0) {
							expect(screen.getByDisplayValue(option.value) as HTMLInputElement).toBeChecked();
						} else {
							expect(screen.getByDisplayValue(option.value) as HTMLInputElement).not.toBeChecked();
						}
					});
				});
				it('If set to undefined, it will revert to the value set in state', () => {
					const { rerender } = render(
						<RadioGroup value={sampleOptions[0].value} options={sampleOptions} />,
					);

					sampleOptions.forEach((option, index) => {
						if (index === 0) {
							expect(screen.getByDisplayValue(option.value) as HTMLInputElement).toBeChecked();
						} else {
							expect(screen.getByDisplayValue(option.value) as HTMLInputElement).not.toBeChecked();
						}
					});

					const secondRadio = screen.getByDisplayValue(sampleOptions[1].value);
					fireEvent.click(secondRadio);

					sampleOptions.forEach((option, index) => {
						if (index === 0) {
							expect(screen.getByDisplayValue(option.value) as HTMLInputElement).toBeChecked();
						} else {
							expect(screen.getByDisplayValue(option.value) as HTMLInputElement).not.toBeChecked();
						}
					});

					rerender(<RadioGroup options={sampleOptions} />);

					sampleOptions.forEach((option, index) => {
						if (index === 1) {
							expect(screen.getByDisplayValue(option.value) as HTMLInputElement).toBeChecked();
						} else {
							expect(screen.getByDisplayValue(option.value) as HTMLInputElement).not.toBeChecked();
						}
					});
				});

				it('does not select an option if not specified', () => {
					const options = [
						{ name: 'n', value: '0', label: 'zero' },
						{ name: 'n', value: '1', label: 'one' },
						{ name: 'n', value: '2', label: 'two' },
					];
					render(<RadioGroup options={options} />);
					options.forEach((option) => {
						expect(screen.getByDisplayValue(option.value) as HTMLInputElement).not.toBeChecked();
					});
				});

				it('can select a value which is disabled', () => {
					const options = [
						{ name: 'n', value: '0', label: 'zero' },
						{ name: 'n', value: '1', label: 'one' },
						{ name: 'n', value: '2', label: 'two', isDisabled: true },
					];
					render(<RadioGroup options={options} value="2" />);
					options.forEach((option, index) => {
						if (index === 2) {
							expect(screen.getByDisplayValue(option.value) as HTMLInputElement).toBeChecked();
						} else {
							expect(screen.getByDisplayValue(option.value) as HTMLInputElement).not.toBeChecked();
						}
					});
				});
			});

			describe('defaultValue prop', () => {
				it('initially sets the corresponding Radio instance isChecked prop to true', () => {
					render(<RadioGroup defaultValue={sampleOptions[0].value} options={sampleOptions} />);

					sampleOptions.forEach((option, index) => {
						if (index === 0) {
							expect(screen.getByDisplayValue(option.value) as HTMLInputElement).toBeChecked();
						} else {
							expect(screen.getByDisplayValue(option.value) as HTMLInputElement).not.toBeChecked();
						}
					});
				});
				it('overrides the checked Radio instance once a subsequent Radio has been triggered', () => {
					render(<RadioGroup defaultValue={sampleOptions[0].value} options={sampleOptions} />);

					sampleOptions.forEach((option, index) => {
						if (index === 0) {
							expect(screen.getByDisplayValue(option.value) as HTMLInputElement).toBeChecked();
						} else {
							expect(screen.getByDisplayValue(option.value) as HTMLInputElement).not.toBeChecked();
						}
					});

					fireEvent.click(screen.getByDisplayValue('2'));

					sampleOptions.forEach((option, index) => {
						if (index === 1) {
							expect(screen.getByDisplayValue(option.value) as HTMLInputElement).toBeChecked();
						} else {
							expect(screen.getByDisplayValue(option.value) as HTMLInputElement).not.toBeChecked();
						}
					});
				});
			});

			describe('onChange prop', () => {
				it('is called once  a radio option is changed', () => {
					const spy = jest.fn();
					render(<RadioGroup onChange={spy} options={sampleOptions} />);
					fireEvent.click(screen.getByDisplayValue('1'));
					expect(spy).toHaveBeenCalledTimes(1);
				});

				it('calls onChange with the right value', () => {
					let value = '';
					render(
						<RadioGroup
							onChange={(e) => {
								value = e.currentTarget.value;
							}}
							options={sampleOptions}
						/>,
					);
					fireEvent.click(screen.getByDisplayValue('1'));
					expect(value).toBe('1');
				});
			});

			describe('testId prop', () => {
				it('is set on RadioGroup and Radio options', () => {
					render(<RadioGroup testId="some-test-id" options={sampleOptions} />);

					const radioGroup = screen.getByTestId('some-test-id');
					expect(radioGroup).toBeInTheDocument();

					const radioInput = screen.getAllByTestId('some-test-id--radio-input');
					expect(radioInput).toHaveLength(3);

					const radioLabel = screen.getAllByTestId('some-test-id--radio-label');
					expect(radioLabel).toHaveLength(3);
				});

				it('prefers `testId` set on Radio options over RadioGroup prop', () => {
					render(
						<RadioGroup
							testId="should-only-be-set-on-root-element"
							options={[
								{
									name: 'test',
									testId: 'should-be-set-on-children',
									value: '1',
									label: 'one',
								},
								{
									name: 'test',
									testId: 'should-be-set-on-children',
									value: '2',
									label: 'two',
								},
							]}
						/>,
					);

					const ignoredTestId = screen.getByTestId('should-only-be-set-on-root-element');
					expect(ignoredTestId).toBeInTheDocument();

					const radioInput = screen.getAllByTestId('should-be-set-on-children--radio-input');
					expect(radioInput).toHaveLength(2);

					const radioLabel = screen.getAllByTestId('should-be-set-on-children--radio-label');
					expect(radioLabel).toHaveLength(2);
				});
			});
		});
	});
});
