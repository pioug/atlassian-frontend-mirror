import React, { type ReactPortal } from 'react';

import { renderHook, type RenderHookOptions, waitFor } from '@testing-library/react';
import ReactDOM from 'react-dom';
import { IntlProvider } from 'react-intl-next';

import { AnalyticsListener } from '@atlaskit/analytics-next';
import { FlagsProvider } from '@atlaskit/flag';

import { EVENT_CHANNEL } from '../../analytics';
import { type LoadOptionsProps, useLoadOptions } from '../useLoadOptions';

const mockShowErrorFlag = jest.fn();
const mockExecuteFetch = jest.fn();
const onAnalyticFireEvent = jest.fn();
const mockUseDatasourceTableFlag = jest.fn();

describe('useLoadOptions', () => {
	const wrapper: RenderHookOptions<{}>['wrapper'] = ({ children }) => (
		<IntlProvider locale="en">
			<FlagsProvider>
				<AnalyticsListener channel={EVENT_CHANNEL} onEvent={onAnalyticFireEvent}>
					({children});
				</AnalyticsListener>
			</FlagsProvider>
		</IntlProvider>
	);

	const setup = (loaderProps: LoadOptionsProps<unknown>) => {
		mockUseDatasourceTableFlag.mockReturnValue({ showErrorFlag: mockShowErrorFlag });

		const { result, rerender } = renderHook(
			() => {
				return useLoadOptions(loaderProps);
			},
			{ wrapper },
		);

		return {
			result,
			rerender,
		};
	};

	beforeEach(() => {
		jest.clearAllMocks();
	});

	beforeAll(() => {
		ReactDOM.createPortal = jest.fn((element, node, key) => {
			return (<div key={key}>{element}</div>) as ReactPortal;
		});
	});

	describe('success', () => {
		it('should return the entities when executeFetch is provided and the fetch is successful', async () => {
			mockExecuteFetch.mockResolvedValue({
				operationStatus: 'SUCCESS',
				errors: [],
				entities: [
					{
						id: '1',
						name: 'Option 1',
					},
					{
						id: '2',
						name: 'Option 2',
					},
				],
			});

			const { result } = setup({ executeFetch: mockExecuteFetch });
			await waitFor(() => {
				const { options, isLoading, hasFailed } = result.current;

				expect(options).toEqual(
					expect.arrayContaining([
						{
							id: '1',
							name: 'Option 1',
						},
						{
							id: '2',
							name: 'Option 2',
						},
					]),
				);
				expect(hasFailed).toEqual(false);
				expect(isLoading).toEqual(false);
			});
		});

		it('should call executeFetch with inputs when provided', () => {
			setup({ fetchInputs: { id: '1' }, executeFetch: mockExecuteFetch });
			expect(mockExecuteFetch).toHaveBeenCalledWith({ id: '1' });
		});

		it('should return isLoading as true when initially loaded', () => {
			const { result } = setup({ executeFetch: mockExecuteFetch });
			const { isLoading } = result.current;
			expect(isLoading).toEqual(true);
		});

		it('should return isLoading as true when the fetch is in progress', async () => {
			const { result, rerender } = setup({ executeFetch: mockExecuteFetch });
			mockExecuteFetch.mockResolvedValue({
				operationStatus: 'SUCCESS',
				errors: [],
				entities: [
					{
						id: '1',
						name: 'Option 1',
					},
					{
						id: '2',
						name: 'Option 2',
					},
				],
			});
			rerender({ fetchInputs: { name: 'Option 3' }, executeFetch: mockExecuteFetch });
			await waitFor(() => {
				expect(result.current.isLoading).toEqual(true);
				expect(result.current.options).toEqual([]);
			});
		});
	});

	describe('failure', () => {
		it('When executeFetch is not provided options should return as an empty array', async () => {
			const { result } = setup({});

			await waitFor(() => {
				const { options, isLoading, hasFailed } = result.current;
				expect(options).toEqual([]);
				expect(isLoading).toEqual(false);
				expect(hasFailed).toEqual(false);
			});
		});

		it('should return an empty array when the fetch fails with response failure', async () => {
			mockExecuteFetch.mockResolvedValue({
				operationStatus: 'FAILURE',
				errors: [],
			});

			const { result } = setup({ executeFetch: mockExecuteFetch });

			await waitFor(() => {
				const { options, isLoading, hasFailed } = result.current;
				expect(options).toEqual([]);
				expect(isLoading).toEqual(false);
				expect(hasFailed).toEqual(true);
			});
		});

		it('should return an empty array when the fetch fails with error', async () => {
			const { result } = setup({ executeFetch: mockExecuteFetch });

			await waitFor(() => {
				const { options, isLoading, hasFailed } = result.current;
				expect(options).toEqual([]);
				expect(isLoading).toEqual(false);
				expect(hasFailed).toEqual(true);
			});
		});
	});
});
