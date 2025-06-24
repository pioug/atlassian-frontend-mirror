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

		describe('when feature flag platform_ufo_filter_out_aui_attribute_changes is enabled', () => {
			beforeEach(() => {
				mockFg.mockImplementation(
					(flag) => flag === 'platform_ufo_filter_out_aui_attribute_changes',
				);
			});

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
		});

		describe('should filter out non-visual attributes', () => {
			beforeEach(() => {
				mockFg.mockImplementation((flag) => flag === 'platform_ufo_ignore_extra_attributes');
			});
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
});
