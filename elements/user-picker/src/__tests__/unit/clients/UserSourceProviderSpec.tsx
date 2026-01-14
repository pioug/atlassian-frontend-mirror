import { renderHook, waitFor } from '@testing-library/react';
import { useUserSource } from '../../../clients/UserSourceProvider';
import { type UserSourceResult } from '../../../types';
import { createMockedSourceProvider } from '../_testUtils';

describe('UserSourceProvider', () => {
	describe('useUserSource hook', () => {
		it('returns loading: false when no function provided and no sources by default', () => {
			const { result, rerender } = renderHook(() => useUserSource('1234', true));
			const { sources, loading } = result.current;
			rerender();
			expect(loading).toStrictEqual(false);
			expect(sources).toHaveLength(0);
		});
		it('returns initial sources by default if passed as props', () => {
			const { result, rerender } = renderHook(() => useUserSource('1234', true, ['microsoft']));
			const { sources, loading } = result.current;
			rerender();
			expect(loading).toStrictEqual(false);
			expect(sources).toEqual(['microsoft']);
		});
		it('returns initial sources by default if argument indicating that sources do not need to be fetched', () => {
			const { result, rerender } = renderHook(() => useUserSource('1234', false, ['microsoft']));
			const { sources, loading } = result.current;
			rerender();
			expect(loading).toStrictEqual(false);
			expect(sources).toEqual(['microsoft']);
		});
		it('sets loading to false when sources have finished fetching', async () => {
			const mockFetch = jest.fn(
				() =>
					new Promise<UserSourceResult[]>((resolve) => {
						resolve([
							{
								sourceId: '1234',
								sourceType: 'microsoft',
							},
						]);
					}),
			);
			const { result, rerender } = renderHook(
				() => useUserSource('1234', true),
				{
					wrapper: createMockedSourceProvider(mockFetch),
				},
			);

			expect(mockFetch).toHaveBeenCalled();
			expect(result.current.loading).toStrictEqual(true);
			expect(result.current.sources).toHaveLength(0);

			rerender();
			await waitFor(() => {
				expect(result.current.loading).toStrictEqual(false);
			});
			rerender();
			await waitFor(() => {
				expect(result.current.sources).toHaveLength(1);
				expect(result.current.sources).toEqual(['microsoft']);
			});
		});
		it('sets loading to false and returns an error if thrown', async () => {
			const mockFetch = jest.fn(
				() =>
					new Promise<UserSourceResult[]>((resolve, reject) => {
						reject('Unexpected error');
					}),
			);
			const { result, rerender } = renderHook(
				() => useUserSource('1234', true),
				{
					wrapper: createMockedSourceProvider(mockFetch),
				},
			);

			expect(mockFetch).toHaveBeenCalled();
			expect(result.current.loading).toStrictEqual(true);

			rerender();
			await waitFor(() => {
				expect(result.current.loading).toStrictEqual(false);
			});
			rerender();
			await waitFor(() => {
				expect(result.current.sources).toHaveLength(0);
				expect(result.current.error).toStrictEqual('Unexpected error');
			});
		});
	});
});
