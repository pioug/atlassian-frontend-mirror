import { fg } from '@atlaskit/platform-feature-flags';

import { isVCRevisionEnabled } from '../../config';
import { getActiveInteraction } from '../../interaction-metrics';

import { attachAbortListeners } from './attachAbortListeners';
import { Observers } from './observers';
import type { Callback } from './observers/types';

import { VCObserver } from './index';

jest.mock('@atlaskit/platform-feature-flags');
jest.mock('./observers');
jest.mock('../../config');
jest.mock('./attachAbortListeners');
jest.mock('../../interaction-metrics');

const mockIsVCRevisionEnabled = isVCRevisionEnabled as jest.Mock;
const mockAttachAbortListeners = attachAbortListeners as jest.Mock;
const mockFg = fg as jest.Mock;
const mockGetActiveInteraction = getActiveInteraction as jest.Mock;

const VIEWPORT_WIDTH = 1000;
const VIEWPORT_HEIGHT = 500;

const mockBox = (extend: object) => ({
	top: 0,
	left: 0,
	width: 0,
	height: 0,
	right: 0,
	bottom: 0,
	x: 0,
	y: 0,
	toJSON() {
		return {};
	},
	...extend,
});

describe('vc-observer', () => {
	let vc: VCObserver;
	let callbacks: Set<Callback> = new Set();

	const enabledFeatureGateStore: string[] = [];

	const VCObserverMockImplementation = {
		observe() {},
		disconnect() {},
		isBrowserSupported() {
			return true;
		},
		subscribeResults(cb: any) {
			callbacks.add(cb);
		},
		getTotalTime() {
			return 0;
		},
	};

	beforeEach(() => {
		callbacks = new Set();
		(Observers as unknown as jest.MockedClass<any>).mockImplementation(
			() => VCObserverMockImplementation,
		);

		mockAttachAbortListeners.mockClear();
		mockFg.mockClear();
		mockGetActiveInteraction.mockClear();

		vc = new VCObserver({
			heatmapSize: 100,
			oldDomUpdates: true,
		});

		global.window = Object.create(window);
		const properties = {
			innerWidth: { value: VIEWPORT_WIDTH, writable: true },
			innerHeight: { value: VIEWPORT_HEIGHT, writable: true },
		};
		Object.defineProperties(window, properties);
		Object.defineProperties(document.documentElement, {
			clientWidth: { value: VIEWPORT_WIDTH, writable: true },
			clientHeight: { value: VIEWPORT_HEIGHT, writable: true },
		});
		enabledFeatureGateStore.splice(0, enabledFeatureGateStore.length);
	});

	describe('TTVC v1 enabled', () => {
		const enabledVCRevisions = ['fy25.01', 'fy25.02'];

		beforeEach(() => {
			mockIsVCRevisionEnabled.mockImplementation((revision) =>
				enabledVCRevisions.includes(revision),
			);
		});

		afterEach(() => {
			mockIsVCRevisionEnabled.mockClear();
		});

		test('handles full screen updates', async () => {
			vc.start({ startTime: 0 });
			callbacks.forEach((fn: Callback) => {
				fn(
					5,
					mockBox({
						top: 0,
						left: 0,
						width: VIEWPORT_WIDTH,
						height: VIEWPORT_HEIGHT,
					}),
					'body > div',
					document.createElement('div'),
					'html',
				);
			});
			const result = await vc.getVCResult({
				start: 0,
				stop: 100,
				tti: 3,
				prefix: '',
				isEventAborted: false,
				experienceKey: 'test',
				interactionType: 'page_load',
				isPageVisible: true,
			});
			expect(result).toEqual({
				'vc:state': true,
				'vc:clean': true,
				'metrics:vc': {
					25: 5,
					50: 5,
					75: 5,
					80: 5,
					85: 5,
					90: 5,
					95: 5,
					98: 5,
					99: 5,
				},
				'vc:next:dom': {
					25: ['body > div'],
					50: ['body > div'],
					75: ['body > div'],
					80: ['body > div'],
					85: ['body > div'],
					90: ['body > div'],
					95: ['body > div'],
					98: ['body > div'],
					99: ['body > div'],
				},
				'vc:dom': {
					25: ['body > div'],
					50: ['body > div'],
					75: ['body > div'],
					80: ['body > div'],
					85: ['body > div'],
					90: ['body > div'],
					95: ['body > div'],
					98: ['body > div'],
					99: ['body > div'],
				},
				'vc:ratios': {
					'body > div': 1,
				},
				'vc:size': {
					w: VIEWPORT_WIDTH,
					h: VIEWPORT_HEIGHT,
				},
				'vc:ssrRatio': undefined,
				'vc:updates': [{ time: 5, vc: 100, elements: ['body > div'] }],
				'vc:time': expect.any(Number),
				'vc:total': 10000,
				'vc:next': {
					25: 5,
					50: 5,
					75: 5,
					80: 5,
					85: 5,
					90: 5,
					95: 5,
					98: 5,
					99: 5,
				},
				'vc:next:updates': [{ time: 5, vc: 100, elements: ['body > div'] }],
				'vc:ignored': [],
				'ufo:next:speedIndex': 5,
				'ufo:speedIndex': 5,
				'vc:rev': [
					{
						clean: true,
						'metric:vc90': 5,
						ratios: {
							'body > div': 1,
						},
						revision: 'fy25.01',
						vcDetails: {
							'25': {
								e: ['body > div'],
								t: 5,
							},
							'50': {
								e: ['body > div'],
								t: 5,
							},
							'75': {
								e: ['body > div'],
								t: 5,
							},
							'80': {
								e: ['body > div'],
								t: 5,
							},
							'85': {
								e: ['body > div'],
								t: 5,
							},
							'90': {
								e: ['body > div'],
								t: 5,
							},
							'95': {
								e: ['body > div'],
								t: 5,
							},
							'98': {
								e: ['body > div'],
								t: 5,
							},
							'99': {
								e: ['body > div'],
								t: 5,
							},
						},
					},
					{
						clean: true,
						'metric:vc90': 5,
						ratios: {
							'body > div': 1,
						},
						revision: 'fy25.02',
						vcDetails: {
							'25': {
								e: ['body > div'],
								t: 5,
							},
							'50': {
								e: ['body > div'],
								t: 5,
							},
							'75': {
								e: ['body > div'],
								t: 5,
							},
							'80': {
								e: ['body > div'],
								t: 5,
							},
							'85': {
								e: ['body > div'],
								t: 5,
							},
							'90': {
								e: ['body > div'],
								t: 5,
							},
							'95': {
								e: ['body > div'],
								t: 5,
							},
							'98': {
								e: ['body > div'],
								t: 5,
							},
							'99': {
								e: ['body > div'],
								t: 5,
							},
						},
					},
				],
			});
		});

		test('reports progress properly in entries', async () => {
			vc.start({ startTime: 0 });
			callbacks.forEach((fn: Callback) => {
				fn(
					5,
					mockBox({
						top: 0,
						left: 0,
						width: VIEWPORT_WIDTH,
						height: VIEWPORT_HEIGHT,
					}),
					'div#a',
					document.createElement('div'),
					'html',
				);
				fn(
					10,
					mockBox({
						top: 0,
						left: 0,
						width: VIEWPORT_WIDTH,
						height: VIEWPORT_HEIGHT / 2,
					}),
					'div#b',
					document.createElement('div'),
					'html',
				);
				fn(
					15,
					mockBox({
						top: 0,
						left: 0,
						width: VIEWPORT_WIDTH / 2,
						height: VIEWPORT_HEIGHT / 2,
					}),
					'div#c',
					document.createElement('div'),
					'html',
				);
				fn(
					20,
					mockBox({
						top: 0,
						left: 0,
						width: VIEWPORT_WIDTH / 4,
						height: VIEWPORT_HEIGHT / 4,
					}),
					'div#d',
					document.createElement('div'),
					'html',
				);
			});
			const result = await vc.getVCResult({
				start: 0,
				stop: 100,
				tti: 3,
				prefix: '',
				isEventAborted: false,
				experienceKey: 'test',
				interactionType: 'page_load',
				isPageVisible: true,
			});
			expect(result).toEqual({
				'ufo:next:speedIndex': 9,
				'ufo:speedIndex': 9,
				'vc:state': true,
				'vc:clean': true,
				'metrics:vc': {
					25: 5,
					50: 5,
					75: 10,
					80: 15,
					85: 15,
					90: 15,
					95: 20,
					98: 20,
					99: 20,
				},
				'vc:next:dom': {
					25: ['div#a'],
					50: ['div#a'],
					75: ['div#b'],
					80: ['div#c'],
					85: ['div#c'],
					90: ['div#c'],
					95: ['div#d'],
					98: ['div#d'],
					99: ['div#d'],
				},
				'vc:dom': {
					25: ['div#a'],
					50: ['div#a'],
					75: ['div#b'],
					80: ['div#c'],
					85: ['div#c'],
					90: ['div#c'],
					95: ['div#d'],
					98: ['div#d'],
					99: ['div#d'],
				},
				'vc:ratios': {
					'div#a': 1,
					'div#b': 0.5,
					'div#c': 0.25,
					'div#d': 0.0625,
				},
				'vc:size': {
					w: VIEWPORT_WIDTH,
					h: VIEWPORT_HEIGHT,
				},
				'vc:ssrRatio': undefined,
				'vc:updates': [
					{ time: 5, vc: 50, elements: ['div#a'] },
					{ time: 10, vc: 75, elements: ['div#b'] },
					{ time: 15, vc: 93.8, elements: ['div#c'] },
					{ time: 20, vc: 100, elements: ['div#d'] },
				],
				'vc:time': expect.any(Number),
				'vc:total': 10000,
				'vc:next': {
					25: 5,
					50: 5,
					75: 10,
					80: 15,
					85: 15,
					90: 15,
					95: 20,
					98: 20,
					99: 20,
				},
				'vc:next:updates': [
					{ time: 5, vc: 50, elements: ['div#a'] },
					{ time: 10, vc: 75, elements: ['div#b'] },
					{ time: 15, vc: 93.8, elements: ['div#c'] },
					{ time: 20, vc: 100, elements: ['div#d'] },
				],
				'vc:ignored': [],
				'vc:rev': [
					{
						clean: true,
						'metric:vc90': 15,
						ratios: {
							'div#a': 1,
							'div#b': 0.5,
							'div#c': 0.25,
							'div#d': 0.0625,
						},
						revision: 'fy25.01',
						vcDetails: {
							'25': {
								e: ['div#a'],
								t: 5,
							},
							'50': {
								e: ['div#a'],
								t: 5,
							},
							'75': {
								e: ['div#b'],
								t: 10,
							},
							'80': {
								e: ['div#c'],
								t: 15,
							},
							'85': {
								e: ['div#c'],
								t: 15,
							},
							'90': {
								e: ['div#c'],
								t: 15,
							},
							'95': {
								e: ['div#d'],
								t: 20,
							},
							'98': {
								e: ['div#d'],
								t: 20,
							},
							'99': {
								e: ['div#d'],
								t: 20,
							},
						},
					},
					{
						clean: true,
						'metric:vc90': 15,
						ratios: {
							'div#a': 1,
							'div#b': 0.5,
							'div#c': 0.25,
							'div#d': 0.0625,
						},
						revision: 'fy25.02',
						vcDetails: {
							'25': {
								e: ['div#a'],
								t: 5,
							},
							'50': {
								e: ['div#a'],
								t: 5,
							},
							'75': {
								e: ['div#b'],
								t: 10,
							},
							'80': {
								e: ['div#c'],
								t: 15,
							},
							'85': {
								e: ['div#c'],
								t: 15,
							},
							'90': {
								e: ['div#c'],
								t: 15,
							},
							'95': {
								e: ['div#d'],
								t: 20,
							},
							'98': {
								e: ['div#d'],
								t: 20,
							},
							'99': {
								e: ['div#d'],
								t: 20,
							},
						},
					},
				],
			});
		});

		test('removes duplicate entries in VC result', async () => {
			vc.start({ startTime: 0 });
			callbacks.forEach((fn: Callback) => {
				// Single entries for div#a, div#b, div#c
				fn(
					5,
					mockBox({
						top: 0,
						left: 0,
						width: VIEWPORT_WIDTH,
						height: VIEWPORT_HEIGHT,
					}),
					'div#a',
					document.createElement('div'),
					'html',
				);
				fn(
					10,
					mockBox({
						top: 0,
						left: 0,
						width: VIEWPORT_WIDTH,
						height: VIEWPORT_HEIGHT / 2,
					}),
					'div#b',
					document.createElement('div'),
					'html',
				);
				fn(
					15,
					mockBox({
						top: 0,
						left: 0,
						width: VIEWPORT_WIDTH / 2,
						height: VIEWPORT_HEIGHT / 2,
					}),
					'div#c',
					document.createElement('div'),
					'html',
				);
				// Duplicate entries for div#d
				fn(
					20,
					mockBox({
						top: 0,
						left: 0,
						width: VIEWPORT_WIDTH / 4,
						height: VIEWPORT_HEIGHT / 4,
					}),
					'div#d',
					document.createElement('div'),
					'html',
				);
				fn(
					20,
					mockBox({
						top: 0,
						left: 0,
						width: VIEWPORT_WIDTH / 4,
						height: VIEWPORT_HEIGHT / 4,
					}),
					'div#d',
					document.createElement('div'),
					'html',
				);
				fn(
					20,
					mockBox({
						top: 0,
						left: 0,
						width: VIEWPORT_WIDTH / 4,
						height: VIEWPORT_HEIGHT / 4,
					}),
					'div#d',
					document.createElement('div'),
					'html',
				);
				fn(
					20,
					mockBox({
						top: 0,
						left: 0,
						width: VIEWPORT_WIDTH / 4,
						height: VIEWPORT_HEIGHT / 4,
					}),
					'div#d',
					document.createElement('div'),
					'html',
				);
			});
			const result = await vc.getVCResult({
				start: 0,
				stop: 100,
				tti: 3,
				prefix: '',
				isEventAborted: false,
				experienceKey: 'test',
				interactionType: 'page_load',
				isPageVisible: true,
			});
			expect(result).toEqual({
				'ufo:next:speedIndex': 9,
				'ufo:speedIndex': 9,
				'vc:state': true,
				'vc:clean': true,
				'metrics:vc': {
					25: 5,
					50: 5,
					75: 10,
					80: 15,
					85: 15,
					90: 15,
					95: 20,
					98: 20,
					99: 20,
				},
				'vc:next:dom': {
					25: ['div#a'],
					50: ['div#a'],
					75: ['div#b'],
					80: ['div#c'],
					85: ['div#c'],
					90: ['div#c'],
					95: ['div#d'],
					98: ['div#d'],
					99: ['div#d'],
				},
				'vc:dom': {
					25: ['div#a'],
					50: ['div#a'],
					75: ['div#b'],
					80: ['div#c'],
					85: ['div#c'],
					90: ['div#c'],
					95: ['div#d'],
					98: ['div#d'],
					99: ['div#d'],
				},
				'vc:ratios': {
					'div#a': 1,
					'div#b': 0.5,
					'div#c': 0.25,
					'div#d': 0.0625,
				},
				'vc:size': {
					w: VIEWPORT_WIDTH,
					h: VIEWPORT_HEIGHT,
				},
				'vc:ssrRatio': undefined,
				'vc:updates': [
					{ time: 5, vc: 50, elements: ['div#a'] },
					{ time: 10, vc: 75, elements: ['div#b'] },
					{ time: 15, vc: 93.8, elements: ['div#c'] },
					{ time: 20, vc: 100, elements: ['div#d'] },
				],
				'vc:time': expect.any(Number),
				'vc:total': 10000,
				'vc:next': {
					25: 5,
					50: 5,
					75: 10,
					80: 15,
					85: 15,
					90: 15,
					95: 20,
					98: 20,
					99: 20,
				},
				'vc:next:updates': [
					{ time: 5, vc: 50, elements: ['div#a'] },
					{ time: 10, vc: 75, elements: ['div#b'] },
					{ time: 15, vc: 93.8, elements: ['div#c'] },
					{ time: 20, vc: 100, elements: ['div#d'] },
				],
				'vc:ignored': [],
				'vc:rev': [
					{
						clean: true,
						'metric:vc90': 15,
						ratios: {
							'div#a': 1,
							'div#b': 0.5,
							'div#c': 0.25,
							'div#d': 0.0625,
						},
						revision: 'fy25.01',
						vcDetails: {
							'25': {
								e: ['div#a'],
								t: 5,
							},
							'50': {
								e: ['div#a'],
								t: 5,
							},
							'75': {
								e: ['div#b'],
								t: 10,
							},
							'80': {
								e: ['div#c'],
								t: 15,
							},
							'85': {
								e: ['div#c'],
								t: 15,
							},
							'90': {
								e: ['div#c'],
								t: 15,
							},
							'95': {
								e: ['div#d'],
								t: 20,
							},
							'98': {
								e: ['div#d'],
								t: 20,
							},
							'99': {
								e: ['div#d'],
								t: 20,
							},
						},
					},
					{
						clean: true,
						'metric:vc90': 15,
						ratios: {
							'div#a': 1,
							'div#b': 0.5,
							'div#c': 0.25,
							'div#d': 0.0625,
						},
						revision: 'fy25.02',
						vcDetails: {
							'25': {
								e: ['div#a'],
								t: 5,
							},
							'50': {
								e: ['div#a'],
								t: 5,
							},
							'75': {
								e: ['div#b'],
								t: 10,
							},
							'80': {
								e: ['div#c'],
								t: 15,
							},
							'85': {
								e: ['div#c'],
								t: 15,
							},
							'90': {
								e: ['div#c'],
								t: 15,
							},
							'95': {
								e: ['div#d'],
								t: 20,
							},
							'98': {
								e: ['div#d'],
								t: 20,
							},
							'99': {
								e: ['div#d'],
								t: 20,
							},
						},
					},
				],
			});
		});

		test('ignores ignored fields properly', async () => {
			vc.start({ startTime: 0 });
			callbacks.forEach((fn: Callback) => {
				fn(
					5,
					mockBox({
						top: 0,
						left: 0,
						width: VIEWPORT_WIDTH,
						height: VIEWPORT_HEIGHT,
					}),
					'div#a',
					document.createElement('div'),
					'html',
				);
				fn(
					10,
					mockBox({
						top: 0,
						left: 0,
						width: VIEWPORT_WIDTH,
						height: VIEWPORT_HEIGHT / 2,
					}),
					'div#b',
					document.createElement('div'),
					'html',
					'image',
				);
				fn(
					15,
					mockBox({
						top: 0,
						left: 0,
						width: VIEWPORT_WIDTH / 2,
						height: VIEWPORT_HEIGHT / 2,
					}),
					'div#c',
					document.createElement('div'),
					'html',
				);
				fn(
					20,
					mockBox({
						top: 0,
						left: 0,
						width: VIEWPORT_WIDTH / 4,
						height: VIEWPORT_HEIGHT / 4,
					}),
					'div#d',
					document.createElement('div'),
					'html',
				);
			});
			const result = await vc.getVCResult({
				start: 0,
				stop: 100,
				tti: 3,
				prefix: '',
				isEventAborted: false,
				experienceKey: 'test',
				interactionType: 'page_load',
				isPageVisible: true,
			});
			expect(result).toEqual({
				'ufo:next:speedIndex': 8,
				'ufo:speedIndex': 8,
				'vc:state': true,
				'vc:clean': true,
				'metrics:vc': {
					25: 5,
					50: 5,
					75: 5,
					80: 15,
					85: 15,
					90: 15,
					95: 20,
					98: 20,
					99: 20,
				},
				'vc:next:dom': {
					25: ['div#a'],
					50: ['div#a'],
					75: ['div#a'],
					80: ['div#c'],
					85: ['div#c'],
					90: ['div#c'],
					95: ['div#d'],
					98: ['div#d'],
					99: ['div#d'],
				},
				'vc:dom': {
					25: ['div#a'],
					50: ['div#a'],
					75: ['div#a'],
					80: ['div#c'],
					85: ['div#c'],
					90: ['div#c'],
					95: ['div#d'],
					98: ['div#d'],
					99: ['div#d'],
				},
				'vc:ratios': {
					'div#a': 1,
					'div#b': 0.5,
					'div#c': 0.25,
					'div#d': 0.0625,
				},
				'vc:size': {
					w: VIEWPORT_WIDTH,
					h: VIEWPORT_HEIGHT,
				},
				'vc:ssrRatio': undefined,
				'vc:updates': [
					{ time: 5, vc: 75, elements: ['div#a'] },
					{ time: 15, vc: 93.8, elements: ['div#c'] },
					{ time: 20, vc: 100, elements: ['div#d'] },
				],
				'vc:time': expect.any(Number),
				'vc:total': 10000,
				'vc:next': {
					25: 5,
					50: 5,
					75: 5,
					80: 15,
					85: 15,
					90: 15,
					95: 20,
					98: 20,
					99: 20,
				},
				'vc:next:updates': [
					{ time: 5, vc: 75, elements: ['div#a'] },
					{ time: 15, vc: 93.8, elements: ['div#c'] },
					{ time: 20, vc: 100, elements: ['div#d'] },
				],
				'vc:ignored': [
					{
						targetName: 'div#b',
						ignoreReason: 'image',
					},
				],
				'vc:rev': [
					{
						clean: true,
						'metric:vc90': 15,
						ratios: {
							'div#a': 1,
							'div#b': 0.5,
							'div#c': 0.25,
							'div#d': 0.0625,
						},
						revision: 'fy25.01',
						vcDetails: {
							'25': {
								e: ['div#a'],
								t: 5,
							},
							'50': {
								e: ['div#a'],
								t: 5,
							},
							'75': {
								e: ['div#a'],
								t: 5,
							},
							'80': {
								e: ['div#c'],
								t: 15,
							},
							'85': {
								e: ['div#c'],
								t: 15,
							},
							'90': {
								e: ['div#c'],
								t: 15,
							},
							'95': {
								e: ['div#d'],
								t: 20,
							},
							'98': {
								e: ['div#d'],
								t: 20,
							},
							'99': {
								e: ['div#d'],
								t: 20,
							},
						},
					},
					{
						clean: true,
						'metric:vc90': 15,
						ratios: {
							'div#a': 1,
							'div#b': 0.5,
							'div#c': 0.25,
							'div#d': 0.0625,
						},
						revision: 'fy25.02',
						vcDetails: {
							'25': {
								e: ['div#a'],
								t: 5,
							},
							'50': {
								e: ['div#a'],
								t: 5,
							},
							'75': {
								e: ['div#a'],
								t: 5,
							},
							'80': {
								e: ['div#c'],
								t: 15,
							},
							'85': {
								e: ['div#c'],
								t: 15,
							},
							'90': {
								e: ['div#c'],
								t: 15,
							},
							'95': {
								e: ['div#d'],
								t: 20,
							},
							'98': {
								e: ['div#d'],
								t: 20,
							},
							'99': {
								e: ['div#d'],
								t: 20,
							},
						},
					},
				],
			});
		});

		test('updates attributes only in the new field', async () => {
			vc.start({ startTime: 0 });
			callbacks.forEach((fn: Callback) => {
				fn(
					5,
					mockBox({
						top: 0,
						left: 0,
						width: VIEWPORT_WIDTH,
						height: VIEWPORT_HEIGHT,
					}),
					'div#a',
					document.createElement('div'),
					'html',
				);
				fn(
					10,
					mockBox({
						top: 0,
						left: 0,
						width: VIEWPORT_WIDTH,
						height: VIEWPORT_HEIGHT / 2,
					}),
					'div#b',
					document.createElement('div'),
					'attr',
				);
				fn(
					15,
					mockBox({
						top: 0,
						left: 0,
						width: VIEWPORT_WIDTH / 2,
						height: VIEWPORT_HEIGHT / 2,
					}),
					'div#c',
					document.createElement('div'),
					'html',
				);
				fn(
					20,
					mockBox({
						top: 0,
						left: 0,
						width: VIEWPORT_WIDTH / 4,
						height: VIEWPORT_HEIGHT / 4,
					}),
					'div#d',
					document.createElement('div'),
					'html',
				);
			});
			const result = await vc.getVCResult({
				start: 0,
				stop: 100,
				tti: 3,
				prefix: '',
				isEventAborted: false,
				experienceKey: 'test',
				interactionType: 'page_load',
				isPageVisible: true,
			});
			expect(result).toEqual({
				'ufo:next:speedIndex': 9,
				'ufo:speedIndex': 8,
				'vc:state': true,
				'vc:clean': true,
				'metrics:vc': {
					25: 5,
					50: 5,
					75: 5,
					80: 15,
					85: 15,
					90: 15,
					95: 20,
					98: 20,
					99: 20,
				},
				'vc:next:dom': {
					25: ['div#a'],
					50: ['div#a'],
					75: ['div#b'],
					80: ['div#c'],
					85: ['div#c'],
					90: ['div#c'],
					95: ['div#d'],
					98: ['div#d'],
					99: ['div#d'],
				},
				'vc:dom': {
					25: ['div#a'],
					50: ['div#a'],
					75: ['div#a'],
					80: ['div#c'],
					85: ['div#c'],
					90: ['div#c'],
					95: ['div#d'],
					98: ['div#d'],
					99: ['div#d'],
				},
				'vc:ratios': {
					'div#a': 1,
					'div#b': 0.5,
					'div#c': 0.25,
					'div#d': 0.0625,
				},
				'vc:size': {
					w: VIEWPORT_WIDTH,
					h: VIEWPORT_HEIGHT,
				},
				'vc:ssrRatio': undefined,
				'vc:updates': [
					{ time: 5, vc: 75, elements: ['div#a'] },
					//{ time: 10, vc: 75, elements: ['div#b'] },
					{ time: 15, vc: 93.8, elements: ['div#c'] },
					{ time: 20, vc: 100, elements: ['div#d'] },
				],
				'vc:time': expect.any(Number),
				'vc:total': 10000,
				'vc:next': {
					25: 5,
					50: 5,
					75: 10,
					80: 15,
					85: 15,
					90: 15,
					95: 20,
					98: 20,
					99: 20,
				},
				'vc:next:updates': [
					{ time: 5, vc: 50, elements: ['div#a'] },
					{ time: 10, vc: 75, elements: ['div#b'] },
					{ time: 15, vc: 93.8, elements: ['div#c'] },
					{ time: 20, vc: 100, elements: ['div#d'] },
				],
				'vc:ignored': [],
				'vc:rev': [
					{
						clean: true,
						'metric:vc90': 15,
						ratios: {
							'div#a': 1,
							'div#b': 0.5,
							'div#c': 0.25,
							'div#d': 0.0625,
						},
						revision: 'fy25.01',
						vcDetails: {
							'25': {
								e: ['div#a'],
								t: 5,
							},
							'50': {
								e: ['div#a'],
								t: 5,
							},
							'75': {
								e: ['div#a'],
								t: 5,
							},
							'80': {
								e: ['div#c'],
								t: 15,
							},
							'85': {
								e: ['div#c'],
								t: 15,
							},
							'90': {
								e: ['div#c'],
								t: 15,
							},
							'95': {
								e: ['div#d'],
								t: 20,
							},
							'98': {
								e: ['div#d'],
								t: 20,
							},
							'99': {
								e: ['div#d'],
								t: 20,
							},
						},
					},
					{
						clean: true,
						'metric:vc90': 15,
						ratios: {
							'div#a': 1,
							'div#b': 0.5,
							'div#c': 0.25,
							'div#d': 0.0625,
						},
						revision: 'fy25.02',
						vcDetails: {
							'25': {
								e: ['div#a'],
								t: 5,
							},
							'50': {
								e: ['div#a'],
								t: 5,
							},
							'75': {
								e: ['div#b'],
								t: 10,
							},
							'80': {
								e: ['div#c'],
								t: 15,
							},
							'85': {
								e: ['div#c'],
								t: 15,
							},
							'90': {
								e: ['div#c'],
								t: 15,
							},
							'95': {
								e: ['div#d'],
								t: 20,
							},
							'98': {
								e: ['div#d'],
								t: 20,
							},
							'99': {
								e: ['div#d'],
								t: 20,
							},
						},
					},
				],
			});
		});

		test('supports multiple starts properly', async () => {
			vc.start({ startTime: 0 });
			callbacks.forEach((fn: Callback) => {
				fn(
					5,
					mockBox({
						top: 0,
						left: 0,
						width: VIEWPORT_WIDTH,
						height: VIEWPORT_HEIGHT,
					}),
					'div#a',
					document.createElement('div'),
					'html',
				);
			});
			const result = await vc.getVCResult({
				start: 0,
				stop: 100,
				tti: 3,
				prefix: '',
				isEventAborted: false,
				experienceKey: 'test',
				interactionType: 'page_load',
				isPageVisible: true,
			});
			expect(result).toEqual({
				'ufo:next:speedIndex': 5,
				'ufo:speedIndex': 5,
				'vc:state': true,
				'vc:clean': true,
				'metrics:vc': {
					25: 5,
					50: 5,
					75: 5,
					80: 5,
					85: 5,
					90: 5,
					95: 5,
					98: 5,
					99: 5,
				},
				'vc:next:dom': {
					25: ['div#a'],
					50: ['div#a'],
					75: ['div#a'],
					80: ['div#a'],
					85: ['div#a'],
					90: ['div#a'],
					95: ['div#a'],
					98: ['div#a'],
					99: ['div#a'],
				},
				'vc:dom': {
					25: ['div#a'],
					50: ['div#a'],
					75: ['div#a'],
					80: ['div#a'],
					85: ['div#a'],
					90: ['div#a'],
					95: ['div#a'],
					98: ['div#a'],
					99: ['div#a'],
				},
				'vc:ratios': {
					'div#a': 1,
				},
				'vc:size': {
					w: VIEWPORT_WIDTH,
					h: VIEWPORT_HEIGHT,
				},
				'vc:ssrRatio': undefined,
				'vc:updates': [{ time: 5, vc: 100, elements: ['div#a'] }],
				'vc:time': expect.any(Number),
				'vc:total': 10000,
				'vc:next': {
					25: 5,
					50: 5,
					75: 5,
					80: 5,
					85: 5,
					90: 5,
					95: 5,
					98: 5,
					99: 5,
				},
				'vc:next:updates': [{ time: 5, vc: 100, elements: ['div#a'] }],
				'vc:ignored': [],
				'vc:rev': [
					{
						clean: true,
						'metric:vc90': 5,
						ratios: {
							'div#a': 1,
						},
						revision: 'fy25.01',
						vcDetails: {
							'25': {
								e: ['div#a'],
								t: 5,
							},
							'50': {
								e: ['div#a'],
								t: 5,
							},
							'75': {
								e: ['div#a'],
								t: 5,
							},
							'80': {
								e: ['div#a'],
								t: 5,
							},
							'85': {
								e: ['div#a'],
								t: 5,
							},
							'90': {
								e: ['div#a'],
								t: 5,
							},
							'95': {
								e: ['div#a'],
								t: 5,
							},
							'98': {
								e: ['div#a'],
								t: 5,
							},
							'99': {
								e: ['div#a'],
								t: 5,
							},
						},
					},
					{
						clean: true,
						'metric:vc90': 5,
						ratios: {
							'div#a': 1,
						},
						revision: 'fy25.02',
						vcDetails: {
							'25': {
								e: ['div#a'],
								t: 5,
							},
							'50': {
								e: ['div#a'],
								t: 5,
							},
							'75': {
								e: ['div#a'],
								t: 5,
							},
							'80': {
								e: ['div#a'],
								t: 5,
							},
							'85': {
								e: ['div#a'],
								t: 5,
							},
							'90': {
								e: ['div#a'],
								t: 5,
							},
							'95': {
								e: ['div#a'],
								t: 5,
							},
							'98': {
								e: ['div#a'],
								t: 5,
							},
							'99': {
								e: ['div#a'],
								t: 5,
							},
						},
					},
				],
			});

			vc.start({ startTime: 100 });
			callbacks.forEach((fn: Callback) => {
				fn(
					110,
					mockBox({
						top: 0,
						left: 0,
						width: VIEWPORT_WIDTH / 2,
						height: VIEWPORT_HEIGHT / 2,
					}),
					'div#b',
					document.createElement('div'),
					'html',
				);
			});
			const resultTransition = await vc.getVCResult({
				start: 100,
				stop: 200,
				tti: 3,
				prefix: '',
				isEventAborted: false,
				experienceKey: 'test',
				interactionType: 'page_load',
				isPageVisible: true,
			});
			expect(resultTransition).toEqual({
				'ufo:next:speedIndex': 10,
				'ufo:speedIndex': 10,
				'vc:state': true,
				'vc:clean': true,
				'metrics:vc': {
					25: 10,
					50: 10,
					75: 10,
					80: 10,
					85: 10,
					90: 10,
					95: 10,
					98: 10,
					99: 10,
				},
				'vc:next:dom': {
					25: ['div#b'],
					50: ['div#b'],
					75: ['div#b'],
					80: ['div#b'],
					85: ['div#b'],
					90: ['div#b'],
					95: ['div#b'],
					98: ['div#b'],
					99: ['div#b'],
				},
				'vc:dom': {
					25: ['div#b'],
					50: ['div#b'],
					75: ['div#b'],
					80: ['div#b'],
					85: ['div#b'],
					90: ['div#b'],
					95: ['div#b'],
					98: ['div#b'],
					99: ['div#b'],
				},
				'vc:ratios': {
					'div#b': 0.25,
				},
				'vc:size': {
					w: VIEWPORT_WIDTH,
					h: VIEWPORT_HEIGHT,
				},
				'vc:ssrRatio': undefined,
				'vc:updates': [{ time: 10, vc: 100, elements: ['div#b'] }],
				'vc:time': expect.any(Number),
				'vc:total': 2500,
				'vc:next': {
					25: 10,
					50: 10,
					75: 10,
					80: 10,
					85: 10,
					90: 10,
					95: 10,
					98: 10,
					99: 10,
				},
				'vc:next:updates': [{ time: 10, vc: 100, elements: ['div#b'] }],
				'vc:ignored': [],
				'vc:rev': [
					{
						clean: true,
						'metric:vc90': 10,
						ratios: {
							'div#b': 0.25,
						},
						revision: 'fy25.01',
						vcDetails: {
							'25': {
								e: ['div#b'],
								t: 10,
							},
							'50': {
								e: ['div#b'],
								t: 10,
							},
							'75': {
								e: ['div#b'],
								t: 10,
							},
							'80': {
								e: ['div#b'],
								t: 10,
							},
							'85': {
								e: ['div#b'],
								t: 10,
							},
							'90': {
								e: ['div#b'],
								t: 10,
							},
							'95': {
								e: ['div#b'],
								t: 10,
							},
							'98': {
								e: ['div#b'],
								t: 10,
							},
							'99': {
								e: ['div#b'],
								t: 10,
							},
						},
					},
					{
						clean: true,
						'metric:vc90': 10,
						ratios: {
							'div#b': 0.25,
						},
						revision: 'fy25.02',
						vcDetails: {
							'25': {
								e: ['div#b'],
								t: 10,
							},
							'50': {
								e: ['div#b'],
								t: 10,
							},
							'75': {
								e: ['div#b'],
								t: 10,
							},
							'80': {
								e: ['div#b'],
								t: 10,
							},
							'85': {
								e: ['div#b'],
								t: 10,
							},
							'90': {
								e: ['div#b'],
								t: 10,
							},
							'95': {
								e: ['div#b'],
								t: 10,
							},
							'98': {
								e: ['div#b'],
								t: 10,
							},
							'99': {
								e: ['div#b'],
								t: 10,
							},
						},
					},
				],
			});
		});

		test('applies SSR timings properly', async () => {
			vc.start({ startTime: 0 });
			callbacks.forEach((fn: Callback) => {
				fn(
					10,
					mockBox({
						top: 0,
						left: 0,
						width: VIEWPORT_WIDTH,
						height: VIEWPORT_HEIGHT / 2,
					}),
					'div#b',
					document.createElement('div'),
					'html',
				);
			});
			const result = await vc.getVCResult({
				start: 0,
				stop: 100,
				tti: 3,
				prefix: '',
				ssr: 3,
				isEventAborted: false,
				experienceKey: 'test',
				interactionType: 'page_load',
				isPageVisible: true,
			});
			expect(result).toEqual({
				'ufo:next:speedIndex': 7,
				'ufo:speedIndex': 7,
				'vc:state': true,
				'vc:clean': true,
				'metrics:vc': {
					25: 3,
					50: 3,
					75: 10,
					80: 10,
					85: 10,
					90: 10,
					95: 10,
					98: 10,
					99: 10,
				},
				'vc:next:dom': {
					25: ['SSR'],
					50: ['SSR'],
					75: ['div#b'],
					80: ['div#b'],
					85: ['div#b'],
					90: ['div#b'],
					95: ['div#b'],
					98: ['div#b'],
					99: ['div#b'],
				},
				'vc:dom': {
					25: ['SSR'],
					50: ['SSR'],
					75: ['div#b'],
					80: ['div#b'],
					85: ['div#b'],
					90: ['div#b'],
					95: ['div#b'],
					98: ['div#b'],
					99: ['div#b'],
				},
				'vc:ratios': {
					'div#b': 0.5,
				},
				'vc:size': {
					w: VIEWPORT_WIDTH,
					h: VIEWPORT_HEIGHT,
				},
				'vc:updates': [
					{ time: 3, vc: 50, elements: ['SSR'] },
					{ time: 10, vc: 100, elements: ['div#b'] },
				],
				'vc:time': expect.any(Number),
				'vc:total': 10000,
				'vc:next': {
					25: 3,
					50: 3,
					75: 10,
					80: 10,
					85: 10,
					90: 10,
					95: 10,
					98: 10,
					99: 10,
				},
				'vc:next:updates': [
					{ time: 3, vc: 50, elements: ['SSR'] },
					{ time: 10, vc: 100, elements: ['div#b'] },
				],
				'vc:ignored': [],
				'vc:rev': [
					{
						clean: true,
						'metric:vc90': 10,
						ratios: {
							'div#b': 0.5,
						},
						revision: 'fy25.01',
						vcDetails: {
							'25': {
								e: ['SSR'],
								t: 3,
							},
							'50': {
								e: ['SSR'],
								t: 3,
							},
							'75': {
								e: ['div#b'],
								t: 10,
							},
							'80': {
								e: ['div#b'],
								t: 10,
							},
							'85': {
								e: ['div#b'],
								t: 10,
							},
							'90': {
								e: ['div#b'],
								t: 10,
							},
							'95': {
								e: ['div#b'],
								t: 10,
							},
							'98': {
								e: ['div#b'],
								t: 10,
							},
							'99': {
								e: ['div#b'],
								t: 10,
							},
						},
					},
					{
						clean: true,
						'metric:vc90': 10,
						ratios: {
							'div#b': 0.5,
						},
						revision: 'fy25.02',
						vcDetails: {
							'25': {
								e: ['SSR'],
								t: 3,
							},
							'50': {
								e: ['SSR'],
								t: 3,
							},
							'75': {
								e: ['div#b'],
								t: 10,
							},
							'80': {
								e: ['div#b'],
								t: 10,
							},
							'85': {
								e: ['div#b'],
								t: 10,
							},
							'90': {
								e: ['div#b'],
								t: 10,
							},
							'95': {
								e: ['div#b'],
								t: 10,
							},
							'98': {
								e: ['div#b'],
								t: 10,
							},
							'99': {
								e: ['div#b'],
								t: 10,
							},
						},
					},
				],
				'vc:ssrRatio': 50,
			});
		});
	});

	describe('TTVC v1 disabled', () => {
		const enabledVCRevisions = ['fy25.02'];

		beforeEach(() => {
			mockIsVCRevisionEnabled.mockImplementation((revision) =>
				enabledVCRevisions.includes(revision),
			);
		});

		afterEach(() => {
			mockIsVCRevisionEnabled.mockClear();
		});

		test('handles full screen updates', async () => {
			vc.start({ startTime: 0 });
			callbacks.forEach((fn: Callback) => {
				fn(
					5,
					mockBox({
						top: 0,
						left: 0,
						width: VIEWPORT_WIDTH,
						height: VIEWPORT_HEIGHT,
					}),
					'body > div',
					document.createElement('div'),
					'html',
				);
			});
			const result = await vc.getVCResult({
				start: 0,
				stop: 100,
				tti: 3,
				prefix: '',
				isEventAborted: false,
				experienceKey: 'test',
				interactionType: 'page_load',
				isPageVisible: true,
			});
			expect(result).toEqual({
				'ufo:next:speedIndex': 5,
				'ufo:speedIndex': 5,
				'vc:ratios': {
					'body > div': 1,
				},
				'vc:size': {
					w: VIEWPORT_WIDTH,
					h: VIEWPORT_HEIGHT,
				},
				'vc:ssrRatio': undefined,
				'vc:time': expect.any(Number),
				'vc:ignored': [],
				'vc:rev': [
					{
						clean: true,
						'metric:vc90': 5,
						ratios: {
							'body > div': 1,
						},
						revision: 'fy25.02',
						vcDetails: {
							'25': {
								e: ['body > div'],
								t: 5,
							},
							'50': {
								e: ['body > div'],
								t: 5,
							},
							'75': {
								e: ['body > div'],
								t: 5,
							},
							'80': {
								e: ['body > div'],
								t: 5,
							},
							'85': {
								e: ['body > div'],
								t: 5,
							},
							'90': {
								e: ['body > div'],
								t: 5,
							},
							'95': {
								e: ['body > div'],
								t: 5,
							},
							'98': {
								e: ['body > div'],
								t: 5,
							},
							'99': {
								e: ['body > div'],
								t: 5,
							},
						},
					},
				],
			});
		});

		test('reports progress properly in entries', async () => {
			vc.start({ startTime: 0 });
			callbacks.forEach((fn: Callback) => {
				fn(
					5,
					mockBox({
						top: 0,
						left: 0,
						width: VIEWPORT_WIDTH,
						height: VIEWPORT_HEIGHT,
					}),
					'div#a',
					document.createElement('div'),
					'html',
				);
				fn(
					10,
					mockBox({
						top: 0,
						left: 0,
						width: VIEWPORT_WIDTH,
						height: VIEWPORT_HEIGHT / 2,
					}),
					'div#b',
					document.createElement('div'),
					'html',
				);
				fn(
					15,
					mockBox({
						top: 0,
						left: 0,
						width: VIEWPORT_WIDTH / 2,
						height: VIEWPORT_HEIGHT / 2,
					}),
					'div#c',
					document.createElement('div'),
					'html',
				);
				fn(
					20,
					mockBox({
						top: 0,
						left: 0,
						width: VIEWPORT_WIDTH / 4,
						height: VIEWPORT_HEIGHT / 4,
					}),
					'div#d',
					document.createElement('div'),
					'html',
				);
			});
			const result = await vc.getVCResult({
				start: 0,
				stop: 100,
				tti: 3,
				prefix: '',
				isEventAborted: false,
				experienceKey: 'test',
				interactionType: 'page_load',
				isPageVisible: true,
			});
			expect(result).toEqual({
				'ufo:next:speedIndex': 9,
				'ufo:speedIndex': 9,
				'vc:ratios': {
					'div#a': 1,
					'div#b': 0.5,
					'div#c': 0.25,
					'div#d': 0.0625,
				},
				'vc:size': {
					w: VIEWPORT_WIDTH,
					h: VIEWPORT_HEIGHT,
				},
				'vc:ssrRatio': undefined,
				'vc:time': expect.any(Number),
				'vc:ignored': [],
				'vc:rev': [
					{
						clean: true,
						'metric:vc90': 15,
						ratios: {
							'div#a': 1,
							'div#b': 0.5,
							'div#c': 0.25,
							'div#d': 0.0625,
						},
						revision: 'fy25.02',
						vcDetails: {
							'25': {
								e: ['div#a'],
								t: 5,
							},
							'50': {
								e: ['div#a'],
								t: 5,
							},
							'75': {
								e: ['div#b'],
								t: 10,
							},
							'80': {
								e: ['div#c'],
								t: 15,
							},
							'85': {
								e: ['div#c'],
								t: 15,
							},
							'90': {
								e: ['div#c'],
								t: 15,
							},
							'95': {
								e: ['div#d'],
								t: 20,
							},
							'98': {
								e: ['div#d'],
								t: 20,
							},
							'99': {
								e: ['div#d'],
								t: 20,
							},
						},
					},
				],
			});
		});

		test('removes duplicate entries in VC result', async () => {
			vc.start({ startTime: 0 });
			callbacks.forEach((fn: Callback) => {
				// Single entries for div#a, div#b, div#c
				fn(
					5,
					mockBox({
						top: 0,
						left: 0,
						width: VIEWPORT_WIDTH,
						height: VIEWPORT_HEIGHT,
					}),
					'div#a',
					document.createElement('div'),
					'html',
				);
				fn(
					10,
					mockBox({
						top: 0,
						left: 0,
						width: VIEWPORT_WIDTH,
						height: VIEWPORT_HEIGHT / 2,
					}),
					'div#b',
					document.createElement('div'),
					'html',
				);
				fn(
					15,
					mockBox({
						top: 0,
						left: 0,
						width: VIEWPORT_WIDTH / 2,
						height: VIEWPORT_HEIGHT / 2,
					}),
					'div#c',
					document.createElement('div'),
					'html',
				);
				// Duplicate entries for div#d
				fn(
					20,
					mockBox({
						top: 0,
						left: 0,
						width: VIEWPORT_WIDTH / 4,
						height: VIEWPORT_HEIGHT / 4,
					}),
					'div#d',
					document.createElement('div'),
					'html',
				);
				fn(
					20,
					mockBox({
						top: 0,
						left: 0,
						width: VIEWPORT_WIDTH / 4,
						height: VIEWPORT_HEIGHT / 4,
					}),
					'div#d',
					document.createElement('div'),
					'html',
				);
				fn(
					20,
					mockBox({
						top: 0,
						left: 0,
						width: VIEWPORT_WIDTH / 4,
						height: VIEWPORT_HEIGHT / 4,
					}),
					'div#d',
					document.createElement('div'),
					'html',
				);
				fn(
					20,
					mockBox({
						top: 0,
						left: 0,
						width: VIEWPORT_WIDTH / 4,
						height: VIEWPORT_HEIGHT / 4,
					}),
					'div#d',
					document.createElement('div'),
					'html',
				);
			});
			const result = await vc.getVCResult({
				start: 0,
				stop: 100,
				tti: 3,
				prefix: '',
				isEventAborted: false,
				experienceKey: 'test',
				interactionType: 'page_load',
				isPageVisible: true,
			});
			expect(result).toEqual({
				'ufo:next:speedIndex': 9,
				'ufo:speedIndex': 9,
				'vc:ratios': {
					'div#a': 1,
					'div#b': 0.5,
					'div#c': 0.25,
					'div#d': 0.0625,
				},
				'vc:size': {
					w: VIEWPORT_WIDTH,
					h: VIEWPORT_HEIGHT,
				},
				'vc:ssrRatio': undefined,
				'vc:time': expect.any(Number),
				'vc:ignored': [],
				'vc:rev': [
					{
						clean: true,
						'metric:vc90': 15,
						ratios: {
							'div#a': 1,
							'div#b': 0.5,
							'div#c': 0.25,
							'div#d': 0.0625,
						},
						revision: 'fy25.02',
						vcDetails: {
							'25': {
								e: ['div#a'],
								t: 5,
							},
							'50': {
								e: ['div#a'],
								t: 5,
							},
							'75': {
								e: ['div#b'],
								t: 10,
							},
							'80': {
								e: ['div#c'],
								t: 15,
							},
							'85': {
								e: ['div#c'],
								t: 15,
							},
							'90': {
								e: ['div#c'],
								t: 15,
							},
							'95': {
								e: ['div#d'],
								t: 20,
							},
							'98': {
								e: ['div#d'],
								t: 20,
							},
							'99': {
								e: ['div#d'],
								t: 20,
							},
						},
					},
				],
			});
		});

		test('ignores ignored fields properly', async () => {
			vc.start({ startTime: 0 });
			callbacks.forEach((fn: Callback) => {
				fn(
					5,
					mockBox({
						top: 0,
						left: 0,
						width: VIEWPORT_WIDTH,
						height: VIEWPORT_HEIGHT,
					}),
					'div#a',
					document.createElement('div'),
					'html',
				);
				fn(
					10,
					mockBox({
						top: 0,
						left: 0,
						width: VIEWPORT_WIDTH,
						height: VIEWPORT_HEIGHT / 2,
					}),
					'div#b',
					document.createElement('div'),
					'html',
					'image',
				);
				fn(
					15,
					mockBox({
						top: 0,
						left: 0,
						width: VIEWPORT_WIDTH / 2,
						height: VIEWPORT_HEIGHT / 2,
					}),
					'div#c',
					document.createElement('div'),
					'html',
				);
				fn(
					20,
					mockBox({
						top: 0,
						left: 0,
						width: VIEWPORT_WIDTH / 4,
						height: VIEWPORT_HEIGHT / 4,
					}),
					'div#d',
					document.createElement('div'),
					'html',
				);
			});
			const result = await vc.getVCResult({
				start: 0,
				stop: 100,
				tti: 3,
				prefix: '',
				isEventAborted: false,
				experienceKey: 'test',
				interactionType: 'page_load',
				isPageVisible: true,
			});
			expect(result).toEqual({
				'ufo:next:speedIndex': 8,
				'ufo:speedIndex': 8,
				'vc:ratios': {
					'div#a': 1,
					'div#b': 0.5,
					'div#c': 0.25,
					'div#d': 0.0625,
				},
				'vc:size': {
					w: VIEWPORT_WIDTH,
					h: VIEWPORT_HEIGHT,
				},
				'vc:ssrRatio': undefined,
				'vc:time': expect.any(Number),
				'vc:ignored': [
					{
						targetName: 'div#b',
						ignoreReason: 'image',
					},
				],
				'vc:rev': [
					{
						clean: true,
						'metric:vc90': 15,
						ratios: {
							'div#a': 1,
							'div#b': 0.5,
							'div#c': 0.25,
							'div#d': 0.0625,
						},
						revision: 'fy25.02',
						vcDetails: {
							'25': {
								e: ['div#a'],
								t: 5,
							},
							'50': {
								e: ['div#a'],
								t: 5,
							},
							'75': {
								e: ['div#a'],
								t: 5,
							},
							'80': {
								e: ['div#c'],
								t: 15,
							},
							'85': {
								e: ['div#c'],
								t: 15,
							},
							'90': {
								e: ['div#c'],
								t: 15,
							},
							'95': {
								e: ['div#d'],
								t: 20,
							},
							'98': {
								e: ['div#d'],
								t: 20,
							},
							'99': {
								e: ['div#d'],
								t: 20,
							},
						},
					},
				],
			});
		});

		test('updates attributes only in the new field', async () => {
			vc.start({ startTime: 0 });
			callbacks.forEach((fn: Callback) => {
				fn(
					5,
					mockBox({
						top: 0,
						left: 0,
						width: VIEWPORT_WIDTH,
						height: VIEWPORT_HEIGHT,
					}),
					'div#a',
					document.createElement('div'),
					'html',
				);
				fn(
					10,
					mockBox({
						top: 0,
						left: 0,
						width: VIEWPORT_WIDTH,
						height: VIEWPORT_HEIGHT / 2,
					}),
					'div#b',
					document.createElement('div'),
					'attr',
				);
				fn(
					15,
					mockBox({
						top: 0,
						left: 0,
						width: VIEWPORT_WIDTH / 2,
						height: VIEWPORT_HEIGHT / 2,
					}),
					'div#c',
					document.createElement('div'),
					'html',
				);
				fn(
					20,
					mockBox({
						top: 0,
						left: 0,
						width: VIEWPORT_WIDTH / 4,
						height: VIEWPORT_HEIGHT / 4,
					}),
					'div#d',
					document.createElement('div'),
					'html',
				);
			});
			const result = await vc.getVCResult({
				start: 0,
				stop: 100,
				tti: 3,
				prefix: '',
				isEventAborted: false,
				experienceKey: 'test',
				interactionType: 'page_load',
				isPageVisible: true,
			});
			expect(result).toEqual({
				'ufo:next:speedIndex': 9,
				'ufo:speedIndex': 9,
				'vc:ratios': {
					'div#a': 1,
					'div#b': 0.5,
					'div#c': 0.25,
					'div#d': 0.0625,
				},
				'vc:size': {
					w: VIEWPORT_WIDTH,
					h: VIEWPORT_HEIGHT,
				},
				'vc:time': expect.any(Number),
				'vc:ignored': [],
				'vc:rev': [
					{
						clean: true,
						'metric:vc90': 15,
						ratios: {
							'div#a': 1,
							'div#b': 0.5,
							'div#c': 0.25,
							'div#d': 0.0625,
						},
						revision: 'fy25.02',
						vcDetails: {
							'25': {
								e: ['div#a'],
								t: 5,
							},
							'50': {
								e: ['div#a'],
								t: 5,
							},
							'75': {
								e: ['div#b'],
								t: 10,
							},
							'80': {
								e: ['div#c'],
								t: 15,
							},
							'85': {
								e: ['div#c'],
								t: 15,
							},
							'90': {
								e: ['div#c'],
								t: 15,
							},
							'95': {
								e: ['div#d'],
								t: 20,
							},
							'98': {
								e: ['div#d'],
								t: 20,
							},
							'99': {
								e: ['div#d'],
								t: 20,
							},
						},
					},
				],
			});
		});

		test('supports multiple starts properly', async () => {
			vc.start({ startTime: 0 });
			callbacks.forEach((fn: Callback) => {
				fn(
					5,
					mockBox({
						top: 0,
						left: 0,
						width: VIEWPORT_WIDTH,
						height: VIEWPORT_HEIGHT,
					}),
					'div#a',
					document.createElement('div'),
					'html',
				);
			});
			const result = await vc.getVCResult({
				start: 0,
				stop: 100,
				tti: 3,
				prefix: '',
				isEventAborted: false,
				experienceKey: 'test',
				interactionType: 'page_load',
				isPageVisible: true,
			});
			expect(result).toEqual({
				'ufo:next:speedIndex': 5,
				'ufo:speedIndex': 5,
				'vc:ratios': {
					'div#a': 1,
				},
				'vc:size': {
					w: VIEWPORT_WIDTH,
					h: VIEWPORT_HEIGHT,
				},
				'vc:time': expect.any(Number),
				'vc:ignored': [],
				'vc:rev': [
					{
						clean: true,
						'metric:vc90': 5,
						ratios: {
							'div#a': 1,
						},
						revision: 'fy25.02',
						vcDetails: {
							'25': {
								e: ['div#a'],
								t: 5,
							},
							'50': {
								e: ['div#a'],
								t: 5,
							},
							'75': {
								e: ['div#a'],
								t: 5,
							},
							'80': {
								e: ['div#a'],
								t: 5,
							},
							'85': {
								e: ['div#a'],
								t: 5,
							},
							'90': {
								e: ['div#a'],
								t: 5,
							},
							'95': {
								e: ['div#a'],
								t: 5,
							},
							'98': {
								e: ['div#a'],
								t: 5,
							},
							'99': {
								e: ['div#a'],
								t: 5,
							},
						},
					},
				],
			});

			vc.start({ startTime: 100 });
			callbacks.forEach((fn: Callback) => {
				fn(
					110,
					mockBox({
						top: 0,
						left: 0,
						width: VIEWPORT_WIDTH / 2,
						height: VIEWPORT_HEIGHT / 2,
					}),
					'div#b',
					document.createElement('div'),
					'html',
				);
			});
			const resultTransition = await vc.getVCResult({
				start: 100,
				stop: 200,
				tti: 3,
				prefix: '',
				isEventAborted: false,
				experienceKey: 'test',
				interactionType: 'page_load',
				isPageVisible: true,
			});
			expect(resultTransition).toEqual({
				'ufo:next:speedIndex': 10,
				'ufo:speedIndex': 10,
				'vc:ratios': {
					'div#b': 0.25,
				},
				'vc:size': {
					w: VIEWPORT_WIDTH,
					h: VIEWPORT_HEIGHT,
				},
				'vc:time': expect.any(Number),
				'vc:ignored': [],
				'vc:rev': [
					{
						clean: true,
						'metric:vc90': 10,
						ratios: {
							'div#b': 0.25,
						},
						revision: 'fy25.02',
						vcDetails: {
							'25': {
								e: ['div#b'],
								t: 10,
							},
							'50': {
								e: ['div#b'],
								t: 10,
							},
							'75': {
								e: ['div#b'],
								t: 10,
							},
							'80': {
								e: ['div#b'],
								t: 10,
							},
							'85': {
								e: ['div#b'],
								t: 10,
							},
							'90': {
								e: ['div#b'],
								t: 10,
							},
							'95': {
								e: ['div#b'],
								t: 10,
							},
							'98': {
								e: ['div#b'],
								t: 10,
							},
							'99': {
								e: ['div#b'],
								t: 10,
							},
						},
					},
				],
			});
		});

		test('applies SSR timings properly', async () => {
			vc.start({ startTime: 0 });
			callbacks.forEach((fn: Callback) => {
				fn(
					10,
					mockBox({
						top: 0,
						left: 0,
						width: VIEWPORT_WIDTH,
						height: VIEWPORT_HEIGHT / 2,
					}),
					'div#b',
					document.createElement('div'),
					'html',
				);
			});
			const result = await vc.getVCResult({
				start: 0,
				stop: 100,
				tti: 3,
				prefix: '',
				ssr: 3,
				isEventAborted: false,
				experienceKey: 'test',
				interactionType: 'page_load',
				isPageVisible: true,
			});
			expect(result).toEqual({
				'ufo:next:speedIndex': 7,
				'ufo:speedIndex': 7,
				'vc:ratios': {
					'div#b': 0.5,
				},
				'vc:size': {
					w: VIEWPORT_WIDTH,
					h: VIEWPORT_HEIGHT,
				},
				'vc:time': expect.any(Number),
				'vc:ignored': [],
				'vc:rev': [
					{
						clean: true,
						'metric:vc90': 10,
						ratios: {
							'div#b': 0.5,
						},
						revision: 'fy25.02',
						vcDetails: {
							'25': {
								e: ['SSR'],
								t: 3,
							},
							'50': {
								e: ['SSR'],
								t: 3,
							},
							'75': {
								e: ['div#b'],
								t: 10,
							},
							'80': {
								e: ['div#b'],
								t: 10,
							},
							'85': {
								e: ['div#b'],
								t: 10,
							},
							'90': {
								e: ['div#b'],
								t: 10,
							},
							'95': {
								e: ['div#b'],
								t: 10,
							},
							'98': {
								e: ['div#b'],
								t: 10,
							},
							'99': {
								e: ['div#b'],
								t: 10,
							},
						},
					},
				],
				'vc:ssrRatio': 50,
			});
		});

		test('applies SSR (small number) timings properly', async () => {
			vc.start({ startTime: 0 });
			callbacks.forEach((fn: Callback) => {
				fn(
					10,
					mockBox({
						top: 0,
						left: 0,
						width: VIEWPORT_WIDTH,
						height: (VIEWPORT_HEIGHT / 100) * 95,
					}),
					'div#b',
					document.createElement('div'),
					'html',
				);
			});
			const result = await vc.getVCResult({
				start: 0,
				stop: 100,
				tti: 3,
				prefix: '',
				ssr: 3,
				isEventAborted: false,
				experienceKey: 'test',
				interactionType: 'page_load',
				isPageVisible: true,
			});
			expect(result).toEqual({
				'ufo:next:speedIndex': 10,
				'ufo:speedIndex': 10,
				'vc:ratios': {
					'div#b': 0.95,
				},
				'vc:size': {
					w: VIEWPORT_WIDTH,
					h: VIEWPORT_HEIGHT,
				},
				'vc:time': expect.any(Number),
				'vc:ignored': [],
				'vc:rev': [
					{
						clean: true,
						'metric:vc90': 10,
						ratios: {
							'div#b': 0.95,
						},
						revision: 'fy25.02',
						vcDetails: {
							'25': {
								e: ['div#b'],
								t: 10,
							},
							'50': {
								e: ['div#b'],
								t: 10,
							},
							'75': {
								e: ['div#b'],
								t: 10,
							},
							'80': {
								e: ['div#b'],
								t: 10,
							},
							'85': {
								e: ['div#b'],
								t: 10,
							},
							'90': {
								e: ['div#b'],
								t: 10,
							},
							'95': {
								e: ['div#b'],
								t: 10,
							},
							'98': {
								e: ['div#b'],
								t: 10,
							},
							'99': {
								e: ['div#b'],
								t: 10,
							},
						},
					},
				],
				'vc:ssrRatio': 5,
			});
		});
	});

	describe('VC dirty (aborted) scenarios', () => {
		test('abort scenario - resize', async () => {
			const mockUnbindFn = jest.fn();
			const abortReasonCallback = jest.fn();
			mockAttachAbortListeners.mockImplementation((_, __, callback) => {
				abortReasonCallback.mockImplementation(callback);
				return [mockUnbindFn];
			});
			vc.start({ startTime: 0 });

			abortReasonCallback('resize', 0);

			const result = await vc.getVCResult({
				start: 0,
				stop: 100,
				tti: 3,
				prefix: '',
				isEventAborted: false,
				experienceKey: 'test',
				interactionType: 'page_load',
				isPageVisible: true,
			});

			expect(result).toEqual({
				'vc:rev': [
					{
						abortReason: 'resize',
						abortTimestamp: 0,
						clean: false,
						'metric:vc90': null,
						revision: 'fy25.02',
					},
				],
			});

			expect(mockUnbindFn).toHaveBeenCalled();
		});

		test('abort scenario - keypress', async () => {
			const mockUnbindFn = jest.fn();
			const abortReasonCallback = jest.fn();
			mockAttachAbortListeners.mockImplementation((_, __, callback) => {
				abortReasonCallback.mockImplementation(callback);
				return [mockUnbindFn];
			});
			vc.start({ startTime: 0 });

			abortReasonCallback('keydown', 0);

			const result = await vc.getVCResult({
				start: 0,
				stop: 100,
				tti: 3,
				prefix: '',
				isEventAborted: false,
				experienceKey: 'test',
				interactionType: 'page_load',
				isPageVisible: true,
			});

			expect(result).toEqual({
				'vc:rev': [
					{
						abortReason: 'keypress',
						abortTimestamp: 0,
						clean: false,
						'metric:vc90': null,
						revision: 'fy25.02',
					},
				],
			});

			expect(mockUnbindFn).toHaveBeenCalled();
		});

		describe('platform_ufo_keypress_interaction_abort feature flag', () => {
			test('should not abort press interactions on keydown when flag is enabled', async () => {
				mockFg.mockImplementation((flag: string) => {
					return flag === 'platform_ufo_keypress_interaction_abort';
				});
				mockGetActiveInteraction.mockReturnValue({
					type: 'press',
					ufoName: 'test-press-interaction',
				} as any);

				const mockUnbindFn = jest.fn();
				const abortReasonCallback = jest.fn();
				mockAttachAbortListeners.mockImplementation((_, __, callback) => {
					abortReasonCallback.mockImplementation(callback);
					return [mockUnbindFn];
				});
				vc.start({ startTime: 0 });

				abortReasonCallback('keydown', 0);

				const result = await vc.getVCResult({
					start: 0,
					stop: 100,
					tti: 3,
					prefix: '',
					isEventAborted: false,
					experienceKey: 'test',
					interactionType: 'press',
					isPageVisible: true,
				});

				// When flag is enabled and interaction is press, abort should not occur
				// Verify that the result does not have the abort-only structure
				// (aborted results only contain vc:rev with abortReason, clean results have full VC structure)
				expect(result).not.toEqual(
					expect.objectContaining({
						'vc:rev': expect.arrayContaining([
							expect.objectContaining({
								abortReason: expect.anything(),
							}),
						]),
					}),
				);
				// Additionally verify that if vc:rev exists, none of its entries have abortReason
				if (result['vc:rev'] && Array.isArray(result['vc:rev'])) {
					result['vc:rev'].forEach((entry: any) => {
						expect(entry).not.toHaveProperty('abortReason');
					});
				}
			});

			test('should abort non-press interactions on keydown when flag is enabled', async () => {
				mockFg.mockImplementation((flag: string) => {
					return flag === 'platform_ufo_keypress_interaction_abort';
				});
				mockGetActiveInteraction.mockReturnValue({
					type: 'page_load',
					ufoName: 'test-page-load',
				} as any);

				const mockUnbindFn = jest.fn();
				const abortReasonCallback = jest.fn();
				mockAttachAbortListeners.mockImplementation((_, __, callback) => {
					abortReasonCallback.mockImplementation(callback);
					return [mockUnbindFn];
				});
				vc.start({ startTime: 0 });

				abortReasonCallback('keydown', 0);

				const result = await vc.getVCResult({
					start: 0,
					stop: 100,
					tti: 3,
					prefix: '',
					isEventAborted: false,
					experienceKey: 'test',
					interactionType: 'page_load',
					isPageVisible: true,
				});

				expect(result).toEqual({
					'vc:rev': [
						{
							abortReason: 'keypress',
							abortTimestamp: 0,
							clean: false,
							'metric:vc90': null,
							revision: 'fy25.02',
						},
					],
				});

				expect(mockUnbindFn).toHaveBeenCalled();
			});

			test('should abort on keydown when flag is disabled', async () => {
				mockFg.mockReturnValue(false);
				mockGetActiveInteraction.mockReturnValue({
					type: 'press',
					ufoName: 'test-press-interaction',
				} as any);

				const mockUnbindFn = jest.fn();
				const abortReasonCallback = jest.fn();
				mockAttachAbortListeners.mockImplementation((_, __, callback) => {
					abortReasonCallback.mockImplementation(callback);
					return [mockUnbindFn];
				});
				vc.start({ startTime: 0 });

				abortReasonCallback('keydown', 0);

				const result = await vc.getVCResult({
					start: 0,
					stop: 100,
					tti: 3,
					prefix: '',
					isEventAborted: false,
					experienceKey: 'test',
					interactionType: 'press',
					isPageVisible: true,
				});

				// Should abort even for press interactions when flag is disabled
				expect(result).toEqual({
					'vc:rev': [
						{
							abortReason: 'keypress',
							abortTimestamp: 0,
							clean: false,
							'metric:vc90': null,
							revision: 'fy25.02',
						},
					],
				});

				expect(mockUnbindFn).toHaveBeenCalled();
			});

			test('should abort on keydown when no active interaction exists and flag is enabled', async () => {
				mockFg.mockImplementation((flag: string) => {
					return flag === 'platform_ufo_keypress_interaction_abort';
				});
				mockGetActiveInteraction.mockReturnValue(undefined);

				const mockUnbindFn = jest.fn();
				const abortReasonCallback = jest.fn();
				mockAttachAbortListeners.mockImplementation((_, __, callback) => {
					abortReasonCallback.mockImplementation(callback);
					return [mockUnbindFn];
				});
				vc.start({ startTime: 0 });

				abortReasonCallback('keydown', 0);

				const result = await vc.getVCResult({
					start: 0,
					stop: 100,
					tti: 3,
					prefix: '',
					isEventAborted: false,
					experienceKey: 'test',
					interactionType: 'page_load',
					isPageVisible: true,
				});

				expect(result).toEqual({
					'vc:rev': [
						{
							abortReason: 'keypress',
							abortTimestamp: 0,
							clean: false,
							'metric:vc90': null,
							revision: 'fy25.02',
						},
					],
				});

				expect(mockUnbindFn).toHaveBeenCalled();
			});
		});

		test('abort scenario - wheel', async () => {
			const mockUnbindFn = jest.fn();
			const abortReasonCallback = jest.fn();
			mockAttachAbortListeners.mockImplementation((_, __, callback) => {
				abortReasonCallback.mockImplementation(callback);
				return [mockUnbindFn];
			});
			vc.start({ startTime: 0 });

			abortReasonCallback('wheel', 0);

			const result = await vc.getVCResult({
				start: 0,
				stop: 100,
				tti: 3,
				prefix: '',
				isEventAborted: false,
				experienceKey: 'test',
				interactionType: 'page_load',
				isPageVisible: true,
			});

			expect(result).toEqual({
				'vc:rev': [
					{
						abortReason: 'scroll',
						abortTimestamp: 0,
						clean: false,
						'metric:vc90': null,
						revision: 'fy25.02',
					},
				],
			});

			expect(mockUnbindFn).toHaveBeenCalled();
		});
	});

	test('handles cases where IntersectionObserver or MutationObserver is not browser supported', async () => {
		(Observers as unknown as jest.MockedClass<any>).mockImplementation(() => ({
			...VCObserverMockImplementation,
			isBrowserSupported() {
				return false;
			},
		}));

		const vc = new VCObserver({
			heatmapSize: 100,
			oldDomUpdates: true,
		});

		vc.start({ startTime: 0 });

		expect(
			await vc.getVCResult({
				start: 0,
				stop: 100,
				tti: 3,
				prefix: '',
				isEventAborted: false,
				experienceKey: 'test',
				interactionType: 'page_load',
				isPageVisible: true,
			}),
		).toEqual({
			'vc:rev': [
				{
					abortReason: 'not-supported',
					abortTimestamp: 0,
					clean: false,
					'metric:vc90': null,
					revision: 'fy25.02',
				},
			],
		});
	});
	describe('speed index', () => {
		test('it calculate speed index correctly', async () => {
			vc.start({ startTime: 0 });
			const elementWidth = VIEWPORT_WIDTH / 4;
			callbacks.forEach((fn: Callback) => {
				fn(
					5,
					mockBox({
						top: 0,
						left: 0,
						width: elementWidth,
						height: VIEWPORT_HEIGHT,
					}),
					'div#a',
					document.createElement('div'),
					'html',
				);
				fn(
					10,
					mockBox({
						top: 0,
						left: elementWidth + 1,
						width: elementWidth,
						height: VIEWPORT_HEIGHT,
					}),
					'div#b',
					document.createElement('div'),
					'html',
					'image',
				);
				fn(
					15,
					mockBox({
						top: 0,
						left: 2 * elementWidth + 1,
						width: elementWidth,
						height: VIEWPORT_HEIGHT,
					}),
					'div#c',
					document.createElement('div'),
					'html',
				);
				fn(
					20,
					mockBox({
						top: 0,
						left: 3 * elementWidth + 1,
						width: elementWidth,
						height: VIEWPORT_HEIGHT,
					}),
					'div#d',
					document.createElement('div'),
					'html',
				);
			});
			const result = await vc.getVCResult({
				start: 0,
				stop: 100,
				tti: 3,
				prefix: '',
				isEventAborted: false,
				experienceKey: 'test',
				interactionType: 'page_load',
				isPageVisible: true,
			});
			const speedIndex = result['ufo:speedIndex'];

			expect(speedIndex).toEqual(Math.round(5 * 0.25 + 10 * 0.25 + 15 * 0.25 + 20 * 0.25));

			expect(result['ufo:next:speedIndex']).toEqual(speedIndex);
		});
	});

	describe('VC revision debug data', () => {
		const enabledVCRevisions = ['fy25.01', 'fy25.02'];

		let onVCRevisionReady: jest.Mock;
		let onUfoVcDebugDataReady: jest.Mock;

		beforeEach(() => {
			onVCRevisionReady = jest.fn();
			onUfoVcDebugDataReady = jest.fn();

			// @ts-ignore
			window.__ufo_devtool_onVCRevisionReady__ = onVCRevisionReady;
			// @ts-ignore
			window.__on_ufo_vc_debug_data_ready = onUfoVcDebugDataReady;

			mockIsVCRevisionEnabled.mockImplementation((revision) =>
				enabledVCRevisions.includes(revision),
			);
			mockFg.mockReturnValue(false);
		});

		afterEach(() => {
			mockIsVCRevisionEnabled.mockClear();
			mockFg.mockClear();
			// @ts-ignore
			delete window.__ufo_devtool_onVCRevisionReady__;
			// @ts-ignore
			delete window.__on_ufo_vc_debug_data_ready;
		});

		describe('__ufo_devtool_onVCRevisionReady__', () => {
			test('should be called with v1 and v2 data when TTVC v1 is enabled', async () => {
				vc.start({ startTime: 0 });
				await vc.getVCResult({
					start: 0,
					stop: 100,
					tti: 3,
					prefix: '',
					isEventAborted: false,
					experienceKey: 'test',
					interactionType: 'page_load',
					isPageVisible: true,
				});

				expect(onVCRevisionReady).toHaveBeenCalledTimes(2);
				expect(onVCRevisionReady).toHaveBeenCalledWith(
					expect.objectContaining({
						revision: 'fy25.01',
					}),
				);
				expect(onVCRevisionReady).toHaveBeenCalledWith(
					expect.objectContaining({
						revision: 'fy25.02',
					}),
				);
			});

			test('should be called with only v2 data when TTVC v1 is disabled', async () => {
				mockIsVCRevisionEnabled.mockImplementation((revision) => revision === 'fy25.02');
				vc.start({ startTime: 0 });
				await vc.getVCResult({
					start: 0,
					stop: 100,
					tti: 3,
					prefix: '',
					isEventAborted: false,
					experienceKey: 'test',
					interactionType: 'page_load',
					isPageVisible: true,
				});

				expect(onVCRevisionReady).toHaveBeenCalledTimes(1);
				expect(onVCRevisionReady).toHaveBeenCalledWith(
					expect.objectContaining({
						revision: 'fy25.02',
					}),
				);
			});
		});

		describe('__on_ufo_vc_debug_data_ready', () => {
			test('should be called with v1 and v2 data when TTVC v1 is enabled', async () => {
				vc.start({ startTime: 0 });
				await vc.getVCResult({
					start: 0,
					stop: 100,
					tti: 3,
					prefix: '',
					isEventAborted: false,
					experienceKey: 'test',
					interactionType: 'page_load',
					isPageVisible: true,
				});

				expect(onUfoVcDebugDataReady).toHaveBeenCalledTimes(2);
				expect(onUfoVcDebugDataReady).toHaveBeenCalledWith(
					expect.objectContaining({
						revision: 'fy25.01',
					}),
				);
				expect(onUfoVcDebugDataReady).toHaveBeenCalledWith(
					expect.objectContaining({
						revision: 'fy25.02',
					}),
				);
			});

			test('should be called with only v2 data when TTVC v1 is disabled', async () => {
				mockIsVCRevisionEnabled.mockImplementation((revision) => revision === 'fy25.02');

				vc.start({ startTime: 0 });
				await vc.getVCResult({
					start: 0,
					stop: 100,
					tti: 3,
					prefix: '',
					isEventAborted: false,
					experienceKey: 'test',
					interactionType: 'page_load',
					isPageVisible: true,
				});

				expect(onUfoVcDebugDataReady).toHaveBeenCalledTimes(1);
				expect(onUfoVcDebugDataReady).toHaveBeenCalledWith(
					expect.objectContaining({
						revision: 'fy25.02',
					}),
				);
			});
		});

		test('should not call any debug callbacks when isPostInteraction is true', async () => {
			vc = new VCObserver({
				heatmapSize: 100,
				oldDomUpdates: true,
				isPostInteraction: true,
			});

			vc.start({ startTime: 0 });
			await vc.getVCResult({
				start: 0,
				stop: 100,
				tti: 3,
				prefix: '',
				isEventAborted: false,
				experienceKey: 'test',
				interactionType: 'page_load',
				isPageVisible: true,
			});

			expect(onVCRevisionReady).not.toHaveBeenCalled();
			expect(onUfoVcDebugDataReady).not.toHaveBeenCalled();
		});

		test('should not call any debug callbacks if the functions are not defined on window', async () => {
			// @ts-ignore
			delete window.__ufo_devtool_onVCRevisionReady__;
			// @ts-ignore
			delete window.__on_ufo_vc_debug_data_ready;

			vc.start({ startTime: 0 });
			await vc.getVCResult({
				start: 0,
				stop: 100,
				tti: 3,
				prefix: '',
				isEventAborted: false,
				experienceKey: 'test',
				interactionType: 'page_load',
				isPageVisible: true,
			});

			expect(onVCRevisionReady).not.toHaveBeenCalled();
			expect(onUfoVcDebugDataReady).not.toHaveBeenCalled();
		});
	});
});
