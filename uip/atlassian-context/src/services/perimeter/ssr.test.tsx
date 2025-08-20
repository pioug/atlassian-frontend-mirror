/**
 * @jest-environment node
 */

import { isFedrampModerate, isIsolatedCloud, isolationContextId } from './index';

describe('Perimeter Methods for SSR (non-browser)', () => {
	beforeEach(() => {
		// for SSR, default values come from https://bitbucket.org/atlassian/tesseract-runtime/src/master/packages/common/src/executor/node-vm-executor/worker/sandbox/context.ts
		(globalThis as any).ssrContext = { isInFedramp: false, isInIC: false };
	});

	describe('Returns correct isFedrampModerate() values', () => {
		it('returns FedRAMP Moderate when ssrContext.isInFedramp is true', () => {
			(globalThis as any).ssrContext.isInFedramp = true;

			expect(isFedrampModerate()).toBe(true);
			expect(isIsolatedCloud()).toBe(false);
		});

		it('returns not FedRAMP Moderate when ssrContext.isInFedramp is false', () => {
			(globalThis as any).ssrContext.isInFedramp = false;
			expect(isFedrampModerate()).toBe(false);
			expect(isIsolatedCloud()).toBe(false);
		});
	});

	describe('Returns correct isIsolatedCloud() values', () => {
		it('returns Isolated Cloud when ssrContext.isInIC is true', () => {
			(globalThis as any).ssrContext.isInIC = true;

			expect(isFedrampModerate()).toBe(false);
			expect(isIsolatedCloud()).toBe(true);
		});

		it('returns not Isolated Cloud when ssrContext.isInIC is false', () => {
			(globalThis as any).ssrContext.isInIC = false;

			expect(isFedrampModerate()).toBe(false);
			expect(isIsolatedCloud()).toBe(false);
		});
	});

	describe('Get isolationContextId', () => {
		it('returns id when ssrContext.icName is defined and in isolated cloud environments', () => {
			(globalThis as any).ssrContext.icName = 'ic-123';
			(globalThis as any).ssrContext.isInIC = true;
			expect(isolationContextId()).toBe('ic-123');
		});

		it('returns undefined when in SSR but not in IC', () => {
			(globalThis as any).ssrContext.isInIC = false;
			(globalThis as any).ssrContext.isInFedramp = true;

			expect(isolationContextId()).toBeUndefined();
		});
	});
});
