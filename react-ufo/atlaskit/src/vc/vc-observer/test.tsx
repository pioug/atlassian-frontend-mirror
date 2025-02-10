import { fg } from '@atlaskit/platform-feature-flags';

import { Observers } from './observers';
import type { Callback } from './observers/types';

import { VCObserver } from './index';

jest.mock('@atlaskit/platform-feature-flags');
jest.mock('./observers');

const mockFg = fg as jest.Mock;

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

	function enableFeatureGate(fgName: string) {
		enabledFeatureGateStore.push(fgName);
	}
	function disableFeatureGate(fgName: string) {
		const index = enabledFeatureGateStore.indexOf(fgName);
		if (index !== -1) {
			enabledFeatureGateStore.splice(index, 1);
		}
	}

	mockFg.mockImplementation((fgName: string) => {
		return enabledFeatureGateStore.includes(fgName);
	});

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

	test('is aborted when abortCalculation is called', () => {
		vc.start({ startTime: 0 });
		vc.abortObservation();
		const result = vc.getVCResult({ start: 0, stop: 1000, tti: 3, prefix: '' });
		expect(result).toHaveProperty('vc:state', false);
		expect(result).toHaveProperty('vc:abort:reason', 'custom');
		expect(result).not.toHaveProperty('metrics:vc');
	});

	test('handles full screen updates', () => {
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
		const result = vc.getVCResult({ start: 0, stop: 100, tti: 3, prefix: '' });
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
		});
	});

	test('reports progress properly in entries', () => {
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
		const result = vc.getVCResult({ start: 0, stop: 100, tti: 3, prefix: '' });
		expect(result).toEqual({
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
		});
	});

	test('ignores ignored fields properly', () => {
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
		const result = vc.getVCResult({ start: 0, stop: 100, tti: 3, prefix: '' });
		expect(result).toEqual({
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
		});
	});

	test('updates attributes only in the new field', () => {
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
		const result = vc.getVCResult({ start: 0, stop: 100, tti: 3, prefix: '' });
		expect(result).toEqual({
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
		});
	});

	test('supports multiple starts properly', () => {
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
		const result = vc.getVCResult({ start: 0, stop: 100, tti: 3, prefix: '' });
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
		const resultTransition = vc.getVCResult({ start: 100, stop: 200, tti: 3, prefix: '' });
		expect(resultTransition).toEqual({
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
		});
	});

	test('applies SSR timings properly', () => {
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
		const result = vc.getVCResult({ start: 0, stop: 100, tti: 3, prefix: '', ssr: 3 });
		expect(result).toEqual({
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
		});
	});

	test('handles cases where IntersectionObserver or MutationObserver is not browser supported', () => {
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

		expect(vc.getVCResult({ start: 0, stop: 100, tti: 3, prefix: '' })).toEqual({
			'vc:state': false,
			'vc:abort:reason': 'not-supported',
			'vc:abort:timestamp': 0,
		});
	});
	describe('speed index', () => {
		describe('ff-enabled', () => {
			beforeEach(() => {
				enableFeatureGate('ufo-calc-speed-index');
			});
			test('it calculate speed index correctly', () => {
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
				const result = vc.getVCResult({ start: 0, stop: 100, tti: 3, prefix: '' });
				const speedIndex = result['ufo:speedIndex'];

				expect(speedIndex).toEqual(Math.round(5 * 0.25 + 10 * 0.25 + 15 * 0.25 + 20 * 0.25));

				expect(result['ufo:next:speedIndex']).toEqual(speedIndex);
			});
		});
		describe('ff-disabeld', () => {
			beforeEach(() => {
				disableFeatureGate('ufo-calc-speed-index');
			});
			test('it does not output speed index', () => {
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
				const result = vc.getVCResult({ start: 0, stop: 100, tti: 3, prefix: '' });

				expect(result['ufo:speedIndex']).toBeUndefined();
				expect(result['ufo:next:speedIndex']).toBeUndefined();
			});
		});
	});
});
