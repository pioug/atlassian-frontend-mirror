import {
	type Config,
	getAwaitBM3TTIList,
	getCapabilityRate,
	getConfig,
	getDoNotAbortActivePressInteraction,
	getDoNotAbortActivePressInteractionOnTransition,
	getEnabledVCRevisions,
	getExperimentalInteractionRate,
	getInteractionRate,
	getMostRecentVCRevision,
	getPostInteractionRate,
	getRemoveInteractionsUFOPrefixes,
	getRemovePageSegmentsUFOPrefixes,
	getTypingPerformanceTracingMethod,
	getUfoNameOverrides,
	isVCRevisionEnabled,
	setUFOConfig,
} from './index';

describe('UFO Configuration Module', () => {
	beforeEach(() => {
		// Reset configuration before each test
		// @ts-ignore
		setUFOConfig(undefined);
	});

	describe('setUFOConfig and getConfig', () => {
		it('should set and get the configuration correctly', () => {
			const config = { product: 'testProduct', region: 'testRegion' };
			setUFOConfig(config);
			expect(getConfig()).toEqual(config);
		});
	});

	describe('getEnabledVCRevisions', () => {
		it('should return default revision if VC config is enabled, but no `enabledVCRevisions` config is set', () => {
			const config: Config = {
				product: 'testProduct',
				region: 'testRegion',
				vc: { enabled: true },
			};
			setUFOConfig(config);
			expect(getEnabledVCRevisions()).toEqual(['fy25.02']);
		});

		it('should return revisions based on experienceKey when config is set', () => {
			const config: Config = {
				product: 'testProduct',
				region: 'testRegion',
				vc: {
					enabled: true,
					enabledVCRevisions: {
						all: ['fy25.01', 'fy25.03'],
						byExperience: {
							exp1: ['fy25.01'],
						},
					},
				},
			};
			setUFOConfig(config);
			expect(getEnabledVCRevisions('exp1')).toEqual(['fy25.01']);
		});
	});

	describe('isVCRevisionEnabled', () => {
		it('should correctly determine if a revision is enabled', () => {
			const config: Config = {
				product: 'testProduct',
				region: 'testRegion',
				vc: {
					enabled: true,
					enabledVCRevisions: {
						all: ['fy25.01', 'fy25.03'],
					},
				},
			};
			setUFOConfig(config);
			expect(isVCRevisionEnabled('fy25.01')).toBe(true);
			expect(isVCRevisionEnabled('fy25.02')).toBe(false);
		});
	});

	describe('getMostRecentVCRevision', () => {
		it('should return the most recent VC revision', () => {
			const config: Config = {
				product: 'testProduct',
				region: 'testRegion',
				vc: {
					enabled: true,
					enabledVCRevisions: {
						all: ['fy25.01', 'fy25.03'],
					},
				},
			};
			setUFOConfig(config);
			expect(getMostRecentVCRevision()).toBe('fy25.03');
		});
	});

	describe('getInteractionRate', () => {
		it('should return the interaction rate based on configuration', () => {
			const config = {
				product: 'testProduct',
				region: 'testRegion',
				rates: { testEvent: 0.5 },
			};
			setUFOConfig(config);
			expect(getInteractionRate('testEvent', 'page_load')).toBe(0.5);
		});

		it('should return 0 if no rate is set for the event', () => {
			expect(getInteractionRate('unknownEvent', 'page_load')).toBe(0);
		});
	});

	describe('getExperimentalInteractionRate', () => {
		it('should return the experimental interaction rate based on configuration', () => {
			const config = {
				product: 'testProduct',
				region: 'testRegion',
				experimentalInteractionMetrics: {
					enabled: true,
					rates: { experimentEvent: 0.7 },
				},
			};
			setUFOConfig(config);
			expect(getExperimentalInteractionRate('experimentEvent', 'transition')).toBe(0.7);
		});
	});

	describe('getPostInteractionRate', () => {
		it('should return the post-interaction rate based on configuration', () => {
			const config = {
				product: 'testProduct',
				region: 'testRegion',
				postInteractionLog: {
					enabled: true,
					rates: { postEvent: 0.9 },
				},
			};
			setUFOConfig(config);
			expect(getPostInteractionRate('postEvent', 'page_load')).toBe(0.9);
		});
	});

	describe('getCapabilityRate', () => {
		it('should return the capability rate based on configuration', () => {
			const config: Config = {
				product: 'testProduct',
				region: 'testRegion',
				capability: { feature_flag_access: 1, react_profiler: 1 },
			};
			setUFOConfig(config);
			expect(getCapabilityRate('feature_flag_access')).toBe(1);
			expect(getCapabilityRate('react_profiler')).toBe(1);
		});
	});

	describe('getTypingPerformanceTracingMethod', () => {
		it('should return the default typing method if not set', () => {
			expect(getTypingPerformanceTracingMethod()).toBe('timeout');
		});

		it('should return the configured typing method', () => {
			const config = {
				product: 'testProduct',
				region: 'testRegion',
				typingMethod: 'mutationObserver',
			};
			setUFOConfig(config);
			expect(getTypingPerformanceTracingMethod()).toBe('mutationObserver');
		});
	});

	describe('getAwaitBM3TTIList', () => {
		it('should return the list of events to await BM3 TTI', () => {
			const config = {
				product: 'testProduct',
				region: 'testRegion',
				awaitBM3TTI: ['event1', 'event2'],
			};
			setUFOConfig(config);
			expect(getAwaitBM3TTIList()).toEqual(['event1', 'event2']);
		});
	});

	describe('getRemovePageSegmentsUFOPrefixes', () => {
		it('should return the correct flag for removing page segment UFO prefixes', () => {
			const config = {
				product: 'testProduct',
				region: 'testRegion',
				removePageSegmentsUFOPrefixes: true,
			};
			setUFOConfig(config);
			expect(getRemovePageSegmentsUFOPrefixes()).toBe(true);
		});
	});

	describe('getRemoveInteractionsUFOPrefixes', () => {
		it('should return the correct flag for removing interaction UFO prefixes', () => {
			const config = {
				product: 'testProduct',
				region: 'testRegion',
				removeInteractionsUFOPrefixes: true,
			};
			setUFOConfig(config);
			expect(getRemoveInteractionsUFOPrefixes()).toBe(true);
		});
	});

	describe('getUfoNameOverrides', () => {
		it('should return the UFO name overrides based on configuration', () => {
			const ufoOverrides = { ufo1: { metric1: 'override1' } };
			const config = {
				product: 'testProduct',
				region: 'testRegion',
				ufoNameOverrides: ufoOverrides,
			};
			setUFOConfig(config);
			expect(getUfoNameOverrides()).toEqual(ufoOverrides);
		});
	});

	describe('getDoNotAbortActivePressInteraction', () => {
		it('should return the list of interactions that do not abort active press interaction', () => {
			const config = {
				product: 'testProduct',
				region: 'testRegion',
				doNotAbortActivePressInteraction: ['interaction1', 'interaction2'],
			};
			setUFOConfig(config);
			expect(getDoNotAbortActivePressInteraction()).toEqual(['interaction1', 'interaction2']);
		});
	});

	describe('getDoNotAbortActivePressInteractionOnTransition', () => {
		it('should return the list of interactions that do not abort on transition', () => {
			const config = {
				product: 'testProduct',
				region: 'testRegion',
				doNotAbortActivePressInteractionOnTransition: ['interaction3', 'interaction4'],
			};
			setUFOConfig(config);
			expect(getDoNotAbortActivePressInteractionOnTransition()).toEqual([
				'interaction3',
				'interaction4',
			]);
		});
	});
});
