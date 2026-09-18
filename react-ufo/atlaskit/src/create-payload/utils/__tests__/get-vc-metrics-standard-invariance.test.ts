/**
 * Invariance guard for AFO-5545 (Forge background-script 3p exclusion).
 *
 * The whole point of the change is: excluding a background script from the
 * third-party bucket must NOT change any standard-bucket metric. The standard
 * VC90 is computed by `getVCResult` from entries sliced by `stop = interaction.end`,
 * whereas `rawDataStopTime = interaction.end3p` only feeds the raw-data payload.
 *
 * These tests prove that invariance at the production `getVCMetrics` seam:
 * feeding the exact same visual timeline through `getVCMetrics` with two very
 * different `end3p` values (a short one, as if the bg hold were excluded and the
 * snapshot happened early, versus a long ~60s one, as if the bg hold kept the
 * interaction open) yields a byte-identical standard `metric:vc90`, while only
 * the raw-data observation window differs.
 *
 * To keep the test fully deterministic and independent of jsdom limitations we:
 *  - force feature gates read via `fg()` to a fixed value, and
 *  - polyfill `OffscreenCanvas` with a faithful in-memory pixel buffer so the
 *    real canvas percentile maths runs (the VC90 is a genuinely computed number,
 *    not a stub). Both runs feed the calculator identical standard-window
 *    entries, so an identical computed VC90 is the invariance we assert.
 */

// Force all `fg(...)` reads in the VC calculators to a fixed, deterministic value
// (the feature-gate client is not initialised in unit tests).
jest.mock('@atlaskit/platform-feature-flags/fg', () => ({
	...jest.requireActual('@atlaskit/platform-feature-flags/fg'),
	fg: () => false,
}));

// Faithful in-memory canvas so the real percentile maths can run under jsdom.
class FakeCtx {
	private w: number;
	private h: number;
	private buf: Uint8ClampedArray;
	public fillStyle = 'rgb(0, 0, 0)';
	public globalCompositeOperation = 'source-over';
	public imageSmoothingEnabled = false;

	constructor(w: number, h: number) {
		this.w = w;
		this.h = h;
		this.buf = new Uint8ClampedArray(w * h * 4);
	}

	private parseColor(): [number, number, number] {
		const m = /rgb\((\d+),\s*(\d+),\s*(\d+)\)/.exec(this.fillStyle);
		return m ? [Number(m[1]), Number(m[2]), Number(m[3])] : [0, 0, 0];
	}

	clearRect(x: number, y: number, w: number, h: number) {
		this.fillRectRGB(x, y, w, h, [0, 0, 0]);
	}

	fillRect(x: number, y: number, w: number, h: number) {
		this.fillRectRGB(x, y, w, h, this.parseColor());
	}

	private fillRectRGB(
		x: number,
		y: number,
		w: number,
		h: number,
		[r, g, b]: [number, number, number],
	) {
		const x0 = Math.max(0, Math.floor(x));
		const y0 = Math.max(0, Math.floor(y));
		const x1 = Math.min(this.w, Math.floor(x + w));
		const y1 = Math.min(this.h, Math.floor(y + h));
		for (let yy = y0; yy < y1; yy++) {
			for (let xx = x0; xx < x1; xx++) {
				const i = (yy * this.w + xx) * 4;
				this.buf[i] = r;
				this.buf[i + 1] = g;
				this.buf[i + 2] = b;
				this.buf[i + 3] = 255;
			}
		}
	}

	scale() {}

	getImageData(_x: number, _y: number, w: number, h: number) {
		return { data: this.buf, width: w, height: h };
	}
}

class FakeOffscreenCanvas {
	width: number;
	height: number;
	private ctx: FakeCtx;
	constructor(width: number, height: number) {
		this.width = width;
		this.height = height;
		this.ctx = new FakeCtx(width, height);
	}
	getContext() {
		return this.ctx as unknown as OffscreenCanvasRenderingContext2D;
	}
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
(global as any).OffscreenCanvas = FakeOffscreenCanvas as any;

import type { InteractionMetrics } from '../../../common';
import { setUFOConfig } from '../../../config';
import VCObserverNew from '../../../vc/vc-observer-new';
import type { VCObserverEntry } from '../../../vc/vc-observer-new/types';
import getVCMetrics from '../get-vc-metrics';

const VIEWPORT_W = 1000;
const VIEWPORT_H = 800;

function rect(x: number, y: number, width: number, height: number): DOMRect {
	return {
		x,
		y,
		width,
		height,
		top: y,
		left: x,
		right: x + width,
		bottom: y + height,
		toJSON() {
			return { x, y, width, height, top: y, left: x, right: x + width, bottom: y + height };
		},
	} as DOMRect;
}

function paintEntry(time: number, elementName: string, r: DOMRect): VCObserverEntry {
	return {
		time,
		data: { type: 'mutation:element', elementName, rect: r, visible: true },
	} as VCObserverEntry;
}

function buildObserverWithTimeline(entries: VCObserverEntry[]): VCObserverNew {
	const observer = new VCObserverNew({});
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const timeline = (observer as any).entriesTimeline;
	entries.forEach((e) => timeline.push(e));
	return observer;
}

function buildInteraction(end3p: number, observer: VCObserverNew): InteractionMetrics {
	return {
		id: 'test-interaction',
		start: 0,
		end: 2000,
		end3p,
		ufoName: 'test-ufo-name',
		type: 'transition',
		vcObserver: observer,
		marks: [],
		customData: [],
		cohortingCustomData: new Map(),
		customTimings: [],
		spans: [],
		requestInfo: [],
		reactProfilerTimings: [],
		holdInfo: [],
		holdActive: new Map(),
		hold3pActive: new Map(),
		hold3pInfo: [],
		measureStart: 0,
		rate: 1,
		cancelCallbacks: [],
		metaData: {},
		errors: [],
		apdex: [{ startTime: 0, stopTime: 1500 }],
		labelStack: null,
		routeName: 'test-route',
		knownSegments: [],
		cleanupCallbacks: [],
		awaitReactProfilerCount: 0,
		redirects: [],
		timerID: undefined,
		changeTimeout: jest.fn(),
		trace: null,
		previousInteractionName: undefined,
		isPreviousInteractionAborted: false,
		abortReason: undefined,
		minorInteractions: [],
	} as unknown as InteractionMetrics;
}

// Meaningful paints inside the standard window (<= end=2000), plus later paints
// AFTER the standard end but before a long end3p. Only the standard-window
// entries must ever influence the standard VC90.
function makeTimeline(): VCObserverEntry[] {
	return [
		paintEntry(300, 'div-header', rect(0, 0, VIEWPORT_W, 100)),
		paintEntry(800, 'div-main', rect(0, 100, VIEWPORT_W, 500)),
		paintEntry(1500, 'div-footer', rect(0, 600, VIEWPORT_W, 200)),
		// "background-script era" observations a deferred snapshot would capture:
		paintEntry(4200, 'div-late-3p', rect(0, 300, VIEWPORT_W, 300)),
		paintEntry(30000, 'div-very-late-3p', rect(0, 0, VIEWPORT_W, 400)),
	];
}

// `getVCMetrics` returns the raw revision array (each entry has a `revision`
// field); the `{ 'ufo:vc:rev': [...] }` wrapper is applied later in
// `createPayloads`. So we read revisions directly off the array here.
function findRev(result: unknown, revision: string): Record<string, unknown> | undefined {
	const arr = result as unknown as Array<Record<string, unknown>>;
	return Array.isArray(arr) ? arr.find((r) => r.revision === revision) : undefined;
}
function revVC90(result: unknown, revision: string): number | null | undefined {
	return findRev(result, revision)?.['metric:vc90'] as number | null | undefined;
}

describe('getVCMetrics standard-bucket invariance to end3p (AFO-5545)', () => {
	const originalPerformance = global.performance;

	beforeEach(() => {
		Object.defineProperty(global, 'window', {
			value: {
				location: { hostname: 'test-host' },
				innerWidth: VIEWPORT_W,
				innerHeight: VIEWPORT_H,
				__UFO_COMPACT_PAYLOAD__: false,
			},
			writable: true,
			configurable: true,
		});

		global.performance = {
			...originalPerformance,
			now: jest.fn(() => 100000),
		} as unknown as Performance;

		setUFOConfig({
			enabled: true,
			product: 'test-product',
			region: 'test-region',
			vc: {
				enabled: true,
				enabledVCRevisions: { all: ['fy26.04'] },
			},
		} as Parameters<typeof setUFOConfig>[0]);
	});

	afterEach(() => {
		global.performance = originalPerformance;
		jest.clearAllMocks();
	});

	it('produces an identical standard metric:vc90 whether end3p is short or ~60s', async () => {
		const resultShort = await getVCMetrics(
			buildInteraction(2000, buildObserverWithTimeline(makeTimeline())),
			false,
		);
		const resultLong = await getVCMetrics(
			buildInteraction(60000, buildObserverWithTimeline(makeTimeline())),
			false,
		);

		const vc90Short = revVC90(resultShort, 'fy26.04');
		const vc90Long = revVC90(resultLong, 'fy26.04');
		expect(vc90Short).toBeDefined();
		expect(vc90Short).toEqual(vc90Long);
	});

	it('produces an identical fy26.04 revision VC90 (the computed standard bucket) across end3p values', async () => {
		const resultShort = await getVCMetrics(
			buildInteraction(2000, buildObserverWithTimeline(makeTimeline())),
			false,
		);
		const resultLong = await getVCMetrics(
			buildInteraction(60000, buildObserverWithTimeline(makeTimeline())),
			false,
		);

		const revShort = findRev(resultShort, 'fy26.04');
		const revLong = findRev(resultLong, 'fy26.04');

		expect(revShort).toBeDefined();
		expect(revLong).toBeDefined();
		expect(revShort?.['metric:vc90']).toEqual(revLong?.['metric:vc90']);
	});

	it('DOES extend the raw-data observation window when end3p is larger (sanity: the two runs really differ)', async () => {
		const resultShort = await getVCMetrics(
			buildInteraction(2000, buildObserverWithTimeline(makeTimeline())),
			false,
		);
		const resultLong = await getVCMetrics(
			buildInteraction(60000, buildObserverWithTimeline(makeTimeline())),
			false,
		);

		const rawShort = findRev(resultShort, 'raw-handler');
		const rawLong = findRev(resultLong, 'raw-handler');

		const obsCount = (rev?: Record<string, unknown>): number => {
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			const obs = (rev?.rawData as any)?.obs;
			return Array.isArray(obs) ? obs.length : 0;
		};

		expect(obsCount(rawLong)).toBeGreaterThan(obsCount(rawShort));
	});
});
