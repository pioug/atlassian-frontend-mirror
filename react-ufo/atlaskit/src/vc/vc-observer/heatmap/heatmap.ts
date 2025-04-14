import type {
	ComponentsLogType,
	RevisionPayload,
	VCEntryType,
	VCIgnoreReason,
	VCRatioType,
} from '../../../common/vc/types';
import { getPageVisibilityState } from '../../../hidden-timing';
import { markProfilingEnd, markProfilingStart, withProfiling } from '../../../self-measurements';
import type { ObservedMutationType } from '../observers/types';
import type {
	FilterComponentsLogType,
	RevisionEntry,
	VCCalculationMethodType,
} from '../revisions/types';

type Viewport = {
	w: number;
	h: number;
};

type ArraySize = {
	w: number;
	h: number;
};

type HeatmapAttrs = {
	viewport: Viewport;
	revisions: RevisionEntry[];
	arraySize?: ArraySize;
	devToolsEnabled?: boolean;
};

type PixelsToMap = { l: number; t: number; r: number; b: number };

type Heatmap = Int32Array;

type ProcessDataArgs = {
	VCParts: number[];
	VCCalculationMethods: VCCalculationMethodType[];
	clean: boolean;
	isEventAborted: boolean;
	interactionStart: number;
	ttai: number;
	filterComponentsLog: FilterComponentsLogType[];
	ssr?: number;
};

type PerRevision<T> = T[];

export type ApplyChangesError = { error: string; time: number };
type ApplyChangesResult = true | ApplyChangesError;

export type HandleUpdateArgs = {
	time: number;
	type: ObservedMutationType;
	classification: boolean[];
	intersectionRect: DOMRectReadOnly;
	element: HTMLElement;
	targetName: string;
	ignoreReason?: VCIgnoreReason;
	onError: (error: ApplyChangesError) => void;
	attributeName?: string | null;
	oldValue?: string | null;
	newValue?: string | null;
};

const UNUSED_SECTOR = 0;

export class MultiRevisionHeatmap {
	viewport: Viewport;
	arraySize: ArraySize = {
		w: 200,
		h: 200,
	};
	revisions: RevisionEntry[];
	heatmaps: Heatmap[];
	devToolsEnabled: boolean;

	vcRatios: PerRevision<VCRatioType>;

	componentsLogs: PerRevision<ComponentsLogType>;

	constructor({ viewport, revisions, arraySize, devToolsEnabled }: HeatmapAttrs) {
		const operationTimer = markProfilingStart('MultiRevisionHeatmap constructor');
		this.viewport = viewport;
		this.revisions = revisions;
		if (arraySize) {
			this.arraySize = arraySize;
		}
		this.heatmaps = new Array(revisions.length);
		this.componentsLogs = new Array(revisions.length);
		this.vcRatios = new Array(revisions.length);

		this.devToolsEnabled = devToolsEnabled || false;

		revisions.forEach(({}, i) => {
			this.heatmaps[i] = this.getCleanHeatmap();
			this.componentsLogs[i] = {};
			this.vcRatios[i] = {};
		});

		this.handleUpdate = withProfiling(this.handleUpdate.bind(this), ['vc']);
		this.getData = withProfiling(this.getData.bind(this), ['vc']);
		this.getPayloadShapedData = withProfiling(this.getPayloadShapedData.bind(this), ['vc']);
		this.processData = withProfiling(this.processData.bind(this), ['vc']);
		this.mapPixelsToHeatmap = withProfiling(this.mapPixelsToHeatmap.bind(this), ['vc']);
		this.getElementRatio = withProfiling(this.getElementRatio.bind(this), ['vc']);
		this.applyChangesToHeatMap = withProfiling(this.applyChangesToHeatMap.bind(this), ['vc']);
		this.getIndex = withProfiling(this.getIndex.bind(this), ['vc']);
		this.getCleanHeatmap = withProfiling(this.getCleanHeatmap.bind(this), ['vc']);
		markProfilingEnd(operationTimer);
	}

	handleUpdate({
		time,
		type,
		classification,
		intersectionRect,
		element,
		targetName,
		ignoreReason,
		onError,
		attributeName,
		oldValue,
		newValue,
	}: HandleUpdateArgs) {
		const mappedValues = this.mapPixelsToHeatmap(
			intersectionRect.left,
			intersectionRect.top,
			intersectionRect.width,
			intersectionRect.height,
		);

		const result = this.applyChangesToHeatMap(mappedValues, time, classification);
		if (result !== true) {
			onError(result);
		}

		const componentRatio = this.getElementRatio(mappedValues);

		this.revisions.forEach((_, i) => {
			if (classification[i]) {
				this.vcRatios[i][targetName] = componentRatio;
			}

			if (!this.componentsLogs[i][time]) {
				this.componentsLogs[i][time] = [];
			}

			this.componentsLogs[i][time].push({
				__debug__element: this.devToolsEnabled ? new WeakRef<HTMLElement>(element) : null,
				intersectionRect,
				targetName,
				ignoreReason,
				attributeName,
				oldValue,
				newValue,
			});
		});
	}

	getData() {
		return {
			heatmaps: this.heatmaps,
		};
	}

	getPayloadShapedData(args: ProcessDataArgs): RevisionPayload {
		const pageVisibilityUpToTTAI = getPageVisibilityState(args.interactionStart, args.ttai);

		const result = this.processData(args);
		const payload = this.revisions.map((rev, i) => {
			const vcDetails: { [key: string]: { t: number; e: string[] } } = {};
			args.VCParts.forEach((VCPart) => {
				vcDetails[VCPart] = {
					t: result[i].VC[VCPart] || 0,
					e: Array.from(result[i].VCBox[VCPart] || []),
				};
			});

			return {
				revision: rev.name,
				vcDetails,
				clean: args.clean,
				'metric:vc90':
					args.clean && !args.isEventAborted && pageVisibilityUpToTTAI === 'visible'
						? vcDetails?.['90']?.t
						: null,
			};
		});
		return payload;
	}

	processData({
		VCParts,
		VCCalculationMethods,
		filterComponentsLog,
		ttai,
		ssr = UNUSED_SECTOR,
	}: ProcessDataArgs) {
		return this.heatmaps.map((heatmap, i) => {
			const lastUpdate: { [key: string]: number } = {};
			let totalPainted = 0;
			let componentsLog = this.componentsLogs[i];

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
						width: this.viewport.w,
						height: this.viewport.h,
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

			for (let i = 0; i < heatmap.length; i++) {
				const rounded = Math.floor(
					heatmap[i] === UNUSED_SECTOR && ssr !== UNUSED_SECTOR ? ssr : heatmap[i],
				);
				totalPainted += rounded !== UNUSED_SECTOR ? 1 : 0;
				if (rounded !== UNUSED_SECTOR) {
					lastUpdate[rounded] = lastUpdate[rounded] ? lastUpdate[rounded] + 1 : 1;
				}
			}

			const entries: number[][] = Object.entries(lastUpdate)
				.map((a) => [parseInt(a[0], 10), a[1]])
				.sort((a, b) => (a[0] > b[0] ? 1 : -1));

			// @todo remove it once fixed as described: https://product-fabric.atlassian.net/browse/AFO-3443
			componentsLog = filterComponentsLog[i]({ componentsLog, ttai });

			const { VC, VCBox } = VCCalculationMethods[i]({
				VCParts,
				componentsLog,
				entries,
				totalPainted,
			});

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
		});
	}

	private mapPixelsToHeatmap = (
		left: number,
		top: number,
		width: number,
		height: number,
	): PixelsToMap => {
		const { w, h } = this.viewport;

		const l = Math.floor((left / w) * this.arraySize.w);
		const t = Math.floor((top / h) * this.arraySize.h);
		const r = Math.ceil(((left + width) / w) * this.arraySize.w);
		const b = Math.ceil(((top + height) / h) * this.arraySize.h);

		// correct values to min - 0, max - arraySize
		const result = {
			l: Math.max(0, l),
			t: Math.max(0, t),
			r: Math.min(this.arraySize.w, r),
			b: Math.min(this.arraySize.h, b),
		};

		return result;
	};

	private getElementRatio = (mappedValues: PixelsToMap): number => {
		const { r, l, b, t } = mappedValues;
		return ((r - l) * (b - t)) / (this.arraySize.w * this.arraySize.h);
	};

	private applyChangesToHeatMap(
		a: PixelsToMap,
		time: number,
		classification: boolean[],
	): ApplyChangesResult {
		const { l, t, r, b } = a;
		const size = classification.length;

		for (let row = t; row < b; row++) {
			if (this.heatmaps[0][row] === undefined) {
				try {
					return {
						error: `index - ${row}`,
						time,
					};
				} catch (e) {
					return {
						error: 'row error',
						time,
					};
				}
			} else {
				for (let heatmapIndex = 0; heatmapIndex < size; heatmapIndex++) {
					if (classification[heatmapIndex]) {
						this.heatmaps[heatmapIndex].fill(time, this.getIndex(l, row), this.getIndex(r, row));
					}
				}
			}
		}
		return true;
	}

	private getIndex(x: number, y: number) {
		return x + this.arraySize.w * y;
	}

	private getCleanHeatmap() {
		return new Int32Array(this.arraySize.w * this.arraySize.h);
	}

	static makeVCReturnObj = withProfiling(
		function makeVCReturnObj<T>(VCParts: number[]) {
			const vc: { [key: string]: null | T } = {};
			VCParts.forEach((v) => {
				vc[v] = null;
			});
			return vc;
		},
		['vc'],
	);
}
