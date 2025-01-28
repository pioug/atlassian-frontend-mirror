import { type UnbindFn } from 'bind-event-listener';

import { fg } from '@atlaskit/platform-feature-flags';

import type {
	ComponentsLogType,
	VCAbortReason,
	VCAbortReasonType,
	VCEntryType,
	VCIgnoreReason,
	VCRatioType,
	VCRawDataType,
	VCResult,
} from '../../common/vc/types';

import { attachAbortListeners } from './attachAbortListeners';
import { getViewportHeight, getViewportWidth } from './getViewport';
import { type ObservedMutationType, Observers, type SelectorConfig } from './observers';

type PixelsToMap = { l: number; t: number; r: number; b: number };

type AbortReasonEnum = { [key: string]: VCAbortReason };

type GetVCResultType = {
	start: number;
	stop: number;
	tti: number;
	prefix?: string;
	ssr?: number;
	vc?: VCRawDataType | null;
};

export type VCObserverOptions = {
	heatmapSize?: number | undefined;
	oldDomUpdates?: boolean | undefined;
	devToolsEnabled?: boolean | undefined;
	selectorConfig?: SelectorConfig | undefined;
	isPostInteraction?: boolean;
};

const abortReason: AbortReasonEnum = {
	scroll: 'scroll',
	keypress: 'keypress',
	resize: 'resize',
	error: 'error',
};

const UNUSED_SECTOR = 0;

function filterComponentsLog(log: ComponentsLogType) {
	return Object.fromEntries(
		Object.entries(log).map(([timestamp, entries]) => [
			Number(timestamp),
			entries.map((entry) => {
				const { __debug__element, ...rest } = entry;
				return rest;
			}),
		]),
	);
}

export class VCObserver {
	/* abort logic */
	abortReason: VCAbortReasonType = {
		reason: null,
		info: '',
		timestamp: -1,
		blocking: false,
	};

	outOfBoundaryInfo = '';

	/** config * */
	static VCParts = ['25', '50', '75', '80', '85', '90', '95', '98', '99'];

	viewport = {
		w: 0,
		h: 0,
	};

	/* heatmap */
	arraySize = 0;

	heatmap: number[][];

	heatmapNext: number[][];

	componentsLog: ComponentsLogType = {};

	vcRatios: VCRatioType = {};

	active = false;

	totalTime = 0;

	startTime = 0;

	observers: Observers;

	private _startMeasureTimestamp = -1;

	ssr = {
		reactRendered: -1,
	};

	devToolsEnabled: boolean;

	oldDomUpdatesEnabled: boolean;

	unbind: UnbindFn[] = [];

	isPostInteraction?: boolean;

	constructor(options: VCObserverOptions) {
		this.arraySize = options.heatmapSize || 200;
		this.devToolsEnabled = options.devToolsEnabled || false;
		this.oldDomUpdatesEnabled = options.oldDomUpdates || false;
		this.observers = new Observers({
			selectorConfig: options.selectorConfig || {
				id: false,
				testId: false,
				role: false,
				className: true,
				dataVC: true,
			},
		});
		this.heatmap = this.getCleanHeatmap();
		this.heatmapNext = this.getCleanHeatmap();
		this.isPostInteraction = options.isPostInteraction || false;
	}

	start({ startTime }: { startTime: number }) {
		this.active = true;
		if (this.observers.isBrowserSupported()) {
			this.setViewportSize();
			this.resetState();
			this.startTime = startTime;
			this.attachAbortListeners();
			this.observers.subscribeResults(this.handleUpdate);
			this.observers.observe();
		} else {
			this.setAbortReason('not-supported', startTime);
		}
	}

	stop() {
		this.observers.disconnect();
		this.detachAbortListeners();
	}

	getAbortReasonInfo = () => {
		if (this.abortReason.reason === null) {
			return null;
		}

		const info = this.abortReason.info !== '' ? ` ${this.abortReason.info}` : '';
		return `${this.abortReason.reason}${info}`;
	};

	getVCRawData = (): VCRawDataType | null => {
		this.measureStart();

		if (!this.active) {
			this.measureStop();
			return null;
		}
		this.stop();

		const abortReasonInfo = this.getAbortReasonInfo();
		this.measureStop();

		return {
			abortReasonInfo,
			abortReason: { ...this.abortReason },
			heatmap: this.heatmap,
			heatmapNext: this.heatmapNext,
			outOfBoundaryInfo: this.outOfBoundaryInfo,
			totalTime: Math.round(this.totalTime + this.observers.getTotalTime()),
			componentsLog: { ...this.componentsLog },
			viewport: { ...this.viewport },
			oldDomUpdatesEnabled: this.oldDomUpdatesEnabled,
			devToolsEnabled: this.devToolsEnabled,
			ratios: this.vcRatios,
		};
	};

	getIgnoredElements(componentsLog: ComponentsLogType) {
		return Object.values(componentsLog)
			.flat()
			.filter(({ ignoreReason }) => Boolean(ignoreReason))
			.map(({ targetName, ignoreReason }) => ({ targetName, ignoreReason }));
	}

	getVCResult = ({ start, stop, tti, prefix, ssr, vc }: GetVCResultType): VCResult => {
		const startTime = performance.now();
		// add local measurement
		const fullPrefix = prefix !== undefined && prefix !== '' ? `${prefix}:` : '';

		const rawData = vc !== undefined ? vc : this.getVCRawData();
		if (rawData === null) {
			return {};
		}

		const {
			abortReason,
			abortReasonInfo,
			heatmap,
			heatmapNext,
			outOfBoundaryInfo,
			totalTime,
			componentsLog,
			viewport,
			devToolsEnabled,
			ratios,
		} = rawData;

		if (abortReasonInfo !== null && abortReason.blocking) {
			// exposing data to devtools
			try {
				if (devToolsEnabled && !this.isPostInteraction) {
					window.__vcNotAvailableReason = abortReasonInfo;
				}
			} catch (e) {}
			return {
				[`${fullPrefix}vc:state`]: false,
				[`${fullPrefix}vc:abort:reason`]: abortReasonInfo,
				[`${fullPrefix}vc:abort:timestamp`]: abortReason.timestamp,
			};
		}

		const { VC, VCBox, VCEntries, totalPainted } = VCObserver.calculateVC({
			heatmap,
			ssr,
			componentsLog: { ...componentsLog },
			viewport,
		});

		try {
			if (!this.isPostInteraction) {
				VCObserver.VCParts.forEach((key) => {
					const duration = VC[key];
					if (duration !== null && duration !== undefined) {
						performance.measure(`VC${key}`, { start, duration });
					}
				});
			}
		} catch (e) {
			/* empty */
		}

		let _componentsLog: ComponentsLogType = {};
		if (fg('ufo-remove-vc-component-observations-after-ttai')) {
			Object.entries(this.componentsLog).forEach(([_timestamp, value]) => {
				const timestamp = Number(_timestamp);
				if (stop > timestamp) {
					_componentsLog[timestamp] = value;
				}
			});
		} else {
			_componentsLog = { ...componentsLog };
		}

		const vcNext = VCObserver.calculateVC({
			heatmap: heatmapNext,
			ssr,
			componentsLog: _componentsLog,
			viewport,
		});

		try {
			if (!this.isPostInteraction) {
				VCObserver.VCParts.forEach((key) => {
					const duration = vcNext.VC[key];
					if (duration !== null && duration !== undefined) {
						performance.measure(`VC_Next${key}`, { start, duration });
					}
				});
			}
		} catch (e) {
			/* empty */
		}

		const outOfBoundary = outOfBoundaryInfo ? { [`${fullPrefix}vc:oob`]: outOfBoundaryInfo } : {};
		//const oldDomUpdates = oldDomUpdatesEnabled ? { [`${fullPrefix}vc:old:dom`]: vcNext.VCBox } : {};

		const stopTime = performance.now();

		// exposing data to devtools
		try {
			if (!this.isPostInteraction && devToolsEnabled) {
				window.__vc = {
					entries: VCEntries.rel,
					log: componentsLog,
					metrics: {
						'75': VC['75'],
						'80': VC['80'],
						'85': VC['85'],
						'90': VC['90'],
						'95': VC['95'],
						'98': VC['98'],
						'99': VC['99'],
						tti,
						ttai: stop - start,
					},
					heatmap,
					ratios,
				};

				// Emitting a custom event to make it available in the Chrome extension
				window.dispatchEvent(
					new CustomEvent('vcReady', {
						detail: {
							log: filterComponentsLog(componentsLog),
							entries: VCEntries.rel,
						},
					}),
				);
			}
		} catch (e) {
			/*  do nothing */
		}

		return {
			'metrics:vc': VC,
			[`${fullPrefix}vc:state`]: true,
			[`${fullPrefix}vc:clean`]: !abortReasonInfo,
			[`${fullPrefix}vc:dom`]: VCBox,
			[`${fullPrefix}vc:updates`]: VCEntries.rel.slice(0, 50), // max 50
			[`${fullPrefix}vc:size`]: viewport,
			[`${fullPrefix}vc:time`]: Math.round(totalTime + (stopTime - startTime)),
			[`${fullPrefix}vc:total`]: totalPainted,
			[`${fullPrefix}vc:ratios`]: ratios,
			...outOfBoundary,
			[`${fullPrefix}vc:next`]: vcNext.VC,
			[`${fullPrefix}vc:next:updates`]: vcNext.VCEntries.rel.slice(0, 50),
			//...oldDomUpdates,
			[`${fullPrefix}vc:ignored`]: this.getIgnoredElements(componentsLog),
		};
	};

	static calculateVC({
		heatmap,
		ssr = UNUSED_SECTOR,
		componentsLog,
		viewport,
	}: {
		heatmap: number[][];
		ssr?: number;
		componentsLog: ComponentsLogType;
		viewport: { w: number; h: number };
	}) {
		const lastUpdate: { [key: string]: number } = {};
		let totalPainted = 0;

		if (ssr !== UNUSED_SECTOR) {
			const element = {
				__debug__element: new WeakRef<HTMLElement>(window.document?.body),
				intersectionRect: {
					top: 0,
					left: 0,
					right: 0,
					bottom: 0,
					x: 0,
					y: 0,
					width: viewport.w,
					height: viewport.h,
					toJSON() {
						return {};
					},
				},
				targetName: 'SSR',
			};
			if (!componentsLog[ssr]) {
				componentsLog[ssr] = [];
			}
			componentsLog[ssr].push(element);
		}

		heatmap.forEach((line) => {
			line.forEach((entry) => {
				const rounded = Math.floor(entry === UNUSED_SECTOR && ssr !== UNUSED_SECTOR ? ssr : entry);
				totalPainted += rounded !== UNUSED_SECTOR ? 1 : 0;
				if (rounded !== UNUSED_SECTOR) {
					lastUpdate[rounded] = lastUpdate[rounded] ? lastUpdate[rounded] + 1 : 1;
				}
			});
		});

		const entries: number[][] = Object.entries(lastUpdate)
			.map((a) => [parseInt(a[0], 10), a[1]])
			.sort((a, b) => (a[0] > b[0] ? 1 : -1));

		const VC: { [key: string]: number | null } = VCObserver.makeVCReturnObj<number>();
		const VCBox: { [key: string]: string[] | null } = VCObserver.makeVCReturnObj<string[]>();

		entries.reduce((acc = 0, v) => {
			const VCRatio = v[1] / totalPainted + acc;
			const time = v[0];
			VCObserver.VCParts.forEach((key) => {
				const value = parseInt(key, 10);
				if ((VC[key] === null || VC[key] === undefined) && VCRatio >= value / 100) {
					VC[key] = time;
					VCBox[key] = componentsLog[time]?.map((v) => v.targetName);
				}
			});
			return VCRatio;
		}, 0);

		const VCEntries = entries.reduce(
			(acc: { abs: number[][]; rel: VCEntryType[] }, [timestamp, entryPainted], i) => {
				const currentlyPainted = entryPainted + (acc.abs[i - 1]?.[1] || 0);
				const currentlyPaintedRatio = Math.round((currentlyPainted / totalPainted) * 1000) / 10;
				const logEntry = componentsLog[timestamp]?.map((v) => v.targetName);

				acc.abs.push([timestamp, currentlyPainted]);
				acc.rel.push({
					time: timestamp,
					vc: currentlyPaintedRatio,
					elements: logEntry,
				});
				return acc;
			},
			{ abs: [], rel: [] },
		);

		return { VC, VCBox, VCEntries, totalPainted };
	}

	setSSRElement(element: HTMLElement) {
		this.observers.setReactRootElement(element);
	}

	setReactRootRenderStart(startTime = performance.now()) {
		this.observers.setReactRootRenderStart(startTime);
	}

	setReactRootRenderStop(stopTime = performance.now()) {
		this.observers.setReactRootRenderStop(stopTime);
	}

	private handleUpdate = (
		rawTime: number,
		intersectionRect: DOMRectReadOnly,
		targetName: string,
		element: HTMLElement,
		type: ObservedMutationType,
		ignoreReason?: VCIgnoreReason,
	) => {
		this.measureStart();

		if (this.abortReason.reason === null || this.abortReason.blocking === false) {
			const time = Math.round(rawTime - this.startTime);
			const mappedValues = this.mapPixelsToHeatmap(
				intersectionRect.left,
				intersectionRect.top,
				intersectionRect.width,
				intersectionRect.height,
			);
			this.vcRatios[targetName] = this.getElementRatio(mappedValues);

			if (!ignoreReason) {
				this.applyChangesToHeatMap(mappedValues, time, this.heatmapNext);
			}

			if ((!ignoreReason || ignoreReason === 'not-visible') && type !== 'attr') {
				this.applyChangesToHeatMap(mappedValues, time, this.heatmap);
			}

			if (!this.componentsLog[time]) {
				this.componentsLog[time] = [];
			}

			this.componentsLog[time].push({
				__debug__element: this.devToolsEnabled ? new WeakRef<HTMLElement>(element) : null,
				intersectionRect,
				targetName,
				ignoreReason,
			});
		}
		// devtools export
		this.measureStop();
	};

	public abortObservation(abortReason: VCAbortReason = 'custom') {
		this.setAbortReason(abortReason, performance.now());
	}

	private setAbortReason(abort: VCAbortReason, timestamp: number, info = '') {
		if (this.abortReason.reason === null || this.abortReason.blocking === false) {
			this.abortReason.reason = abort;
			this.abortReason.info = info;
			this.abortReason.timestamp = timestamp;
			this.abortReason.blocking = abort !== abortReason.scroll;
			if (this.abortReason.blocking) {
				this.detachAbortListeners();
			}
		}
	}

	private resetState() {
		this.abortReason = {
			reason: null,
			info: '',
			timestamp: -1,
			blocking: false,
		};
		this.detachAbortListeners();
		this.heatmap = this.getCleanHeatmap();
		this.heatmapNext = this.getCleanHeatmap();

		this.totalTime = 0;
		this.componentsLog = {};
		this.vcRatios = {};
	}

	private getCleanHeatmap() {
		return Array(this.arraySize)
			.fill('')
			.map(() => Array(this.arraySize).fill(UNUSED_SECTOR));
	}

	private setViewportSize() {
		this.viewport.w = getViewportWidth();
		this.viewport.h = getViewportHeight();
	}

	private mapPixelsToHeatmap = (
		left: number,
		top: number,
		width: number,
		height: number,
	): PixelsToMap => {
		const { w, h } = this.viewport;

		const l = Math.floor((left / w) * this.arraySize);
		const t = Math.floor((top / h) * this.arraySize);
		const r = Math.ceil(((left + width) / w) * this.arraySize);
		const b = Math.ceil(((top + height) / h) * this.arraySize);

		// that info is temporary to get info why it goes over boundary
		if (this.outOfBoundaryInfo === '') {
			let outOfBoundaryInfo = '';

			if (r > this.arraySize) {
				outOfBoundaryInfo += ` r ${r} ! ${left} ${width}`;
			}

			if (b > this.arraySize) {
				outOfBoundaryInfo += ` r ${r} ! ${top} ${height}`;
			}

			this.outOfBoundaryInfo = outOfBoundaryInfo;
		}

		// correct values to min - 0, max - arraySize
		const result = {
			l: Math.max(0, l),
			t: Math.max(0, t),
			r: Math.min(this.arraySize, r),
			b: Math.min(this.arraySize, b),
		};

		return result;
	};

	private getElementRatio = (mappedValues: PixelsToMap): number => {
		const { r, l, b, t } = mappedValues;
		return ((r - l) * (b - t)) / (this.arraySize * this.arraySize);
	};

	private applyChangesToHeatMap(a: PixelsToMap, time: number, heatmap: number[][]) {
		const { l, t, r, b } = a;
		const localHeatmap = heatmap;
		for (let row = t; row < b; row++) {
			for (let col = l; col < r; col++) {
				if (localHeatmap[row] === undefined) {
					try {
						this.setAbortReason(abortReason.error, time, `index - ${row}`);
					} catch (e) {
						this.setAbortReason(abortReason.error, time, 'row error');
					}
					return;
				} else {
					localHeatmap[row][col] = time;
				}
			}
		}
	}

	static makeVCReturnObj<T>() {
		const vc: { [key: string]: null | T } = {};
		VCObserver.VCParts.forEach((v) => {
			vc[v] = null;
		});
		return vc;
	}

	private abortReasonCallback = (key: string, time: number) => {
		switch (key) {
			case 'wheel':
				this.setAbortReason(abortReason.scroll, time);
				break;
			case 'keydown':
				this.setAbortReason(abortReason.keypress, time);
				break;
			case 'resize':
				this.setAbortReason(abortReason.resize, time);
				break;
		}
	};

	private attachAbortListeners = () => {
		this.detachAbortListeners();
		let unbinds = attachAbortListeners(window, this.viewport, this.abortReasonCallback);
		if (window?.__SSR_ABORT_LISTENERS__) {
			Object.entries(window.__SSR_ABORT_LISTENERS__.aborts).forEach(([key, time]) => {
				if (time) {
					this.abortReasonCallback(key, time);
				}
			});
			unbinds = unbinds.concat(window.__SSR_ABORT_LISTENERS__.unbinds);
			delete window?.__SSR_ABORT_LISTENERS__;
		}
		this.unbind = unbinds;
	};

	private detachAbortListeners() {
		this.unbind.forEach((fn) => fn());
		this.unbind = [];
	}

	private measureStart() {
		this._startMeasureTimestamp = performance.now();
	}

	private measureStop() {
		if (this._startMeasureTimestamp === -1) {
			return;
		}
		this.totalTime += performance.now() - this._startMeasureTimestamp;
		this._startMeasureTimestamp = -1;
	}
}
