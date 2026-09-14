import { failGate, passGate } from '@atlassian/feature-flags-test-utils/mock-gates';

import type { MutationRecordWithTimestamp } from '../types';

import isAnchorNameStyleMutation from './is-anchor-name-style-mutation';

const GATE = 'platform_ufo_exclude_anchor_name_from_ttvc';

describe('isAnchorNameStyleMutation', () => {
	it('should return false when target is not an HTMLElement', () => {
		const mutation = {
			type: 'attributes',
			target: null, // Not an HTMLElement
			attributeName: 'class',
		};

		expect(isAnchorNameStyleMutation(mutation)).toBe(false);
	});

	it('should return false when attributeName is not "style"', () => {
		const element = document.createElement('div');

		const mutation = {
			type: 'attributes',
			target: element,
			attributeName: 'class', // Not 'style'
		} as unknown as MutationRecordWithTimestamp;

		expect(isAnchorNameStyleMutation(mutation)).toBe(false);
	});

	it('should return false when there are no style changes', () => {
		failGate(GATE);
		const element = document.createElement('div');

		const mutation = {
			type: 'attributes',
			target: element,
			attributeName: 'style',
			oldValue: 'color: red;',
			newValue: 'color: red;', // No change
		} as unknown as MutationRecordWithTimestamp;

		expect(isAnchorNameStyleMutation(mutation)).toBe(false);
	});

	it('should return false when style changes are not related to DnD anchor names', () => {
		failGate(GATE);
		const element = document.createElement('div');

		const mutation = {
			type: 'attributes',
			target: element,
			attributeName: 'style',
			oldValue: 'color: red; font-size: 14px;',
			newValue: 'color: blue; font-size: 14px;',
		} as unknown as MutationRecordWithTimestamp;

		expect(isAnchorNameStyleMutation(mutation)).toBe(false);
	});

	it('should return false when style changes include non-DnD related anchor name changes', () => {
		failGate(GATE);
		const element = document.createElement('div');

		const mutation = {
			type: 'attributes',
			target: element,
			attributeName: 'style',
			oldValue: 'color: red;',
			newValue: 'color: red; anchor-name: --test-anchor;',
		} as unknown as MutationRecordWithTimestamp;

		expect(isAnchorNameStyleMutation(mutation)).toBe(false);
	});

	it('should return false when elements with DnD anchor names have visual changes', () => {
		failGate(GATE);
		const element = document.createElement('div');

		const mutation = {
			type: 'attributes',
			target: element,
			attributeName: 'style',
			oldValue: 'color: red; anchor-name: --node-anchor-123;',
			newValue: 'color: blue; anchor-name: --node-anchor-123;',
		} as unknown as MutationRecordWithTimestamp;

		expect(isAnchorNameStyleMutation(mutation)).toBe(false);
	});

	it('should return true when style changes include only DnD related anchor name changes', () => {
		failGate(GATE);
		const element = document.createElement('div');

		const mutation = {
			type: 'attributes',
			target: element,
			attributeName: 'style',
			oldValue: 'color: red;',
			newValue: 'color: red; anchor-name: --node-anchor-123;',
		} as unknown as MutationRecordWithTimestamp;

		expect(isAnchorNameStyleMutation(mutation)).toBe(true);
	});

	it('should return true when only DnD anchor name is removed', () => {
		failGate(GATE);
		const element = document.createElement('div');

		const mutation = {
			type: 'attributes',
			target: element,
			attributeName: 'style',
			oldValue: 'color: red; anchor-name: --node-anchor-123;',
			newValue: 'color: red;',
		} as unknown as MutationRecordWithTimestamp;

		expect(isAnchorNameStyleMutation(mutation)).toBe(true);
	});

	it('should return true when adding DnD anchor name to empty style', () => {
		failGate(GATE);
		const element = document.createElement('div');

		const mutation = {
			type: 'attributes',
			target: element,
			attributeName: 'style',
			oldValue: '',
			newValue: 'anchor-name: --node-anchor-123;',
		} as unknown as MutationRecordWithTimestamp;

		expect(isAnchorNameStyleMutation(mutation)).toBe(true);
	});

	it('should return true when adding DnD anchor name to null style', () => {
		failGate(GATE);
		const element = document.createElement('div');

		const mutation = {
			type: 'attributes',
			target: element,
			attributeName: 'style',
			oldValue: null,
			newValue: 'anchor-name: --node-anchor-123;',
		} as unknown as MutationRecordWithTimestamp;

		expect(isAnchorNameStyleMutation(mutation)).toBe(true);
	});

	it('should return true when adding DnD anchor name to undefined style', () => {
		failGate(GATE);
		const element = document.createElement('div');

		const mutation = {
			type: 'attributes',
			target: element,
			attributeName: 'style',
			oldValue: undefined,
			newValue: 'anchor-name: --node-anchor-123;',
		} as unknown as MutationRecordWithTimestamp;

		expect(isAnchorNameStyleMutation(mutation)).toBe(true);
	});

	it('should return true when removing DnD anchor name by changing to empty style', () => {
		failGate(GATE);
		const element = document.createElement('div');

		const mutation = {
			type: 'attributes',
			target: element,
			attributeName: 'style',
			oldValue: 'anchor-name: --node-anchor-123;',
			newValue: '',
		} as unknown as MutationRecordWithTimestamp;

		expect(isAnchorNameStyleMutation(mutation)).toBe(true);
	});

	it('should return true when removing DnD anchor name by changing to null style', () => {
		failGate(GATE);
		const element = document.createElement('div');

		const mutation = {
			type: 'attributes',
			target: element,
			attributeName: 'style',
			oldValue: 'anchor-name: --node-anchor-123;',
			newValue: null,
		} as unknown as MutationRecordWithTimestamp;

		expect(isAnchorNameStyleMutation(mutation)).toBe(true);
	});

	it('should return true when removing DnD anchor name by changing to undefined style', () => {
		failGate(GATE);
		const element = document.createElement('div');

		const mutation = {
			type: 'attributes',
			target: element,
			attributeName: 'style',
			oldValue: 'anchor-name: --node-anchor-123;',
			newValue: undefined,
		} as unknown as MutationRecordWithTimestamp;

		expect(isAnchorNameStyleMutation(mutation)).toBe(true);
	});

	describe(`with ${GATE}`, () => {
		// `@atlaskit/top-layer` names anchors `--anchor-<react useId>`. The exact
		// value does not matter to the check, only that it is not a DnD anchor.
		const topLayerAnchor = 'anchor-name: --anchor-r1a;';

		it('should return true when a non-DnD anchor name is added to an empty style', () => {
			passGate(GATE);
			const element = document.createElement('div');

			const mutation = {
				type: 'attributes',
				target: element,
				attributeName: 'style',
				oldValue: null,
				newValue: topLayerAnchor,
			} as unknown as MutationRecordWithTimestamp;

			expect(isAnchorNameStyleMutation(mutation)).toBe(true);
		});

		it('should return true when a non-DnD anchor name is added alongside unchanged styles', () => {
			passGate(GATE);
			const element = document.createElement('div');

			const mutation = {
				type: 'attributes',
				target: element,
				attributeName: 'style',
				oldValue: 'color: red;',
				newValue: `color: red; ${topLayerAnchor}`,
			} as unknown as MutationRecordWithTimestamp;

			expect(isAnchorNameStyleMutation(mutation)).toBe(true);
		});

		it('should return true when a non-DnD anchor name is removed', () => {
			passGate(GATE);
			const element = document.createElement('div');

			const mutation = {
				type: 'attributes',
				target: element,
				attributeName: 'style',
				oldValue: `color: red; ${topLayerAnchor}`,
				newValue: 'color: red;',
			} as unknown as MutationRecordWithTimestamp;

			expect(isAnchorNameStyleMutation(mutation)).toBe(true);
		});

		it('should return true when one anchor name is replaced by another', () => {
			passGate(GATE);
			const element = document.createElement('div');

			const mutation = {
				type: 'attributes',
				target: element,
				attributeName: 'style',
				oldValue: 'anchor-name: --anchor-r1a;',
				newValue: 'anchor-name: --anchor-r2b;',
			} as unknown as MutationRecordWithTimestamp;

			expect(isAnchorNameStyleMutation(mutation)).toBe(true);
		});

		it('should still return true for DnD anchor names', () => {
			passGate(GATE);
			const element = document.createElement('div');

			const mutation = {
				type: 'attributes',
				target: element,
				attributeName: 'style',
				oldValue: '',
				newValue: 'anchor-name: --node-anchor-123;',
			} as unknown as MutationRecordWithTimestamp;

			expect(isAnchorNameStyleMutation(mutation)).toBe(true);
		});

		it('should return false when an anchor name is added together with a visual change', () => {
			passGate(GATE);
			const element = document.createElement('div');

			const mutation = {
				type: 'attributes',
				target: element,
				attributeName: 'style',
				oldValue: 'color: red;',
				newValue: `color: blue; ${topLayerAnchor}`,
			} as unknown as MutationRecordWithTimestamp;

			expect(isAnchorNameStyleMutation(mutation)).toBe(false);
		});

		it('should return false for other anchor positioning properties', () => {
			passGate(GATE);
			const element = document.createElement('div');

			// `position-anchor` is written to the positioned element, not the
			// anchor, and does move it.
			const mutation = {
				type: 'attributes',
				target: element,
				attributeName: 'style',
				oldValue: '',
				newValue: 'position-anchor: --anchor-r1a;',
			} as unknown as MutationRecordWithTimestamp;

			expect(isAnchorNameStyleMutation(mutation)).toBe(false);
		});

		it('should return false when there are no style changes', () => {
			passGate(GATE);
			const element = document.createElement('div');

			const mutation = {
				type: 'attributes',
				target: element,
				attributeName: 'style',
				oldValue: topLayerAnchor,
				newValue: topLayerAnchor,
			} as unknown as MutationRecordWithTimestamp;

			expect(isAnchorNameStyleMutation(mutation)).toBe(false);
		});
	});
});
