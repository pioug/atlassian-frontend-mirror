// vcnext/index.test.ts
import { fg } from '@atlaskit/platform-feature-flags';

import type { VCObserverEntry, ViewportEntryData } from '../../types';
import {
	KNOWN_ATTRIBUTES_THAT_DOES_NOT_CAUSE_LAYOUT_SHIFTS,
	NON_VISUAL_ARIA_ATTRIBUTES,
	THIRD_PARTY_BROWSER_EXTENSION_ATTRIBUTES,
} from '../utils/constants';

import VCCalculator_FY26_04 from './index';

// Mock feature flags
jest.mock('@atlaskit/platform-feature-flags', () => ({
	fg: jest.fn(),
}));

describe('VCCalculator_FY26_04', () => {
	let calculator: VCCalculator_FY26_04;
	const mockFg = fg as jest.Mock;

	beforeEach(() => {
		calculator = new VCCalculator_FY26_04();
		mockFg.mockImplementation(() => false);
	});

	afterEach(() => {
		mockFg.mockClear();
	});

	describe('constructor', () => {
		it('should create an instance with revision "next"', () => {
			const instance = new VCCalculator_FY26_04();
			expect(instance).toBeInstanceOf(VCCalculator_FY26_04);
		});
	});

	describe('isEntryIncluded with considered entry types', () => {
		describe('mutation:display-contents-children-element', () => {
			it('should include mutation:display-contents-children-element entries', () => {
				const entry: VCObserverEntry = {
					time: 0,
					data: {
						type: 'mutation:display-contents-children-element',
						elementName: 'div',
						rect: new DOMRect(),
						visible: true,
					} as ViewportEntryData,
				};
				expect(calculator['isEntryIncluded'](entry)).toBeTruthy();
			});
		});

		describe('mutation:display-contents-children-attribute', () => {
			it('should include mutation:display-contents-children-attribute with visual attribute', () => {
				mockFg.mockImplementation((flag) =>
					flag === 'platform_ufo_fix_ttvc_v4_attribute_exclusions' ? false : false,
				);
				const entry: VCObserverEntry = {
					time: 0,
					data: {
						type: 'mutation:display-contents-children-attribute',
						elementName: 'div',
						rect: new DOMRect(),
						visible: true,
						attributeName: 'class',
					} as ViewportEntryData,
				};
				expect(calculator['isEntryIncluded'](entry)).toBeTruthy();
			});

			it('should include mutation:display-contents-children-attribute without attributeName', () => {
				mockFg.mockImplementation(() => false);
				const entry: VCObserverEntry = {
					time: 0,
					data: {
						type: 'mutation:display-contents-children-attribute',
						elementName: 'div',
						rect: new DOMRect(),
						visible: true,
					} as ViewportEntryData,
				};
				expect(calculator['isEntryIncluded'](entry)).toBeTruthy();
			});
		});

		describe('rovo_search_page_ttvc_ignoring_smart_answers_fix is on', () => {
			beforeEach(() => {
				mockFg.mockImplementation(
					(flag) => flag === 'rovo_search_page_ttvc_ignoring_smart_answers_fix',
				);
			});

			it('should return true for smart answers entries by default', () => {
				const addedElementEntry: VCObserverEntry = {
					time: 0,
					data: {
						type: 'mutation:smart-answers-element',
						elementName: 'div',
						rect: new DOMRect(),
						visible: true,
					},
				};

				const attributeMutationEntry: VCObserverEntry = {
					time: 0,
					data: {
						type: 'mutation:smart-answers-attribute',
						elementName: 'div',
						rect: new DOMRect(),
						visible: true,
					},
				};

				expect(calculator['isEntryIncluded'](addedElementEntry)).toBe(true);
				expect(calculator['isEntryIncluded'](attributeMutationEntry)).toBe(true);
			});

			it('should return false for smart answers entries when excludeSmartAnswersInSearch is true', () => {
				const addedElementEntry: VCObserverEntry = {
					time: 0,
					data: {
						type: 'mutation:smart-answers-element',
						elementName: 'div',
						rect: new DOMRect(),
						visible: true,
					},
				};

				const attributeMutationEntry: VCObserverEntry = {
					time: 0,
					data: {
						type: 'mutation:smart-answers-attribute',
						elementName: 'div',
						rect: new DOMRect(),
						visible: true,
					},
				};

				expect(calculator['isEntryIncluded'](addedElementEntry, undefined, true)).toBe(false);
				expect(calculator['isEntryIncluded'](attributeMutationEntry, undefined, true)).toBe(false);
			});
		});
	});

	describe('isEntryIncluded with excluded entry types', () => {
		describe('layout-shift:same-rect', () => {
			it('should exclude layout-shift:same-rect entries', () => {
				mockFg.mockImplementation(() => false);
				const entry: VCObserverEntry = {
					time: 0,
					data: {
						type: 'layout-shift:same-rect',
						elementName: 'div',
						rect: new DOMRect(),
						visible: true,
					} as ViewportEntryData,
				};
				expect(calculator['isEntryIncluded'](entry)).toBeFalsy();
			});
		});

		describe('mutation:attribute:non-visual-input-name', () => {
			it('should exclude mutation:attribute:non-visual-input-name entries', () => {
				mockFg.mockImplementation(() => false);
				const entry: VCObserverEntry = {
					time: 0,
					data: {
						type: 'mutation:attribute:non-visual-input-name',
						elementName: 'input',
						rect: new DOMRect(),
						visible: true,
						attributeName: 'name',
					} as ViewportEntryData,
				};
				expect(calculator['isEntryIncluded'](entry)).toBeFalsy();
			});
		});
	});

	describe('isEntryIncluded with mutation:display-contents-children-attribute and platform_ufo_fix_ttvc_v4_attribute_exclusions', () => {
		describe('when feature flag is enabled', () => {
			beforeEach(() => {
				mockFg.mockImplementation(
					(flag) => flag === 'platform_ufo_fix_ttvc_v4_attribute_exclusions',
				);
			});

			it('should exclude when attributeName is null', () => {
				const entry: VCObserverEntry = {
					time: 0,
					data: {
						type: 'mutation:display-contents-children-attribute',
						elementName: 'div',
						rect: new DOMRect(),
						visible: true,
						attributeName: null,
					} as ViewportEntryData,
				};
				expect(calculator['isEntryIncluded'](entry)).toBeFalsy();
			});

			it('should exclude when attributeName is undefined', () => {
				const entry: VCObserverEntry = {
					time: 0,
					data: {
						type: 'mutation:display-contents-children-attribute',
						elementName: 'div',
						rect: new DOMRect(),
						visible: true,
					} as ViewportEntryData,
				};
				expect(calculator['isEntryIncluded'](entry)).toBeFalsy();
			});

			it('should exclude when attributeName starts with data-test', () => {
				const entry: VCObserverEntry = {
					time: 0,
					data: {
						type: 'mutation:display-contents-children-attribute',
						elementName: 'div',
						rect: new DOMRect(),
						visible: true,
						attributeName: 'data-test-id',
					} as ViewportEntryData,
				};
				expect(calculator['isEntryIncluded'](entry)).toBeFalsy();
			});

			it('should exclude when attributeName starts with data-test-custom-value', () => {
				const entry: VCObserverEntry = {
					time: 0,
					data: {
						type: 'mutation:display-contents-children-attribute',
						elementName: 'div',
						rect: new DOMRect(),
						visible: true,
						attributeName: 'data-test-custom-value',
					} as ViewportEntryData,
				};
				expect(calculator['isEntryIncluded'](entry)).toBeFalsy();
			});

			describe('KNOWN_ATTRIBUTES_THAT_DOES_NOT_CAUSE_LAYOUT_SHIFTS', () => {
				it.each(KNOWN_ATTRIBUTES_THAT_DOES_NOT_CAUSE_LAYOUT_SHIFTS)(
					'should exclude when attributeName is %s',
					(attributeName) => {
						const entry: VCObserverEntry = {
							time: 0,
							data: {
								type: 'mutation:display-contents-children-attribute',
								elementName: 'div',
								rect: new DOMRect(),
								visible: true,
								attributeName,
							} as ViewportEntryData,
						};
						expect(calculator['isEntryIncluded'](entry)).toBeFalsy();
					},
				);
			});

			describe('NON_VISUAL_ARIA_ATTRIBUTES', () => {
				it.each(NON_VISUAL_ARIA_ATTRIBUTES)(
					'should exclude when attributeName is %s',
					(attributeName) => {
						const entry: VCObserverEntry = {
							time: 0,
							data: {
								type: 'mutation:display-contents-children-attribute',
								elementName: 'div',
								rect: new DOMRect(),
								visible: true,
								attributeName,
							} as ViewportEntryData,
						};
						expect(calculator['isEntryIncluded'](entry)).toBeFalsy();
					},
				);
			});

			describe('THIRD_PARTY_BROWSER_EXTENSION_ATTRIBUTES', () => {
				it.each(THIRD_PARTY_BROWSER_EXTENSION_ATTRIBUTES)(
					'should exclude when attributeName is %s',
					(attributeName) => {
						const entry: VCObserverEntry = {
							time: 0,
							data: {
								type: 'mutation:display-contents-children-attribute',
								elementName: 'div',
								rect: new DOMRect(),
								visible: true,
								attributeName,
							} as ViewportEntryData,
						};
						expect(calculator['isEntryIncluded'](entry)).toBeFalsy();
					},
				);
			});

			it('should include when attributeName is a visual attribute', () => {
				const entry: VCObserverEntry = {
					time: 0,
					data: {
						type: 'mutation:display-contents-children-attribute',
						elementName: 'div',
						rect: new DOMRect(),
						visible: true,
						attributeName: 'class',
					} as ViewportEntryData,
				};
				expect(calculator['isEntryIncluded'](entry)).toBeTruthy();
			});

			it('should include when attributeName is another visual attribute', () => {
				const entry: VCObserverEntry = {
					time: 0,
					data: {
						type: 'mutation:display-contents-children-attribute',
						elementName: 'div',
						rect: new DOMRect(),
						visible: true,
						attributeName: 'style',
					} as ViewportEntryData,
				};
				expect(calculator['isEntryIncluded'](entry)).toBeTruthy();
			});

			it('should include when attributeName is a custom visual attribute', () => {
				const entry: VCObserverEntry = {
					time: 0,
					data: {
						type: 'mutation:display-contents-children-attribute',
						elementName: 'div',
						rect: new DOMRect(),
						visible: true,
						attributeName: 'data-custom-visual-property',
					} as ViewportEntryData,
				};
				expect(calculator['isEntryIncluded'](entry)).toBeTruthy();
			});
		});
	});

	describe('isEntryIncluded inheritance from parent class', () => {
		it('should include mutation:element entries from parent class', () => {
			mockFg.mockImplementation(() => false);
			const entry: VCObserverEntry = {
				time: 0,
				data: {
					type: 'mutation:element',
					elementName: 'div',
					rect: new DOMRect(),
					visible: true,
				} as ViewportEntryData,
			};
			expect(calculator['isEntryIncluded'](entry)).toBeTruthy();
		});

		it('should include mutation:child-element entries from parent class', () => {
			mockFg.mockImplementation(() => false);
			const entry: VCObserverEntry = {
				time: 0,
				data: {
					type: 'mutation:child-element',
					elementName: 'div',
					rect: new DOMRect(),
					visible: true,
				} as ViewportEntryData,
			};
			expect(calculator['isEntryIncluded'](entry)).toBeTruthy();
		});

		it('should include layout-shift entries from parent class', () => {
			mockFg.mockImplementation(() => false);
			const entry: VCObserverEntry = {
				time: 0,
				data: {
					type: 'layout-shift',
					elementName: 'div',
					rect: new DOMRect(),
					visible: true,
				} as ViewportEntryData,
			};
			expect(calculator['isEntryIncluded'](entry)).toBeTruthy();
		});

		it('should exclude invisible entries from parent class', () => {
			mockFg.mockImplementation(() => false);
			const entry: VCObserverEntry = {
				time: 0,
				data: {
					type: 'mutation:element',
					elementName: 'div',
					rect: new DOMRect(),
					visible: false,
				} as ViewportEntryData,
			};
			expect(calculator['isEntryIncluded'](entry)).toBeFalsy();
		});

		it('should exclude mutation:attribute entries with excluded names from parent class', () => {
			mockFg.mockImplementation(() => false);
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

		it('should include unknown entry type when considered by no calculator', () => {
			mockFg.mockImplementation(() => false);
			const entry: VCObserverEntry = {
				time: 0,
				data: {
					type: 'unknown' as any,
					elementName: 'div',
					rect: new DOMRect(),
					visible: true,
				} as ViewportEntryData,
			};
			expect(calculator['isEntryIncluded'](entry)).toBeFalsy();
		});
	});

	describe('complex scenarios with multiple feature flags', () => {
		it('should handle mutation:display-contents-children-element with all flags enabled', () => {
			mockFg.mockImplementation(() => true);
			const entry: VCObserverEntry = {
				time: 0,
				data: {
					type: 'mutation:display-contents-children-element',
					elementName: 'div',
					rect: new DOMRect(),
					visible: true,
				} as ViewportEntryData,
			};
			expect(calculator['isEntryIncluded'](entry)).toBeTruthy();
		});

		it('should properly handle entry excluded from parent but not from next calculator', () => {
			mockFg.mockImplementation(() => false);
			const entry: VCObserverEntry = {
				time: 0,
				data: {
					type: 'mutation:display-contents-children-element',
					elementName: 'div',
					rect: new DOMRect(),
					visible: true,
				} as ViewportEntryData,
			};
			expect(calculator['isEntryIncluded'](entry)).toBeTruthy();
		});
	});

	describe('isEntryIncluded with combination of feature flags for display-contents-children-attribute', () => {
		it('should exclude when attribute exclusion flag is enabled and attribute is in exclusion list', () => {
			mockFg.mockImplementation((flag) => flag === 'platform_ufo_fix_ttvc_v4_attribute_exclusions');
			const entry: VCObserverEntry = {
				time: 0,
				data: {
					type: 'mutation:display-contents-children-attribute',
					elementName: 'div',
					rect: new DOMRect(),
					visible: true,
					attributeName: 'aria-label',
				} as ViewportEntryData,
			};
			expect(calculator['isEntryIncluded'](entry)).toBeFalsy();
		});

		it('should include with visual attribute', () => {
			mockFg.mockImplementation(() => false);
			const entry: VCObserverEntry = {
				time: 0,
				data: {
					type: 'mutation:display-contents-children-attribute',
					elementName: 'div',
					rect: new DOMRect(),
					visible: true,
					attributeName: 'class',
				} as ViewportEntryData,
			};
			expect(calculator['isEntryIncluded'](entry)).toBeTruthy();
		});
	});

	describe('edge cases', () => {
		it('should handle entry with empty string attributeName', () => {
			mockFg.mockImplementation((flag) => flag === 'platform_ufo_fix_ttvc_v4_attribute_exclusions');
			const entry: VCObserverEntry = {
				time: 0,
				data: {
					type: 'mutation:display-contents-children-attribute',
					elementName: 'div',
					rect: new DOMRect(),
					visible: true,
					attributeName: '',
				} as ViewportEntryData,
			};
			expect(calculator['isEntryIncluded'](entry)).toBeFalsy();
		});

		it('should handle entry with very long attributeName', () => {
			mockFg.mockImplementation((flag) => flag === 'platform_ufo_fix_ttvc_v4_attribute_exclusions');
			const entry: VCObserverEntry = {
				time: 0,
				data: {
					type: 'mutation:display-contents-children-attribute',
					elementName: 'div',
					rect: new DOMRect(),
					visible: true,
					attributeName: 'a'.repeat(1000),
				} as ViewportEntryData,
			};
			expect(calculator['isEntryIncluded'](entry)).toBeTruthy();
		});

		it('should handle entry with data-test in middle of attributeName', () => {
			mockFg.mockImplementation((flag) => flag === 'platform_ufo_fix_ttvc_v4_attribute_exclusions');
			const entry: VCObserverEntry = {
				time: 0,
				data: {
					type: 'mutation:display-contents-children-attribute',
					elementName: 'div',
					rect: new DOMRect(),
					visible: true,
					attributeName: 'custom-data-test-value',
				} as ViewportEntryData,
			};
			// Should only check if it starts with data-test
			expect(calculator['isEntryIncluded'](entry)).toBeTruthy();
		});

		it('should handle entry with case-sensitive attributeName check', () => {
			mockFg.mockImplementation((flag) => flag === 'platform_ufo_fix_ttvc_v4_attribute_exclusions');
			const entry: VCObserverEntry = {
				time: 0,
				data: {
					type: 'mutation:display-contents-children-attribute',
					elementName: 'div',
					rect: new DOMRect(),
					visible: true,
					attributeName: 'DATA-TEST-ID',
				} as ViewportEntryData,
			};
			// Case sensitive check - should not match 'data-test'
			expect(calculator['isEntryIncluded'](entry)).toBeTruthy();
		});
	});

	describe('mutation:attribute:framework-routing entries with platform_ufo_vc_ignore_display_none_mutations feature flag', () => {
		describe('when fg platform_ufo_vc_ignore_display_none_mutations is true', () => {
			beforeEach(() => {
				mockFg.mockImplementation(
					(flag) => flag === 'platform_ufo_vc_ignore_display_none_mutations',
				);
			});

			it('should exclude mutation:attribute:framework-routing entries', () => {
				const entry: VCObserverEntry = {
					time: 0,
					data: {
						type: 'mutation:attribute:framework-routing',
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

			it('should still include mutation:attribute entries', () => {
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

			it('should still include mutation:display-contents-children-element entries', () => {
				const entry: VCObserverEntry = {
					time: 0,
					data: {
						type: 'mutation:display-contents-children-element',
						elementName: 'div',
						rect: new DOMRect(),
						visible: true,
					} as ViewportEntryData,
				};
				expect(calculator['isEntryIncluded'](entry)).toBeTruthy();
			});
		});

		describe('when fg platform_ufo_vc_ignore_display_none_mutations is false', () => {
			beforeEach(() => {
				mockFg.mockImplementation(() => false);
			});

			it('should not exclude mutation:attribute:framework-routing entries (they are not in considered types)', () => {
				const entry: VCObserverEntry = {
					time: 0,
					data: {
						type: 'mutation:attribute:framework-routing',
						elementName: 'div',
						rect: new DOMRect(),
						visible: true,
					},
				};
				// When flag is off, the entry is excluded because it's not in the considered entry types list
				expect(calculator['isEntryIncluded'](entry)).toBeFalsy();
			});
		});
	});

	describe('backward compatibility', () => {
		it('should still process entries that parent class includes', () => {
			mockFg.mockImplementation(() => false);
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

		it('should reject entries that parent class rejects', () => {
			mockFg.mockImplementation(() => false);
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
	});
});
