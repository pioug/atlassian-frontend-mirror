import React from 'react';

import { eeTest } from '@atlaskit/tmp-editor-statsig/editor-experiments-test-utils';
import { renderHook } from '@atlassian/testing-library';

import type { SocialProof } from '../../use-social-proof';
import useSocialProofExperiment, {
	getInlineSocialProofExperimentMeta,
	getSocialProofExperimentMeta,
	getSocialProofTier,
} from '../index';

const mockGetCurrentSiteCloudIdSync = jest.fn<string | undefined, [string | undefined]>();
const mockGetProviderPctMapSync = jest.fn<Record<string, number> | null, [string | undefined, string]>();

jest.mock('../../../services/current-site-cloud-id', () => ({
	getCurrentSiteCloudIdSync: (...args: [string | undefined]) => mockGetCurrentSiteCloudIdSync(...args),
}));

jest.mock('../../../services/personalization', () => ({
	getProviderPctMapSync: (...args: [string | undefined, string]) => mockGetProviderPctMapSync(...args),
	SOCIAL_PROOF_TRAIT_NAME: 'sl_3p_connected_providers_site_pct',
}));

const mockUseSocialProof = jest.fn<
	SocialProof,
	[string | undefined, boolean, string | undefined]
>();
jest.mock('../../use-social-proof', () => ({
	__esModule: true,
	default: (...args: [string | undefined, boolean, string | undefined]) =>
		mockUseSocialProof(...args),
}));

const wrapper = ({ children }: { children: React.ReactNode }) => (
	<React.StrictMode>{children}</React.StrictMode>
);

const MOCK_EXTENSION_KEY = 'google-object-provider';

const socialProofResult = (overrides: Partial<SocialProof> = {}): SocialProof => ({
	connectedPct: undefined,
	isEnabled: true,
	isLoading: false,
	...overrides,
});

describe('useSocialProofExperiment', () => {
	beforeEach(() => {
		jest.clearAllMocks();
		mockUseSocialProof.mockReturnValue(socialProofResult());
		mockGetCurrentSiteCloudIdSync.mockReturnValue('cloud-id');
		mockGetProviderPctMapSync.mockReturnValue({ [MOCK_EXTENSION_KEY]: 45 });
	});

	it('delegates to useSocialProof with extensionKey, isKillswitchOn=true, and base URI', () => {
		renderHook(() => useSocialProofExperiment(MOCK_EXTENSION_KEY, 'https://site.example'), {
			wrapper,
		});
		expect(mockUseSocialProof).toHaveBeenCalledWith(
			MOCK_EXTENSION_KEY,
			true,
			'https://site.example',
		);
	});

	it('returns isTreatment=false when useSocialProof is still loading', () => {
		mockUseSocialProof.mockReturnValue(socialProofResult({ isLoading: true }));

		const result = renderHook(() => useSocialProofExperiment(MOCK_EXTENSION_KEY), { wrapper });

		expect(result.current.isTreatment).toBe(false);
	});

	it('returns isTreatment=false when useSocialProof is not enabled', () => {
		mockUseSocialProof.mockReturnValue(socialProofResult({ isEnabled: false }));

		const result = renderHook(() => useSocialProofExperiment(MOCK_EXTENSION_KEY), { wrapper });

		expect(result.current.isTreatment).toBe(false);
	});

	it('returns isTreatment=false when connectedPct is undefined', () => {
		mockUseSocialProof.mockReturnValue(socialProofResult({ connectedPct: undefined }));

		const result = renderHook(() => useSocialProofExperiment(MOCK_EXTENSION_KEY), { wrapper });
		expect(result.current.isTreatment).toBe(false);
		expect(result.current.tier).toBe('low');
		expect(result.current.connectedPct).toBeUndefined();
	});

	it('returns isTreatment=false when provider is not in trait data', () => {
		mockUseSocialProof.mockReturnValue(socialProofResult({ connectedPct: undefined }));

		const result = renderHook(() => useSocialProofExperiment('slack-object-provider'), { wrapper });
		expect(result.current.isTreatment).toBe(false);
		expect(result.current.tier).toBe('low');
	});

	eeTest.describe('social_proof_3p_unauth_block_exp', 'experiment enabled').variant(true, () => {
		it('returns isTreatment=true when loaded with social proof data', () => {
			mockUseSocialProof.mockReturnValue(socialProofResult({ connectedPct: 45 }));

			const result = renderHook(() => useSocialProofExperiment(MOCK_EXTENSION_KEY), { wrapper });

			expect(result.current.isTreatment).toBe(true);
			expect(result.current.connectedPct).toBe(45);
			expect(result.current.tier).toBe('not-low');
		});
	});

	eeTest.describe('social_proof_3p_unauth_block_exp', 'experiment disabled').variant(false, () => {
		it('returns isTreatment=false when experiment is off', () => {
			mockUseSocialProof.mockReturnValue(socialProofResult({ connectedPct: 45 }));

			const result = renderHook(() => useSocialProofExperiment(MOCK_EXTENSION_KEY), { wrapper });

			expect(result.current.isTreatment).toBe(false);
		});
	});

	describe('tier calculation', () => {
		it('returns undefined when adoption is unavailable', () => {
			expect(getSocialProofTier()).toBeUndefined();
		});

		it('returns not-low tier when adoption >= 30%', () => {
			expect(getSocialProofTier(45)).toBe('not-low');
		});

		it('returns not-low tier when adoption is exactly 30%', () => {
			expect(getSocialProofTier(30)).toBe('not-low');
		});

		it('returns low tier when adoption < 30%', () => {
			expect(getSocialProofTier(15)).toBe('low');
		});
	});

	describe('experiment metadata helpers', () => {
		it('returns ineligible meta when extension key is missing', () => {
			expect(getSocialProofExperimentMeta({})).toEqual({
				social_proof_3p_unauth_block_exp: { isEligible: false },
			});
			expect(mockGetCurrentSiteCloudIdSync).not.toHaveBeenCalled();
			expect(mockGetProviderPctMapSync).not.toHaveBeenCalled();
		});

		it('returns eligible not-low tier meta from cached provider data', () => {
			expect(
				getSocialProofExperimentMeta({
					extensionKey: MOCK_EXTENSION_KEY,
					baseUriWithNoTrailingSlash: 'https://site.example',
				}),
			).toEqual({
				social_proof_3p_unauth_block_exp: { isEligible: true, tier: 'not-low' },
			});

			expect(mockGetCurrentSiteCloudIdSync).toHaveBeenCalledWith('https://site.example');
			expect(mockGetProviderPctMapSync).toHaveBeenCalledWith(
				'cloud-id',
				'sl_3p_connected_providers_site_pct',
			);
		});

		it('returns eligible low tier meta from cached provider data', () => {
			mockGetProviderPctMapSync.mockReturnValue({ [MOCK_EXTENSION_KEY]: 15 });

			expect(getSocialProofExperimentMeta({ extensionKey: MOCK_EXTENSION_KEY })).toEqual({
				social_proof_3p_unauth_block_exp: { isEligible: true, tier: 'low' },
			});
		});

		it('returns ineligible meta when cached cloud id is missing', () => {
			mockGetCurrentSiteCloudIdSync.mockReturnValue(undefined);
			mockGetProviderPctMapSync.mockReturnValue(null);

			expect(getSocialProofExperimentMeta({ extensionKey: MOCK_EXTENSION_KEY })).toEqual({
				social_proof_3p_unauth_block_exp: { isEligible: false },
			});
		});

		it('returns ineligible meta when provider is missing from cached trait data', () => {
			mockGetProviderPctMapSync.mockReturnValue({ 'slack-object-provider': 40 });

			expect(getSocialProofExperimentMeta({ extensionKey: MOCK_EXTENSION_KEY })).toEqual({
				social_proof_3p_unauth_block_exp: { isEligible: false },
			});
		});

		it('returns inline experiment meta under the inline Statsig key', () => {
			expect(getInlineSocialProofExperimentMeta({ extensionKey: MOCK_EXTENSION_KEY })).toEqual({
				platform_sl_3p_preauth_social_proof_inline_cta: {
					isEligible: true,
					tier: 'not-low',
				},
			});
		});
	});
});
