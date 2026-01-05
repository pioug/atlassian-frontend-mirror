import React from 'react';

import { act, renderHook, waitFor } from '@testing-library/react';
import { IntlProvider } from 'react-intl-next';

import { asMock } from '@atlaskit/link-test-helpers/jest';

import {
	mockTransformedUserHydrationResponse,
	mockUserHydrationResponse,
} from '../../../../../services/mocks';
import { useBasicFilterAGG } from '../../../../../services/useBasicFilterAGG';
import { useBasicFilterHydration } from '../useBasicFilterHydration';

jest.mock('../../../../../services/useBasicFilterAGG');

const setup = (mockFn: () => void = () => mockUserHydrationResponse) => {
	const wrapper = ({ children }: { children?: React.ReactNode }) => (
		<IntlProvider locale="en">{children}</IntlProvider>
	);

	asMock(useBasicFilterAGG).mockReturnValue({
		getUsersFromAccountIDs: mockFn,
	});

	const { result, rerender } = renderHook(() => useBasicFilterHydration(), {
		wrapper,
	});
	return {
		result,
		rerender,
	};
};

describe('TESTING: useBasicFilterHydration hook', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('should return correct initial state', () => {
		const { result } = setup();

		expect(result.current).toEqual({
			hydrateUsersFromAccountIds: expect.any(Function),
			reset: expect.any(Function),
			status: 'empty',
			users: [],
		});
	});

	it('should should set the status as "loading" when hydrateUsersFromAccountIds is called and waiting for results', async () => {
		const { result } = setup();

		act(() => {
			result.current.hydrateUsersFromAccountIds([]);
		});
		
		await waitFor(() => {
			expect(result.current).toEqual({
				hydrateUsersFromAccountIds: expect.any(Function),
				reset: expect.any(Function),
				status: 'loading',
				users: [],
			});
		});
	});

	it('should should return correct data when API request is resolved', async () => {
		const { result } = setup();

		await act(async () => {
			result.current.hydrateUsersFromAccountIds([]);
		});

		await waitFor(() => {
			expect(result.current).toEqual({
				hydrateUsersFromAccountIds: expect.any(Function),
				reset: expect.any(Function),
				status: 'resolved',
				users: mockTransformedUserHydrationResponse,
			});
		});

		expect(result.current).toEqual({
			hydrateUsersFromAccountIds: expect.any(Function),
			reset: expect.any(Function),
			status: 'resolved',
			users: mockTransformedUserHydrationResponse,
		});
	});

	it('should reset hook state when reset() is called', async () => {
		const { result } = setup();

		await act(async () => {
			result.current.hydrateUsersFromAccountIds([]);
		});

		await waitFor(() => {
			expect(result.current).toEqual({
				hydrateUsersFromAccountIds: expect.any(Function),
				reset: expect.any(Function),
				status: 'resolved',
				users: mockTransformedUserHydrationResponse,
			});
		});

		await act(async () => {
			result.current.reset();
		});

		expect(result.current).toEqual({
			hydrateUsersFromAccountIds: expect.any(Function),
			reset: expect.any(Function),
			status: 'empty',
			users: [],
		});
	});

	it('should should set status as "rejected" when API request fails', async () => {
		const { result } = setup(() => {
			return {
				errors: [{}],
			};
		});

		await act(async () => {
			result.current.hydrateUsersFromAccountIds([]);
		});

		await waitFor(() => {
			expect(result.current).toEqual({
				hydrateUsersFromAccountIds: expect.any(Function),
				reset: expect.any(Function),
				status: 'rejected',
				users: [],
			});
		});
	});
});
