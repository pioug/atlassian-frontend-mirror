import { Observers } from './observers';
import type { Callback } from './observers/types';

import { VCObserver } from './index';

jest.mock('./observers');

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
			'vc:old': {
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
			'vc:old:dom': {
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
			'vc:old': {
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
			'vc:old:dom': {
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
			'vc:old': {
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
			'vc:old:dom': {
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
			'vc:ignored': [
				{
					targetName: 'div#b',
					ignoreReason: 'image',
				},
			],
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
			'vc:old': {
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
			'vc:old:dom': {
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
			'vc:old': {
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
			'vc:old:dom': {
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
			'vc:old': {
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
			'vc:old:dom': {
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
});
