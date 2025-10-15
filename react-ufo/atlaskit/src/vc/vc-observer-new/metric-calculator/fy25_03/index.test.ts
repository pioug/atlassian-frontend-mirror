// fy25_03/index.test.ts
import { fg } from '@atlaskit/platform-feature-flags';

import type { VCObserverEntry, ViewportEntryData, WindowEventEntryData } from '../../types';

import VCCalculator_FY25_03, {
	KNOWN_ATTRIBUTES_THAT_DOES_NOT_CAUSE_LAYOUT_SHIFTS,
	NON_VISUAL_ARIA_ATTRIBUTES,
} from './index';

// Mock feature flags
jest.mock('@atlaskit/platform-feature-flags', () => ({
	fg: jest.fn(),
}));

describe('VCCalculator_FY25_03', () => {
	let calculator: VCCalculator_FY25_03;
	const mockFg = fg as jest.Mock;

	beforeEach(() => {
		calculator = new VCCalculator_FY25_03();
		mockFg.mockImplementation(() => false);
	});

	afterEach(() => {
		mockFg.mockClear();
	});

	describe('isEntryIncluded', () => {
		it('should return false for non-considered entry types', () => {
			const entry: VCObserverEntry = {
				time: 0,
				data: {
					type: 'unknown' as any,
					elementName: 'div',
					rect: new DOMRect(),
					visible: true,
				},
			};
			expect(calculator['isEntryIncluded'](entry)).toBeFalsy();
		});

		it('should return true for valid mutation:attribute entries', () => {
			const entry: VCObserverEntry = {
				time: 0,
				data: {
					type: 'mutation:attribute',
					elementName: 'div',
					rect: new DOMRect(),
					visible: true,
					attributeName: 'class',
				} as ViewportEntryData,
			};
			expect(calculator['isEntryIncluded'](entry)).toBeTruthy();
		});

		it('should return false for mutation:attribute entries without attributeName', () => {
			const entry: VCObserverEntry = {
				time: 0,
				data: {
					type: 'mutation:attribute',
					elementName: 'div',
					rect: new DOMRect(),
					visible: true,
				} as ViewportEntryData,
			};
			expect(calculator['isEntryIncluded'](entry)).toBeFalsy();
		});

		it('should return false for invisible viewport entries', () => {
			const entry: VCObserverEntry = {
				time: 0,
				data: {
					type: 'mutation:element',
					elementName: 'div',
					rect: new DOMRect(),
					visible: false,
				},
			};
			expect(calculator['isEntryIncluded'](entry)).toBeFalsy();
		});

		it('should return true for visible viewport entries', () => {
			const entry: VCObserverEntry = {
				time: 0,
				data: {
					type: 'mutation:element',
					elementName: 'div',
					rect: new DOMRect(),
					visible: true,
				},
			};
			expect(calculator['isEntryIncluded'](entry)).toBeTruthy();
		});

		describe.each(KNOWN_ATTRIBUTES_THAT_DOES_NOT_CAUSE_LAYOUT_SHIFTS)(
			'when entry is a %s attribute',
			(att) => {
				it('should return false', () => {
					const entry: VCObserverEntry = {
						time: 0,
						data: {
							type: 'mutation:attribute',
							elementName: 'div',
							rect: new DOMRect(),
							visible: true,
							attributeName: att,
						} as ViewportEntryData,
					};
					expect(calculator['isEntryIncluded'](entry)).toBeFalsy();
				});
			},
		);

		it('should return false for data-aui-version attribute', () => {
			const entry: VCObserverEntry = {
				time: 0,
				data: {
					type: 'mutation:attribute',
					elementName: 'div',
					rect: new DOMRect(),
					visible: true,
					attributeName: 'data-aui-version',
				} as ViewportEntryData,
			};
			expect(calculator['isEntryIncluded'](entry)).toBeFalsy();
		});

		it('should return true for other attributes', () => {
			const entry: VCObserverEntry = {
				time: 0,
				data: {
					type: 'mutation:attribute',
					elementName: 'div',
					rect: new DOMRect(),
					visible: true,
					attributeName: 'class',
				} as ViewportEntryData,
			};
			expect(calculator['isEntryIncluded'](entry)).toBeTruthy();
		});

		describe('should filter out non-visual attributes', () => {
			it('should return false for data-testid attribute', () => {
				const entry: VCObserverEntry = {
					time: 0,
					data: {
						type: 'mutation:attribute',
						elementName: 'div',
						rect: new DOMRect(),
						visible: true,
						attributeName: 'data-testid',
					} as ViewportEntryData,
				};
				expect(calculator['isEntryIncluded'](entry)).toBeFalsy();
			});

			it('should return false for data-vc attribute', () => {
				const entry: VCObserverEntry = {
					time: 0,
					data: {
						type: 'mutation:attribute',
						elementName: 'div',
						rect: new DOMRect(),
						visible: true,
						attributeName: 'data-vc',
					} as ViewportEntryData,
				};
				expect(calculator['isEntryIncluded'](entry)).toBeFalsy();
			});

			it('should return false for data-ssr-placeholder attribute', () => {
				const entry: VCObserverEntry = {
					time: 0,
					data: {
						type: 'mutation:attribute',
						elementName: 'div',
						rect: new DOMRect(),
						visible: true,
						attributeName: 'data-ssr-placeholder',
					} as ViewportEntryData,
				};
				expect(calculator['isEntryIncluded'](entry)).toBeFalsy();
			});

			it('should return false for data-vc-nvs attribute', () => {
				const entry: VCObserverEntry = {
					time: 0,
					data: {
						type: 'mutation:attribute',
						elementName: 'div',
						rect: new DOMRect(),
						visible: true,
						attributeName: 'data-vc-nvs',
					} as ViewportEntryData,
				};
				expect(calculator['isEntryIncluded'](entry)).toBeFalsy();
			});

			it('should return false for data-renderer-start-pos attribute', () => {
				const entry: VCObserverEntry = {
					time: 0,
					data: {
						type: 'mutation:attribute',
						elementName: 'div',
						rect: new DOMRect(),
						visible: true,
						attributeName: 'data-renderer-start-pos',
					} as ViewportEntryData,
				};
				expect(calculator['isEntryIncluded'](entry)).toBeFalsy();
			});

			it('should return false for data-table-local-id attribute', () => {
				const entry: VCObserverEntry = {
					time: 0,
					data: {
						type: 'mutation:attribute',
						elementName: 'div',
						rect: new DOMRect(),
						visible: true,
						attributeName: 'data-table-local-id',
					} as ViewportEntryData,
				};
				expect(calculator['isEntryIncluded'](entry)).toBeFalsy();
			});

			it('should return false for spellcheck attribute', () => {
				const entry: VCObserverEntry = {
					time: 0,
					data: {
						type: 'mutation:attribute',
						elementName: 'div',
						rect: new DOMRect(),
						visible: true,
						attributeName: 'spellcheck',
					} as ViewportEntryData,
				};
				expect(calculator['isEntryIncluded'](entry)).toBeFalsy();
			});

			it('should return false for data-media-vc-wrapper attribute', () => {
				const entry: VCObserverEntry = {
					time: 0,
					data: {
						type: 'mutation:attribute',
						elementName: 'div',
						rect: new DOMRect(),
						visible: true,
						attributeName: 'data-media-vc-wrapper',
					} as ViewportEntryData,
				};
				expect(calculator['isEntryIncluded'](entry)).toBeFalsy();
			});

			it('should return false for data-ssr-placeholder-replace attribute', () => {
				const entry: VCObserverEntry = {
					time: 0,
					data: {
						type: 'mutation:attribute',
						elementName: 'div',
						rect: new DOMRect(),
						visible: true,
						attributeName: 'data-ssr-placeholder-replace',
					} as ViewportEntryData,
				};
				expect(calculator['isEntryIncluded'](entry)).toBeFalsy();
			});

			it('should return false for data-auto-scrollable attribute', () => {
				const entry: VCObserverEntry = {
					time: 0,
					data: {
						type: 'mutation:attribute',
						elementName: 'div',
						rect: new DOMRect(),
						visible: true,
						attributeName: 'data-auto-scrollable',
					} as ViewportEntryData,
				};
				expect(calculator['isEntryIncluded'](entry)).toBeFalsy();
			});

			it('should return false for id attribute', () => {
				const entry: VCObserverEntry = {
					time: 0,
					data: {
						type: 'mutation:attribute',
						elementName: 'div',
						rect: new DOMRect(),
						visible: true,
						attributeName: 'id',
					} as ViewportEntryData,
				};
				expect(calculator['isEntryIncluded'](entry)).toBeFalsy();
			});

			it('should return false for tabindex attribute', () => {
				const entry: VCObserverEntry = {
					time: 0,
					data: {
						type: 'mutation:attribute',
						elementName: 'div',
						rect: new DOMRect(),
						visible: true,
						attributeName: 'tabindex',
					} as ViewportEntryData,
				};
				expect(calculator['isEntryIncluded'](entry)).toBeFalsy();
			});

			describe.each(NON_VISUAL_ARIA_ATTRIBUTES)('when entry is a %s attribute', (att) => {
				it('should return false', () => {
					const entry: VCObserverEntry = {
						time: 0,
						data: {
							type: 'mutation:attribute',
							elementName: 'div',
							rect: new DOMRect(),
							visible: true,
							attributeName: att,
						} as ViewportEntryData,
					};
					expect(calculator['isEntryIncluded'](entry)).toBeFalsy();
				});
			});

			it('should return true for other aria attributes not in the list', () => {
				const entry: VCObserverEntry = {
					time: 0,
					data: {
						type: 'mutation:attribute',
						elementName: 'div',
						rect: new DOMRect(),
						visible: true,
						attributeName: 'aria-some-unknown-attribute',
					} as ViewportEntryData,
				};
				expect(calculator['isEntryIncluded'](entry)).toBeTruthy();
			});

			it('should return true for other attributes', () => {
				const entry: VCObserverEntry = {
					time: 0,
					data: {
						type: 'mutation:attribute',
						elementName: 'div',
						rect: new DOMRect(),
						visible: true,
						attributeName: 'class',
					} as ViewportEntryData,
				};
				expect(calculator['isEntryIncluded'](entry)).toBeTruthy();
			});
		});
	});

	describe('getVCCleanStatus', () => {
		it('should return false when aborting window events are present', () => {
			const entries: VCObserverEntry[] = [
				{
					time: 0,
					data: {
						type: 'window:event',
						eventType: 'scroll',
					} as WindowEventEntryData,
				},
			];
			expect(calculator['getVCCleanStatus'](entries)).toEqual({
				isVCClean: false,
				dirtyReason: 'scroll',
				abortTimestamp: 0,
			});
		});

		it('should return true when no aborting window events are present', () => {
			const entries: VCObserverEntry[] = [
				{
					time: 0,
					data: {
						type: 'window:event',
						eventType: 'click',
					} as unknown as WindowEventEntryData,
				},
			];
			expect(calculator['getVCCleanStatus'](entries)).toEqual({ isVCClean: true });
		});

		it('should return true for empty entries', () => {
			expect(calculator['getVCCleanStatus']([])).toEqual({ isVCClean: true });
		});
	});

	describe('getConsideredEntryTypes behavior with platform_ufo_exclude_3p_elements_from_ttvc feature flag', () => {
		describe('when fg platform_ufo_exclude_3p_elements_from_ttvc is true', () => {
			beforeEach(() => {
				mockFg.mockImplementation((flag) => flag === 'platform_ufo_exclude_3p_elements_from_ttvc');
			});

			it('should exclude mutation:third-party-element entries', () => {
				const entry: VCObserverEntry = {
					time: 0,
					data: {
						type: 'mutation:third-party-element',
						elementName: 'div',
						rect: new DOMRect(),
						visible: true,
					},
				};
				expect(calculator['isEntryIncluded'](entry)).toBeFalsy();
			});

			it('should still include other valid entry types', () => {
				const entry: VCObserverEntry = {
					time: 0,
					data: {
						type: 'mutation:element',
						elementName: 'div',
						rect: new DOMRect(),
						visible: true,
					},
				};
				expect(calculator['isEntryIncluded'](entry)).toBeTruthy();
			});
		});

		describe('when fg platform_ufo_exclude_3p_elements_from_ttvc is false', () => {
			beforeEach(() => {
				mockFg.mockImplementation(() => false);
			});

			it('should include mutation:third-party-element entries', () => {
				const entry: VCObserverEntry = {
					time: 0,
					data: {
						type: 'mutation:third-party-element',
						elementName: 'div',
						rect: new DOMRect(),
						visible: true,
					},
				};
				expect(calculator['isEntryIncluded'](entry)).toBeTruthy();
			});

			it('should still include other valid entry types', () => {
				const entry: VCObserverEntry = {
					time: 0,
					data: {
						type: 'mutation:element',
						elementName: 'div',
						rect: new DOMRect(),
						visible: true,
					},
				};
				expect(calculator['isEntryIncluded'](entry)).toBeTruthy();
			});
		});
	});

	describe('mutation:media entries with media-perf-uplift-mutation-fix feature flag', () => {
		describe('when fg media-perf-uplift-mutation-fix is true', () => {
			beforeEach(() => {
				mockFg.mockImplementation(
					(flag) =>
						flag === 'media-perf-uplift-mutation-fix' ||
						flag === 'platform_ufo_enable_media_for_ttvc_v3',
				);
			});

			it('should exclude mutation:media entries with data-test-* attributes', () => {
				const entry: VCObserverEntry = {
					time: 0,
					data: {
						type: 'mutation:media',
						elementName: 'img',
						rect: new DOMRect(),
						visible: true,
						attributeName: 'data-test-id',
					} as ViewportEntryData,
				};
				expect(calculator['isEntryIncluded'](entry)).toBeFalsy();
			});

			it('should exclude mutation:media entries with data-file-* attributes', () => {
				const entry: VCObserverEntry = {
					time: 0,
					data: {
						type: 'mutation:media',
						elementName: 'img',
						rect: new DOMRect(),
						visible: true,
						attributeName: 'data-file-name',
					} as ViewportEntryData,
				};
				expect(calculator['isEntryIncluded'](entry)).toBeFalsy();
			});

			it('should exclude mutation:media entries with data-context-* attributes', () => {
				const entry: VCObserverEntry = {
					time: 0,
					data: {
						type: 'mutation:media',
						elementName: 'img',
						rect: new DOMRect(),
						visible: true,
						attributeName: 'data-context-id',
					} as ViewportEntryData,
				};
				expect(calculator['isEntryIncluded'](entry)).toBeFalsy();
			});

			it('should exclude mutation:media entries with alt attribute', () => {
				const entry: VCObserverEntry = {
					time: 0,
					data: {
						type: 'mutation:media',
						elementName: 'img',
						rect: new DOMRect(),
						visible: true,
						attributeName: 'alt',
					} as ViewportEntryData,
				};
				expect(calculator['isEntryIncluded'](entry)).toBeFalsy();
			});

			it('should include mutation:media entries with other attributes', () => {
				const entry: VCObserverEntry = {
					time: 0,
					data: {
						type: 'mutation:media',
						elementName: 'img',
						rect: new DOMRect(),
						visible: true,
						attributeName: 'src',
					} as ViewportEntryData,
				};
				expect(calculator['isEntryIncluded'](entry)).toBeTruthy();
			});

			it('should include mutation:media entries without attributeName', () => {
				const entry: VCObserverEntry = {
					time: 0,
					data: {
						type: 'mutation:media',
						elementName: 'img',
						rect: new DOMRect(),
						visible: true,
					} as ViewportEntryData,
				};
				expect(calculator['isEntryIncluded'](entry)).toBeTruthy();
			});

			it('should not affect non-mutation:media entries', () => {
				const entry: VCObserverEntry = {
					time: 0,
					data: {
						type: 'mutation:element',
						elementName: 'div',
						rect: new DOMRect(),
						visible: true,
						attributeName: 'data-test-id',
					} as ViewportEntryData,
				};
				expect(calculator['isEntryIncluded'](entry)).toBeTruthy();
			});
		});

		describe('when fg media-perf-uplift-mutation-fix is false', () => {
			beforeEach(() => {
				mockFg.mockImplementation((flag) => flag === 'platform_ufo_enable_media_for_ttvc_v3');
			});

			it('should include mutation:media entries with data-test-* attributes', () => {
				const entry: VCObserverEntry = {
					time: 0,
					data: {
						type: 'mutation:media',
						elementName: 'img',
						rect: new DOMRect(),
						visible: true,
						attributeName: 'data-test-id',
					} as ViewportEntryData,
				};
				expect(calculator['isEntryIncluded'](entry)).toBeTruthy();
			});

			it('should include mutation:media entries with alt attribute', () => {
				const entry: VCObserverEntry = {
					time: 0,
					data: {
						type: 'mutation:media',
						elementName: 'img',
						rect: new DOMRect(),
						visible: true,
						attributeName: 'alt',
					} as ViewportEntryData,
				};
				expect(calculator['isEntryIncluded'](entry)).toBeTruthy();
			});
		});
	});
});
