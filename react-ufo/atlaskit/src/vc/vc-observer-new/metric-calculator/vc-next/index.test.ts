import type { VCObserverEntry, WindowEventEntryData } from '../../types';

import VCCalculator_Next from './index';

// Mock feature flags
jest.mock('@atlaskit/platform-feature-flags', () => ({
	fg: jest.fn(),
}));

jest.mock('../../../expVal');

describe('VCCalculator_Next', () => {
	let calculator: VCCalculator_Next;

	beforeEach(() => {
		calculator = new VCCalculator_Next();
	});

	describe('getVCCleanStatus', () => {
		it('should return dirty for scroll-container events', () => {
			const entries: VCObserverEntry[] = [
				{
					time: 1234,
					data: {
						type: 'window:event',
						eventType: 'scroll-container',
					} as WindowEventEntryData,
				},
			];
			expect(calculator['getVCCleanStatus'](entries)).toEqual({
				isVCClean: false,
				dirtyReason: 'scroll',
				abortTimestamp: 1234,
			});
		});

		it('should return dirty for wheel events', () => {
			const entries: VCObserverEntry[] = [
				{
					time: 500,
					data: {
						type: 'window:event',
						eventType: 'wheel',
					} as WindowEventEntryData,
				},
			];
			expect(calculator['getVCCleanStatus'](entries)).toEqual({
				isVCClean: false,
				dirtyReason: 'wheel',
				abortTimestamp: 500,
			});
		});

		it('should return dirty for scroll events', () => {
			const entries: VCObserverEntry[] = [
				{
					time: 600,
					data: {
						type: 'window:event',
						eventType: 'scroll',
					} as WindowEventEntryData,
				},
			];
			expect(calculator['getVCCleanStatus'](entries)).toEqual({
				isVCClean: false,
				dirtyReason: 'scroll',
				abortTimestamp: 600,
			});
		});

		it('should return dirty for keydown events with dirtyReason keypress', () => {
			const entries: VCObserverEntry[] = [
				{
					time: 700,
					data: {
						type: 'window:event',
						eventType: 'keydown',
					} as WindowEventEntryData,
				},
			];
			expect(calculator['getVCCleanStatus'](entries)).toEqual({
				isVCClean: false,
				dirtyReason: 'keypress',
				abortTimestamp: 700,
			});
		});

		it('should return dirty for resize events', () => {
			const entries: VCObserverEntry[] = [
				{
					time: 800,
					data: {
						type: 'window:event',
						eventType: 'resize',
					} as WindowEventEntryData,
				},
			];
			expect(calculator['getVCCleanStatus'](entries)).toEqual({
				isVCClean: false,
				dirtyReason: 'resize',
				abortTimestamp: 800,
			});
		});

		it('should return clean when no aborting window events are present', () => {
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

		it('should return clean for empty entries', () => {
			expect(calculator['getVCCleanStatus']([])).toEqual({ isVCClean: true });
		});

		it('should return dirty on the first aborting event when multiple are present', () => {
			const entries: VCObserverEntry[] = [
				{
					time: 100,
					data: {
						type: 'window:event',
						eventType: 'scroll-container',
					} as WindowEventEntryData,
				},
				{
					time: 200,
					data: {
						type: 'window:event',
						eventType: 'wheel',
					} as WindowEventEntryData,
				},
			];
			expect(calculator['getVCCleanStatus'](entries)).toEqual({
				isVCClean: false,
				dirtyReason: 'scroll',
				abortTimestamp: 100,
			});
		});
	});
});
