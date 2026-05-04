import { act, renderHook, waitFor } from '@atlassian/testing-library';

jest.mock('../../../services/personalization', () => ({
	getProviderPctMap: jest.fn(),
}));

import { getProviderPctMap } from '../../../services/personalization';
import useSocialProof from '../index';

const mockGetProviderPctMap = getProviderPctMap as jest.MockedFunction<typeof getProviderPctMap>;
const SOCIAL_PROOF_TRAIT_NAME = 'sl_3p_connected_providers_users_pct';

describe('useSocialProof', () => {
	beforeEach(() => {
		jest.clearAllMocks();
		mockGetProviderPctMap.mockResolvedValue(undefined);
	});

	describe('when killswitch is off', () => {
		it('returns not-enabled result without fetching any data', () => {
			const hookResult = renderHook(() =>
				useSocialProof(SOCIAL_PROOF_TRAIT_NAME, 'google-object-provider', false),
			);

			expect(hookResult.current.isEnabled).toBe(false);
			expect(hookResult.current.isLoading).toBe(false);
			expect(hookResult.current.connectedPct).toBeUndefined();
			expect(mockGetProviderPctMap).not.toHaveBeenCalled();
		});
	});

	describe('when killswitch is on', () => {
		it('fetches percentage and returns connectedPct', async () => {
			mockGetProviderPctMap.mockResolvedValue({ 'google-object-provider': 52 });

			const hookResult = renderHook(() =>
				useSocialProof(SOCIAL_PROOF_TRAIT_NAME, 'google-object-provider', true),
			);

			await waitFor(() => {
				expect(hookResult.current.isLoading).toBe(false);
			});

			expect(hookResult.current.isEnabled).toBe(true);
			expect(hookResult.current.connectedPct).toBe(52);
			expect(mockGetProviderPctMap).toHaveBeenCalledWith('sl_3p_connected_providers_users_pct');
		});

		it('returns connectedPct as undefined when extensionKey is not in the map', async () => {
			mockGetProviderPctMap.mockResolvedValue({ 'dropbox-object-provider': 30 });

			const hookResult = renderHook(() =>
				useSocialProof(SOCIAL_PROOF_TRAIT_NAME, 'google-object-provider', true),
			);

			await waitFor(() => {
				expect(hookResult.current.isLoading).toBe(false);
			});

			expect(hookResult.current.connectedPct).toBeUndefined();
		});

		it('returns connectedPct as undefined when extensionKey is missing', async () => {
			mockGetProviderPctMap.mockResolvedValue({ 'google-object-provider': 52 });

			const hookResult = renderHook(() =>
				useSocialProof(SOCIAL_PROOF_TRAIT_NAME, undefined, true),
			);

			await waitFor(() => {
				expect(hookResult.current.isLoading).toBe(false);
			});

			expect(hookResult.current.connectedPct).toBeUndefined();
		});

		it('starts loading then resolves connectedPct', async () => {
			let resolvePromise!: (value: Record<string, number>) => void;
			mockGetProviderPctMap.mockReturnValue(
				new Promise<Record<string, number>>((resolve) => {
					resolvePromise = resolve;
				}),
			);

			const hookResult = renderHook(() =>
				useSocialProof(SOCIAL_PROOF_TRAIT_NAME, 'google-object-provider', true),
			);

			expect(hookResult.current.isLoading).toBe(true);

			act(() => {
				resolvePromise({ 'google-object-provider': 42 });
			});

			await waitFor(() => {
				expect(hookResult.current.isLoading).toBe(false);
			});

			expect(hookResult.current.connectedPct).toBe(42);
		});

		it('reports loading while personalization is resolving', () => {
			mockGetProviderPctMap.mockReturnValue(new Promise<Record<string, number>>(() => {}));
			const hookResult = renderHook(() =>
				useSocialProof(SOCIAL_PROOF_TRAIT_NAME, 'google-object-provider', true),
			);

			expect(hookResult.current.isEnabled).toBe(true);
			expect(hookResult.current.isLoading).toBe(true);
			expect(mockGetProviderPctMap).toHaveBeenCalledWith('sl_3p_connected_providers_users_pct');
		});
	});
});
