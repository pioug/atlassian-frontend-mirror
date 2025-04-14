import { markProfilingEnd, markProfilingStart, withProfiling } from '../../self-measurements';

import EntriesTimeline from './entries-timeline';
import getElementName, { type SelectorConfig } from './get-element-name';
import VCCalculator_FY25_03 from './metric-calculator/fy25_03';
import type { RevisionPayloadEntry } from './metric-calculator/types';
import type { VCObserverGetVCResultParam } from './types';
import ViewportObserver from './viewport-observer';
import WindowEventObserver from './window-event-observer';

export type VCObserverNewConfig = {
	selectorConfig?: SelectorConfig;
};

const DEFAULT_SELECTOR_CONFIG = {
	id: false,
	testId: true,
	role: false,
	className: false,
	dataVC: true,
};

export default class VCObserverNew {
	private selectorConfig: SelectorConfig;
	private viewportObserver: ViewportObserver | null = null;
	private windowEventObserver: WindowEventObserver | null = null;

	private entriesTimeline: EntriesTimeline;

	constructor(config: VCObserverNewConfig) {
		const operationTimer = markProfilingStart('VCObserverNew constructor');
		this.entriesTimeline = new EntriesTimeline();

		this.selectorConfig = config.selectorConfig ?? DEFAULT_SELECTOR_CONFIG;

		this.viewportObserver = new ViewportObserver({
			onChange: (onChangeArg) => {
				const { time, type, elementRef, visible, rect, previousRect, mutationData } = onChangeArg;
				let elementName = 'unknown';
				const element = elementRef.deref();

				if (element) {
					elementName = this.getElementName(element);
				}

				this.entriesTimeline.push({
					time,
					type,
					data: {
						elementName,
						rect,
						previousRect,
						visible,
						attributeName: mutationData?.attributeName,
					},
				});
			},
		});

		this.windowEventObserver = new WindowEventObserver({
			onEvent: ({ time, type }) => {
				this.entriesTimeline.push({
					time,
					type: 'window:event',
					data: {
						eventType: type,
					},
				});
			},
		});

		this.start = withProfiling(this.start.bind(this), ['vc']);
		this.stop = withProfiling(this.stop.bind(this), ['vc']);
		this.getVCResult = withProfiling(this.getVCResult.bind(this), ['vc']);
		this.getElementName = withProfiling(this.getElementName.bind(this), ['vc']);
		markProfilingEnd(operationTimer, { tags: ['vc'] });
	}

	start({ startTime }: { startTime: DOMHighResTimeStamp }) {
		this.viewportObserver?.start();
		this.windowEventObserver?.start();
		this.entriesTimeline.clear();
	}

	stop() {
		this.viewportObserver?.stop();
		this.windowEventObserver?.stop();
	}

	async getVCResult(param: VCObserverGetVCResultParam) {
		const { start, stop } = param;
		const results: RevisionPayloadEntry[] = [];

		const calculator_fy25_03 = new VCCalculator_FY25_03();

		const orderedEntries = this.entriesTimeline.getOrderedEntries({ start, stop });
		const fy25_03 = await calculator_fy25_03.calculate({
			orderedEntries,
			startTime: start,
			stopTime: stop,
		});
		if (fy25_03) {
			results.push(fy25_03);
		}

		return results;
	}

	private getElementName(element: HTMLElement) {
		return getElementName(this.selectorConfig, element);
	}
}
