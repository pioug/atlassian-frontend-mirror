import React, { useRef } from 'react';

import { render } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import { empty } from 'rxjs/observable/empty';
import { of } from 'rxjs/observable/of';

import { type AutocompleteOptions } from '@atlaskit/jql-editor-common';

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

	it('delegates membersOf arguments to onValues using the Team field', (done) => {
		const expectedOptions: AutocompleteOptions = [
			{ name: 'Team Rocket', value: 'team-rocket', valueType: 'team' },
		];
		onValues.mockReturnValue(of(expectedOptions));

		const assertValues = (options: AutocompleteOptions) => {
			expect(onValues).toHaveBeenCalledWith('rock', '"Team[Team]"');
			expect(options).toEqual(expectedOptions);
		};

		act(() => {
			render(
				<OnFunctionArgumentsConsumer
					fieldValue="rock"
					functionName="membersOf"
					onAssert={assertValues}
					done={done}
				/>,
			);
		});
	});

	it('returns no values for non-membersOf functions', (done) => {
		onValues.mockReturnValue(empty());

		const assertValues = (options: AutocompleteOptions) => {
			expect(onValues).not.toHaveBeenCalled();
			expect(onNext).not.toHaveBeenCalled();
			expect(options).toEqual([]);
		};

		act(() => {
			render(
				<OnFunctionArgumentsConsumer
					fieldValue="rock"
					functionName="currentUser"
					onAssert={assertValues}
					done={done}
				/>,
			);
		});
	});
});
