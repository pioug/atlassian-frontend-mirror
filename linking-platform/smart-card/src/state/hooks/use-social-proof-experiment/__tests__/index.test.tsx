import React from 'react';

import { eeTest } from '@atlaskit/tmp-editor-statsig/editor-experiments-test-utils';
import { renderHook } from '@atlassian/testing-library';

import type { SocialProof } from '../../use-social-proof';
import useSocialProofExperiment from '../index';

const mockUseSocialProof = jest.fn<SocialProof, [string | undefined, boolean, string | undefined]>();
jest.mock('../../use-social-proof', () => ({
	__esModule: true,
	default: (...args: [string | undefined, boolean, string | undefined]) => mockUseSocialProof(...args),
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
	});

	it('delegates to useSocialProof with extensionKey, isKillswitchOn=true, and base URI', () => {
		renderHook(() => useSocialProofExperiment(MOCK_EXTENSION_KEY, 'https://site.example'), { wrapper });
		expect(mockUseSocialProof).toHaveBeenCalledWith(MOCK_EXTENSION_KEY, true, 'https://site.example');
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

	eeTest
		.describe('social_proof_3p_unauth_block_exp', 'experiment enabled')
		.variant(true, () => {
			it('returns isTreatment=true when loaded with social proof data', () => {
				mockUseSocialProof.mockReturnValue(socialProofResult({ connectedPct: 45 }));

				const result = renderHook(() => useSocialProofExperiment(MOCK_EXTENSION_KEY), { wrapper });

				expect(result.current.isTreatment).toBe(true);
				expect(result.current.connectedPct).toBe(45);
				expect(result.current.tier).toBe('not-low');
			});
		});

	eeTest
		.describe('social_proof_3p_unauth_block_exp', 'experiment disabled')
		.variant(false, () => {
			it('returns isTreatment=false when experiment is off', () => {
				mockUseSocialProof.mockReturnValue(socialProofResult({ connectedPct: 45 }));

				const result = renderHook(() => useSocialProofExperiment(MOCK_EXTENSION_KEY), { wrapper });

				expect(result.current.isTreatment).toBe(false);
			});
		});

	describe('tier calculation', () => {
		eeTest
			.describe('social_proof_3p_unauth_block_exp', 'tier with treatment')
			.variant(true, () => {
				it('returns not-low tier when adoption >= 30%', () => {
					mockUseSocialProof.mockReturnValue(socialProofResult({ connectedPct: 45 }));

					const result = renderHook(() => useSocialProofExperiment(MOCK_EXTENSION_KEY), { wrapper });
					expect(result.current.tier).toBe('not-low');
				});

				it('returns not-low tier when adoption is exactly 30%', () => {
					mockUseSocialProof.mockReturnValue(socialProofResult({ connectedPct: 30 }));

					const result = renderHook(() => useSocialProofExperiment(MOCK_EXTENSION_KEY), { wrapper });
					expect(result.current.tier).toBe('not-low');
				});

				it('returns low tier when adoption < 30%', () => {
					mockUseSocialProof.mockReturnValue(socialProofResult({ connectedPct: 15 }));

					const result = renderHook(() => useSocialProofExperiment(MOCK_EXTENSION_KEY), { wrapper });
					expect(result.current.tier).toBe('low');
				});
			});
	});
});
