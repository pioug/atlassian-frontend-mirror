// fy25_03/index.test.ts
import { VCObserverEntry, ViewportEntryData, WindowEventEntryData } from '../../types';

import VCCalculator_FY25_03, { KNOWN_ATTRIBUTES_THAT_DOES_NOT_CAUSE_LAYOUT_SHIFTS } from './index';

describe('VCCalculator_FY25_03', () => {
	let calculator: VCCalculator_FY25_03;

	beforeEach(() => {
		calculator = new VCCalculator_FY25_03();
	});

	describe('isEntryIncluded', () => {
		it('should return false for non-considered entry types', () => {
			const entry: VCObserverEntry = {
				time: 0,
				data: {
					type: 'unknown',
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
	});

	describe('isVCClean', () => {
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
			expect(calculator['isVCClean'](entries)).toBeFalsy();
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
			expect(calculator['isVCClean'](entries)).toBeTruthy();
		});

		it('should return true for empty entries', () => {
			expect(calculator['isVCClean']([])).toBeTruthy();
		});
	});
});
