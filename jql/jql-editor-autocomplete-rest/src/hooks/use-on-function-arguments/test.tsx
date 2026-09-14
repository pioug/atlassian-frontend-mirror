import React, { useRef } from 'react';
import { act } from 'react';

import { render } from '@testing-library/react';
import { IntlProvider } from 'react-intl';
import { empty } from 'rxjs/observable/empty';
import { of } from 'rxjs/observable/of';

import type { AutocompleteOptions } from '@atlaskit/jql-editor-common/autocomplete/types';
import { failGate, passGate } from '@atlassian/feature-flags-test-utils/mock-gates';

import useOnFunctionArguments from './index';

// eslint-disable-next-line @atlassian/a11y/require-jest-coverage
describe('onFunctionArguments', () => {
	afterEach(() => {
		jest.clearAllMocks();
	});

	const onNext = jest.fn();
	const onValues = jest.fn();

	type OnFunctionArgumentsConsumerProps = {
		done: jest.DoneCallback;
		fieldName?: string;
		fieldValue: string;
		functionName: string;
		onAssert: (options: AutocompleteOptions) => void;
	};

	const OnFunctionArgumentsConsumer = ({
		fieldName = '',
		fieldValue,
		functionName,
		onAssert,
		done,
	}: OnFunctionArgumentsConsumerProps) => {
		const onFunctionArguments = useOnFunctionArguments(onValues);
		const options = useRef<AutocompleteOptions>([]);

		onFunctionArguments(fieldName, fieldValue, functionName).subscribe({
			next: (data) => {
				onNext();
				options.current = data;
			},
			complete: () => {
				try {
					onAssert(options.current);
					done();
				} catch (e) {
					done(e);
				}
			},
		});

		return null;
	};

	describe('membersOf', () => {
		it('delegates membersOf arguments to onValues using the Team field when the gate is on', (done) => {
			passGate('enable-jql-membersof-autocomplete');

			const expectedOptions: AutocompleteOptions = [
				{ name: 'Team Rocket', value: 'team-rocket', valueType: 'team' },
			];
			onValues.mockReturnValue(of(expectedOptions));

			const assertValues = (options: AutocompleteOptions) => {
				expect(onValues).toHaveBeenCalledWith('rock', '"Team[Team]"', 'membersof');
				// The value should be prefixed with "id:" for membersOf so the JQL parser can
				// distinguish team IDs from group name.
				expect(options).toEqual(
					expectedOptions.map((option) => ({
						...option,
						value: `id:${option.value}`,
						groupKey: 'team',
					})),
				);
			};

			act(() => {
				render(
					<IntlProvider locale="en">
						<OnFunctionArgumentsConsumer
							fieldValue="rock"
							functionName="membersOf"
							onAssert={assertValues}
							done={done}
						/>
					</IntlProvider>,
				);
			});
		});

		it('returns no values for membersOf when the gate is off', (done) => {
			failGate('enable-jql-membersof-autocomplete');

			onValues.mockReturnValue(of([{ name: 'Team Rocket', value: 'team-rocket' }]));

			const assertValues = (options: AutocompleteOptions) => {
				expect(onValues).not.toHaveBeenCalled();
				expect(onNext).not.toHaveBeenCalled();
				expect(options).toEqual([]);
			};

			act(() => {
				render(
					<IntlProvider locale="en">
						<OnFunctionArgumentsConsumer
							fieldValue="rock"
							functionName="membersOf"
							onAssert={assertValues}
							done={done}
						/>
					</IntlProvider>,
				);
			});
		});
	});

	describe('descendantsOfTeam', () => {
		it('delegates descendantsOfTeam arguments to onValues using the Team field when the gate is on', (done) => {
			passGate('jira-descendants-of-team-jql-function');

			const expectedOptions: AutocompleteOptions = [
				{ name: 'Team Rocket', value: 'team-rocket', valueType: 'team' },
			];
			onValues.mockReturnValue(of(expectedOptions));

			const assertValues = (options: AutocompleteOptions) => {
				expect(onValues).toHaveBeenCalledWith('rock', '"Team[Team]"', 'descendantsofteam');
				expect(options).toEqual(
					expectedOptions.map((option) => ({
						...option,
						value: `id:${option.value}`,
						groupKey: 'team',
					})),
				);
			};

			act(() => {
				render(
					<IntlProvider locale="en">
						<OnFunctionArgumentsConsumer
							fieldValue="rock"
							functionName="descendantsOfTeam"
							onAssert={assertValues}
							done={done}
						/>
					</IntlProvider>,
				);
			});
		});

		it('matches descendantsOfTeam case-insensitively when the gate is on', (done) => {
			passGate('jira-descendants-of-team-jql-function');

			const expectedOptions: AutocompleteOptions = [
				{ name: 'Team Rocket', value: 'team-rocket', valueType: 'team' },
			];
			onValues.mockReturnValue(of(expectedOptions));

			const assertValues = (options: AutocompleteOptions) => {
				expect(onValues).toHaveBeenCalledWith('rock', '"Team[Team]"', 'descendantsofteam');
				expect(options).toEqual(
					expectedOptions.map((option) => ({
						...option,
						value: `id:${option.value}`,
						groupKey: 'team',
					})),
				);
			};

			act(() => {
				render(
					<IntlProvider locale="en">
						<OnFunctionArgumentsConsumer
							fieldValue="rock"
							functionName="DeScEnDaNtSOfTeaM"
							onAssert={assertValues}
							done={done}
						/>
					</IntlProvider>,
				);
			});
		});

		it('returns no values for descendantsOfTeam when the gate is off', (done) => {
			failGate('jira-descendants-of-team-jql-function');

			onValues.mockReturnValue(of([{ name: 'Team Rocket', value: 'team-rocket' }]));

			const assertValues = (options: AutocompleteOptions) => {
				expect(onValues).not.toHaveBeenCalled();
				expect(onNext).not.toHaveBeenCalled();
				expect(options).toEqual([]);
			};

			act(() => {
				render(
					<IntlProvider locale="en">
						<OnFunctionArgumentsConsumer
							fieldValue="rock"
							functionName="descendantsOfTeam"
							onAssert={assertValues}
							done={done}
						/>
					</IntlProvider>,
				);
			});
		});
	});

	describe('non-team functions', () => {
		it('returns no values for non-team functions', (done) => {
			onValues.mockReturnValue(empty());

			const assertValues = (options: AutocompleteOptions) => {
				expect(onValues).not.toHaveBeenCalled();
				expect(onNext).not.toHaveBeenCalled();
				expect(options).toEqual([]);
			};

			act(() => {
				render(
					<IntlProvider locale="en">
						<OnFunctionArgumentsConsumer
							fieldValue="rock"
							functionName="currentUser"
							onAssert={assertValues}
							done={done}
						/>
					</IntlProvider>,
				);
			});
		});
	});
});
