import {
	type Config,
	getAwaitBM3TTIList,
	getCapabilityRate,
	getConfig,
	getDoNotAbortActivePressInteraction,
	getDoNotAbortActivePressInteractionOnTransition,
	getEnabledVCRevisions,
	getExperimentalInteractionRate,
	getExtraInteractionRate,
	getInteractionRate,
	getMostRecentVCRevision,
	getPostInteractionRate,
	getReactHydrationStats,
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
			expect(getEnabledVCRevisions()).toEqual(['fy25.03']);
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

	describe('getReactHydrationStats', () => {
		it('returns stats if provided by callback', () => {
			setUFOConfig({
				product: 'testProduct',
				region: 'testRegion',
				getReactHydrationStats: () => ({
					successful: true,
					warningCount: 10,
					minWarningComponentDepth: 50,
					maxWarningComponentDepth: 60,
				}),
			});
			expect(getReactHydrationStats()).toEqual({
				successful: true,
				warningCount: 10,
				minWarningComponentDepth: 50,
				maxWarningComponentDepth: 60,
			});
		});

		it('returns undefined function not provided', () => {
			setUFOConfig({
				product: 'testProduct',
				region: 'testRegion',
			});
			expect(getReactHydrationStats()).toEqual(undefined);
		});

		it('returns undefined if function returns undefined', () => {
			setUFOConfig({
				product: 'testProduct',
				region: 'testRegion',
				getReactHydrationStats: () => undefined,
			});
			expect(getReactHydrationStats()).toEqual(undefined);
		});

		it('returns undefined if stats function throws', () => {
			setUFOConfig({
				product: 'testProduct',
				region: 'testRegion',
				getReactHydrationStats: () => {
					throw new Error('Oops');
				},
			});
			expect(getReactHydrationStats()).toEqual(undefined);
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

		it('should return 0 when no config is set', () => {
			expect(getInteractionRate('testEvent', 'page_load')).toBe(0);
		});

		it('should handle killswitch priority correctly', () => {
			const config = {
				product: 'testProduct',
				region: 'testRegion',
				killswitch: ['testEvent'],
				rates: { testEvent: 0.5 },
				kind: {
					page_load: 0.8,
					transition: 0,
					hover: 0,
					legacy: 0,
					press: 0,
					typing: 0,
				},
			};
			setUFOConfig(config);
			expect(getInteractionRate('testEvent', 'page_load')).toBe(0);
		});

		it('should handle unknown event with rates correctly', () => {
			const config = {
				product: 'testProduct',
				region: 'testRegion',
				rates: { unknown: 100 },
			};
			setUFOConfig(config);
			expect(getInteractionRate('unknown', 'page_load')).toBe(100);
		});

		it('should return UNKNOWN_ITERACTION_RATE when unknown event has no configured rate', () => {
			const config = {
				product: 'testProduct',
				region: 'testRegion',
				rates: {}, // No rates configured
			};
			setUFOConfig(config);
			expect(getInteractionRate('unknown', 'page_load')).toBe(1000); // UNKNOWN_INTERACTION_RATE
		});

		it('should handle auto-generated events correctly', () => {
			const config = {
				product: 'testProduct',
				region: 'testRegion',
				autoGeneratedRate: 10,
			};
			setUFOConfig(config);
			expect(getInteractionRate('auto-generated-event', 'page_load')).toBe(10);
		});

		it('should handle kind-based rates correctly', () => {
			const config = {
				product: 'testProduct',
				region: 'testRegion',
				kind: {
					page_load: 10,
					transition: 5,
					hover: 0,
					legacy: 0,
					press: 0,
					typing: 0,
				},
			};
			setUFOConfig(config);
			expect(getInteractionRate('testEvent', 'page_load')).toBe(10);
			expect(getInteractionRate('testEvent', 'transition')).toBe(5);
		});

		it('should handle regex rules correctly', () => {
			const config = {
				product: 'testProduct',
				region: 'testRegion',
				rules: [
					{ test: '^test.*', rate: 10 },
					{ test: '.*Event$', rate: 10 },
				],
			};
			setUFOConfig(config);
			expect(getInteractionRate('testEvent', 'page_load')).toBe(10);
			expect(getInteractionRate('someEvent', 'page_load')).toBe(10);
		});

		it('should prioritize killswitch over all other rate configurations', () => {
			const config = {
				product: 'testProduct',
				region: 'testRegion',
				killswitch: ['testEvent'],
				rates: { testEvent: 0.5 },
				rules: [{ test: '^test.*', rate: 0.8 }],
				kind: {
					page_load: 0.9,
					transition: 0,
					hover: 0,
					legacy: 0,
					press: 0,
					typing: 0,
				},
				autoGeneratedRate: 0.3,
			};
			setUFOConfig(config);
			expect(getInteractionRate('testEvent', 'page_load')).toBe(0);
		});

		it('should prioritize explicit rates over regex rules and kind-based rates', () => {
			const config = {
				product: 'testProduct',
				region: 'testRegion',
				rates: { testEvent: 10 },
				rules: [{ test: '^test.*', rate: 10 }],
				kind: {
					page_load: 10,
					transition: 0,
					hover: 0,
					legacy: 0,
					press: 0,
					typing: 0,
				},
			};
			setUFOConfig(config);
			expect(getInteractionRate('testEvent', 'page_load')).toBe(10);
		});

		it('should prioritize regex rules over kind-based rates when no explicit rate is set', () => {
			const config = {
				product: 'testProduct',
				region: 'testRegion',
				rules: [{ test: '^test.*', rate: 10 }],
				kind: {
					page_load: 10,
					transition: 0,
					hover: 0,
					legacy: 0,
					press: 0,
					typing: 0,
				},
			};
			setUFOConfig(config);
			expect(getInteractionRate('testEvent', 'page_load')).toBe(10);
		});

		it('should fall back to kind-based rates when no other rate configuration matches', () => {
			const config = {
				product: 'testProduct',
				region: 'testRegion',
				kind: {
					page_load: 10,
					transition: 0,
					hover: 0,
					legacy: 0,
					press: 0,
					typing: 0,
				},
			};
			setUFOConfig(config);
			expect(getInteractionRate('testEvent', 'page_load')).toBe(10);
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

	describe('getExtraInteractionRate', () => {
		it('should return the extraInteractionMetrics rate based on configuration', () => {
			const config = {
				product: 'testProduct',
				region: 'testRegion',
				extraInteractionMetrics: {
					enabled: true,
					rates: { extraEvent: 0.8 },
				},
			};
			setUFOConfig(config);
			expect(getExtraInteractionRate('extraEvent', 'page_load')).toBe(0.8);
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
