import { isFedrampModerate } from '@atlaskit/atlassian-context';

import { __resetFedrampOverrideCacheForTests, setUFOConfig } from '../../config';

import { VCObserver } from './index';

jest.mock('@atlaskit/atlassian-context', () => ({
	isFedrampModerate: jest.fn(),
}));

// Light mock for the underlying Observers class so this test focuses purely
// on the selectorConfig wiring inside the legacy `VCObserver` constructor.
jest.mock('./observers', () => ({
	Observers: jest.fn().mockImplementation((opts) => ({
		__opts: opts,
		isBrowserSupported: () => false,
		subscribeResults: jest.fn(),
		observe: jest.fn(),
		disconnect: jest.fn(),
	})),
}));

const mockedIsFedrampModerate = isFedrampModerate as jest.Mock;

const FORCED_OFF_SELECTOR_CONFIG = {
	id: false,
	testId: false,
	role: false,
	className: false,
	dataVC: false,
} as const;

const LEGACY_DEFAULT_SELECTOR_CONFIG = {
	id: false,
	testId: false,
	role: false,
	className: true,
	dataVC: true,
} as const;

const buildConfigWith = (selectorConfig?: Record<string, boolean>) => ({
	product: 'testProduct',
	region: 'testRegion',
	vc: {
		enabled: true,
		selectorConfig,
	},
});

describe('VCObserver (legacy) — FedRAMP selectorConfig override', () => {
	beforeEach(() => {
		// Reset configuration and cached perimeter-detection result so each
		// test starts from a known state.
		// @ts-expect-error - intentionally reset to undefined for tests
		setUFOConfig(undefined);
		__resetFedrampOverrideCacheForTests();
		mockedIsFedrampModerate.mockReset();
		mockedIsFedrampModerate.mockReturnValue(false);
	});

	it('uses the legacy hard-coded default when no caller config is provided and FedRAMP is inactive', () => {
		setUFOConfig(buildConfigWith(undefined) as any);

		const observer = new VCObserver({} as any);
		// @ts-expect-error - reaching into the mocked Observers instance for assertion
		expect(observer.observers.__opts.selectorConfig).toEqual(LEGACY_DEFAULT_SELECTOR_CONFIG);
	});

	it('FedRAMP override wins over caller-provided selectorConfig', () => {
		// FedRAMP override has the HIGHEST priority — even an explicit
		// caller-provided `selectorConfig` is overridden to the all-false
		// config. This is intentional: we never want a misconfigured caller
		// to defeat the FedRAMP perimeter scrubbing.
		mockedIsFedrampModerate.mockReturnValue(true);

		const explicit = { id: true, testId: true, role: true, className: true, dataVC: true };
		const observer = new VCObserver({ selectorConfig: explicit } as any);
		// @ts-expect-error - reaching into the mocked Observers instance for assertion
		expect(observer.observers.__opts.selectorConfig).toEqual(FORCED_OFF_SELECTOR_CONFIG);
	});

	it('uses the caller-provided selectorConfig when not in FedRAMP', () => {
		mockedIsFedrampModerate.mockReturnValue(false);

		const explicit = { id: true, testId: true, role: true, className: true, dataVC: true };
		const observer = new VCObserver({ selectorConfig: explicit } as any);
		// @ts-expect-error - reaching into the mocked Observers instance for assertion
		expect(observer.observers.__opts.selectorConfig).toEqual(explicit);
	});

	it('returns the FedRAMP all-false override when no caller config is provided and FedRAMP is active', () => {
		mockedIsFedrampModerate.mockReturnValue(true);
		setUFOConfig(buildConfigWith(undefined) as any);

		const observer = new VCObserver({} as any);
		// @ts-expect-error - reaching into the mocked Observers instance for assertion
		expect(observer.observers.__opts.selectorConfig).toEqual(FORCED_OFF_SELECTOR_CONFIG);
	});

	it('returns the configured selectorConfig from setUFOConfig when no caller-provided override and FedRAMP is inactive', () => {
		const configured = { id: true, testId: false, role: false, className: false, dataVC: false };
		setUFOConfig(buildConfigWith(configured) as any);

		const observer = new VCObserver({} as any);
		// @ts-expect-error - reaching into the mocked Observers instance for assertion
		expect(observer.observers.__opts.selectorConfig).toEqual(configured);
	});

	it('overrides any configured selectorConfig with all-false when FedRAMP is active', () => {
		mockedIsFedrampModerate.mockReturnValue(true);
		const configured = { id: true, testId: true, role: true, className: true, dataVC: true };
		setUFOConfig(buildConfigWith(configured) as any);

		const observer = new VCObserver({} as any);
		// @ts-expect-error - reaching into the mocked Observers instance for assertion
		expect(observer.observers.__opts.selectorConfig).toEqual(FORCED_OFF_SELECTOR_CONFIG);
	});
});
