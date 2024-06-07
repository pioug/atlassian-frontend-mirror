import { createRef } from 'react';

import { layers } from '@atlaskit/theme/constants';

import {
	allowEmails,
	generateSelectZIndex,
	getMenuPortalTargetCurrentHTML,
	resolveShareFooter,
	zIndexAddition,
} from '../../../components/utils';
// AFP-2532 TODO: Fix automatic suppressions below
// eslint-disable-next-line @atlassian/tangerine/import/entry-points

describe('utils functions', () => {
	describe('generateSelectZIndex', () => {
		it('should generate correct z-index for Select component', () => {
			expect(generateSelectZIndex()).toBe(layers.modal() + zIndexAddition);
			expect(generateSelectZIndex(100)).toBe(100 + zIndexAddition);
		});
	});

	describe('getMenuPortalTargetCurrentHTML', () => {
		it('shoulder return null or HTML element from ref', () => {
			const ref = createRef<HTMLDivElement>();
			let refWithElement = createRef<HTMLDivElement>();
			// @ts-ignore - cannot assign read-only property
			refWithElement.current = {};
			expect(getMenuPortalTargetCurrentHTML(null)).toBe(null);
			expect(getMenuPortalTargetCurrentHTML(ref)).toBe(null);
			expect(getMenuPortalTargetCurrentHTML(refWithElement)).toBe(refWithElement.current);
		});
	});

	describe('allowEmails', () => {
		it('should return true if no config provided', () => {
			expect(allowEmails()).toBe(true);
		});

		it('should return true if "disableSharingToEmails" key is absent', () => {
			expect(allowEmails({})).toBe(true);
		});

		it('should return true if "disableSharingToEmails" is false', () => {
			expect(
				allowEmails({
					disableSharingToEmails: false,
				}),
			).toBe(true);
		});

		it('should return false if "disableSharingToEmails" is true', () => {
			expect(
				allowEmails({
					disableSharingToEmails: true,
				}),
			).toBe(false);
		});
	});
	describe('resolveShareFooter()', () => {
		// The first tab is the default shareForm
		it('should return customFooter when integrationMode is tabs and tabIndex is the first tab only', () => {
			const customFooter = () => {};
			const actual = resolveShareFooter('tabs', 0, customFooter);
			expect(actual).toBe(customFooter);
		});
		it('should return customFooter when integrationMode is not tabs', () => {
			const customFooter = () => {};
			const actual = resolveShareFooter('split', 0, customFooter);
			expect(actual).toBe(customFooter);
		});
		it('should return undefined when tabIndex is not 0', () => {
			const actual = resolveShareFooter('tabs', 1, () => {});
			expect(actual).toBe(undefined);
		});
		it('should return undefined when customFooter is undefined', () => {
			const actual = resolveShareFooter('tabs', 1, undefined);
			expect(actual).toBe(undefined);
		});
	});
});
