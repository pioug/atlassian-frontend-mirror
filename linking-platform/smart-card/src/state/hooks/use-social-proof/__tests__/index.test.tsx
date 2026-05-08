import { renderHook } from '@atlassian/testing-library';

jest.mock('../../../services/current-site-cloud-id', () => ({
	getCurrentSiteCloudId: jest.fn(),
	getCurrentSiteCloudIdSync: jest.fn(),
}));

jest.mock('../../../services/personalization', () => ({
	getProviderPctMap: jest.fn(),
	getProviderPctMapSync: jest.fn(),
	SOCIAL_PROOF_TRAIT_NAME: 'sl_3p_connected_providers_site_pct',
}));

import {
	getCurrentSiteCloudId,
	getCurrentSiteCloudIdSync,
} from '../../../services/current-site-cloud-id';
import { getProviderPctMap, getProviderPctMapSync } from '../../../services/personalization';
import useSocialProof from '../index';

const mockGetCurrentSiteCloudId = getCurrentSiteCloudId as jest.MockedFunction<
	typeof getCurrentSiteCloudId
>;
const mockGetCurrentSiteCloudIdSync = getCurrentSiteCloudIdSync as jest.MockedFunction<
	typeof getCurrentSiteCloudIdSync
>;
const mockGetProviderPctMap = getProviderPctMap as jest.MockedFunction<typeof getProviderPctMap>;
const mockGetProviderPctMapSync = getProviderPctMapSync as jest.MockedFunction<
	typeof getProviderPctMapSync
>;

describe('useSocialProof', () => {
	beforeEach(() => {
		jest.clearAllMocks();
		mockGetCurrentSiteCloudId.mockResolvedValue('cloud-abc');
		mockGetCurrentSiteCloudIdSync.mockReturnValue('cloud-abc');
		mockGetProviderPctMap.mockResolvedValue(undefined);
		mockGetProviderPctMapSync.mockReturnValue(null);
	});

	describe('when killswitch is off', () => {
		it('returns not-enabled result without fetching any data', () => {
			const hookResult = renderHook(() => useSocialProof('google-object-provider', false));

			expect(hookResult.current.isEnabled).toBe(false);
			expect(hookResult.current.isLoading).toBe(false);
			expect(hookResult.current.connectedPct).toBeUndefined();
			expect(mockGetCurrentSiteCloudIdSync).not.toHaveBeenCalled();
			expect(mockGetProviderPctMapSync).not.toHaveBeenCalled();
			expect(mockGetCurrentSiteCloudId).not.toHaveBeenCalled();
			expect(mockGetProviderPctMap).not.toHaveBeenCalled();
		});
	});

	describe('when killswitch is on', () => {
		describe('cold cache (first page visit)', () => {
			it('returns undefined connectedPct when localStorage has no data', () => {
				mockGetProviderPctMapSync.mockReturnValue(null);

				const hookResult = renderHook(() => useSocialProof('google-object-provider', true));

				expect(hookResult.current.isEnabled).toBe(false);
				expect(hookResult.current.isLoading).toBe(false);
				expect(hookResult.current.connectedPct).toBeUndefined();
				expect(mockGetCurrentSiteCloudIdSync).toHaveBeenCalledWith('');
				expect(mockGetProviderPctMapSync).toHaveBeenCalledWith(
					'cloud-abc',
					'sl_3p_connected_providers_site_pct',
				);
			});

			it('kicks off async fetch to warm localStorage for next visit', () => {
				mockGetProviderPctMapSync.mockReturnValue(null);

				renderHook(() => useSocialProof('google-object-provider', true));

				expect(mockGetCurrentSiteCloudId).toHaveBeenCalledWith('');
				expect(mockGetProviderPctMap).not.toHaveBeenCalled();
			});
		});

		describe('warm cache (subsequent page visit)', () => {
			it('returns connectedPct immediately from localStorage', () => {
				mockGetProviderPctMapSync.mockReturnValue({
					'google-object-provider': 52,
				});

				const hookResult = renderHook(() => useSocialProof('google-object-provider', true));

				expect(hookResult.current.isEnabled).toBe(true);
				expect(hookResult.current.isLoading).toBe(false);
				expect(hookResult.current.connectedPct).toBe(52);
			});

			it('still kicks off background refresh for future mounts', async () => {
				mockGetProviderPctMapSync.mockReturnValue({
					'google-object-provider': 52,
				});

				renderHook(() => useSocialProof('google-object-provider', true));

				expect(mockGetCurrentSiteCloudId).toHaveBeenCalledWith('');
				expect(mockGetProviderPctMap).not.toHaveBeenCalled();

				await Promise.resolve();

				expect(mockGetProviderPctMap).toHaveBeenCalledWith(
					'cloud-abc',
					'sl_3p_connected_providers_site_pct',
				);
			});

			it('returns undefined connectedPct when extensionKey is not in the map', () => {
				mockGetProviderPctMapSync.mockReturnValue({
					'dropbox-object-provider': 30,
				});

				const hookResult = renderHook(() => useSocialProof('google-object-provider', true));

				expect(hookResult.current.connectedPct).toBeUndefined();
			});

			it('returns undefined connectedPct when extensionKey is missing', () => {
				mockGetProviderPctMapSync.mockReturnValue({
					'google-object-provider': 52,
				});

				const hookResult = renderHook(() => useSocialProof(undefined, true));

				expect(hookResult.current.connectedPct).toBeUndefined();
			});
		});

		it('warms personalization after async cloudId resolves for future mounts only', async () => {
			mockGetProviderPctMapSync.mockReturnValue(null);

			const hookResult = renderHook(() =>
				useSocialProof('google-object-provider', true, 'https://site.example'),
			);

			expect(hookResult.current.connectedPct).toBeUndefined();
			expect(mockGetCurrentSiteCloudId).toHaveBeenCalledWith('https://site.example');

			await Promise.resolve();

			expect(mockGetProviderPctMap).toHaveBeenCalledWith(
				'cloud-abc',
				'sl_3p_connected_providers_site_pct',
			);
			expect(hookResult.current.connectedPct).toBeUndefined();
		});

		it('keeps mount-stable snapshot after async warm completes', async () => {
			mockGetProviderPctMapSync.mockReturnValue(null);
			mockGetProviderPctMap.mockResolvedValue({ 'google-object-provider': 52 });

			const hookResult = renderHook(() => useSocialProof('google-object-provider', true));

			await Promise.resolve();

			expect(hookResult.current.connectedPct).toBeUndefined();
			expect(mockGetProviderPctMapSync).toHaveBeenCalledTimes(1);
		});

		it('does not expose data when cloud id is missing even if a map exists for another site', () => {
			mockGetCurrentSiteCloudIdSync.mockReturnValue(undefined);
			mockGetProviderPctMapSync.mockReturnValue(null);

			const hookResult = renderHook(() => useSocialProof('google-object-provider', true));

			expect(hookResult.current.isEnabled).toBe(false);
			expect(hookResult.current.connectedPct).toBeUndefined();
			expect(mockGetProviderPctMapSync).toHaveBeenCalledWith(
				undefined,
				'sl_3p_connected_providers_site_pct',
			);
		});

		it('isLoading is always false (sync read)', () => {
			mockGetProviderPctMapSync.mockReturnValue(null);

			const hookResult = renderHook(() => useSocialProof('google-object-provider', true));

			expect(hookResult.current.isLoading).toBe(false);
		});
	});
});
