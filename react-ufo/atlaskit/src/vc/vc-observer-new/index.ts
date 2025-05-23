import { fg } from '@atlaskit/platform-feature-flags';

import { type RevisionPayloadEntry } from '../../common/vc/types';

import EntriesTimeline from './entries-timeline';
import getElementName, { type SelectorConfig } from './get-element-name';
import VCCalculator_FY25_03 from './metric-calculator/fy25_03';
import type { VCObserverGetVCResultParam } from './types';
import ViewportObserver from './viewport-observer';
import WindowEventObserver from './window-event-observer';

export type VCObserverNewConfig = {
	selectorConfig?: SelectorConfig;
	isPostInteraction?: boolean;
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
	private isPostInteraction: boolean;

	constructor(config: VCObserverNewConfig) {
		this.entriesTimeline = new EntriesTimeline();
		this.isPostInteraction = config.isPostInteraction ?? false;

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
					data: {
						type,
						elementName,
						rect,
						previousRect,
						visible,
						attributeName: mutationData?.attributeName,
						oldValue: mutationData?.oldValue,
						newValue: mutationData?.newValue,
					},
				});
			},
		});

		this.windowEventObserver = new WindowEventObserver({
			onEvent: ({ time, type }) => {
				this.entriesTimeline.push({
					time,
					data: {
						type: 'window:event',
						eventType: type,
					},
				});
			},
		});
	}

	start({ startTime }: { startTime: DOMHighResTimeStamp }) {
		this.viewportObserver?.start();

		if (window?.__SSR_ABORT_LISTENERS__ && fg('platform_ufo_vc_observer_new_ssr_abort_listener')) {
			const abortListeners = window.__SSR_ABORT_LISTENERS__;

			const aborts = abortListeners.aborts;
			if (aborts && typeof aborts === 'object') {
				Object.entries(aborts).forEach(([key, time]) => {
					if (typeof time === 'number') {
						this.entriesTimeline.push({
							time,
							data: {
								type: 'window:event',
								eventType: key as 'wheel' | 'keydown' | 'resize',
							},
						});
					}
				});
			}
		}

		this.windowEventObserver?.start();
		this.entriesTimeline.clear();
	}

	stop() {
		this.viewportObserver?.stop();
		this.windowEventObserver?.stop();
	}

	async getVCResult(param: VCObserverGetVCResultParam) {
		const { start, stop, interactionId } = param;
		const results: RevisionPayloadEntry[] = [];

		const calculator_fy25_03 = new VCCalculator_FY25_03();

		const orderedEntries = this.entriesTimeline.getOrderedEntries({ start, stop });
		const fy25_03 = await calculator_fy25_03.calculate({
			orderedEntries,
			startTime: start,
			stopTime: stop,
			interactionId,
			isPostInteraction: this.isPostInteraction,
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
