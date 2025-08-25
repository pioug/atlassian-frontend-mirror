import { type RevisionPayloadEntry } from '../../common/vc/types';
import { SSRPlaceholderHandlers } from '../vc-observer/observers/ssr-placeholders';

import EntriesTimeline from './entries-timeline';
import getElementName, { type SelectorConfig } from './get-element-name';
import VCCalculator_FY25_03 from './metric-calculator/fy25_03';
import getViewportHeight from './metric-calculator/utils/get-viewport-height';
import getViewportWidth from './metric-calculator/utils/get-viewport-width';
import type { VCObserverGetVCResultParam } from './types';
import ViewportObserver from './viewport-observer';
import WindowEventObserver from './window-event-observer';

export type VCObserverNewConfig = {
	selectorConfig?: SelectorConfig;
	isPostInteraction?: boolean;
	SSRConfig?: {
		enablePageLayoutPlaceholder?: boolean;
	};
	ssrPlaceholderHandler?: SSRPlaceholderHandlers | null;
};

const SSRState = {
	normal: 1,
	waitingForFirstRender: 2,
	ignoring: 3,
} as const;

type SSRStateType = (typeof SSRState)[keyof typeof SSRState];

type SSRInclusiveState = {
	state: SSRStateType;
	reactRootElement: HTMLElement | null;
	renderStop: number;
	renderStart: number;
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

	// SSR related properties
	private ssrPlaceholderHandler: SSRPlaceholderHandlers | null = null;
	private ssr: SSRInclusiveState = {
		state: SSRState.normal,
		reactRootElement: null,
		renderStart: -1,
		renderStop: -1,
	};

	constructor(config: VCObserverNewConfig) {
		this.entriesTimeline = new EntriesTimeline();
		this.isPostInteraction = config.isPostInteraction ?? false;

		this.selectorConfig = config.selectorConfig ?? DEFAULT_SELECTOR_CONFIG;

		// Use shared SSR placeholder handler if provided, otherwise create new one if feature flag is enabled
		if (config.ssrPlaceholderHandler) {
			this.ssrPlaceholderHandler = config.ssrPlaceholderHandler;
		} else {
			this.ssrPlaceholderHandler = new SSRPlaceholderHandlers({
				enablePageLayoutPlaceholder: config.SSRConfig?.enablePageLayoutPlaceholder ?? false,
			});
		}

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
			// Pass SSR context to ViewportObserver
			getSSRState: () => this.getSSRState(),
			getSSRPlaceholderHandler: () => this.getSSRPlaceholderHandler(),
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

	start(_: any) {
		// Reset SSR state on start (matches old VCObserver behavior)
		this.ssr = {
			state: SSRState.normal,
			reactRootElement: null, // Reset to null (matches old VCObserver)
			renderStart: -1,
			renderStop: -1,
		};

		this.viewportObserver?.start();

		if (window?.__SSR_ABORT_LISTENERS__) {
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

		// Clear SSR state on stop (matches old VCObserver behavior)
		this.ssr.reactRootElement = null;
	}

	// SSR related methods
	setReactRootElement(element: HTMLElement) {
		this.ssr.reactRootElement = element;
	}

	setReactRootRenderStart(startTime: number = performance.now()) {
		this.ssr.renderStart = startTime;
		this.ssr.state = SSRState.waitingForFirstRender;
	}

	setReactRootRenderStop(stopTime: number = performance.now()) {
		this.ssr.renderStop = stopTime;
	}

	collectSSRPlaceholders() {
		// This is handled by the shared SSRPlaceholderHandlers in VCObserverWrapper
		// Individual observers don't need to implement this
	}

	// Internal methods for ViewportObserver to access SSR state
	getSSRState(): SSRInclusiveState {
		return this.ssr;
	}

	getSSRPlaceholderHandler(): SSRPlaceholderHandlers | null {
		return this.ssrPlaceholderHandler;
	}

	addSSR(ssr: number) {
		this.entriesTimeline.push({
			time: ssr,
			data: {
				elementName: 'SSR',
				type: 'mutation:element',
				rect: {
					height: getViewportHeight(),
					width: getViewportWidth(),
					left: 0,
					top: 0,
					x: 0,
					y: 0,
					bottom: getViewportHeight(),
					right: getViewportWidth(),
					toJSON() {
						return null;
					},
				},
				visible: true,
			},
		});
	}

	async getVCResult(param: VCObserverGetVCResultParam) {
		const { start, stop, interactionId, include3p } = param;
		const results: RevisionPayloadEntry[] = [];

		this.addStartEntry(start);

		const calculator_fy25_03 = new VCCalculator_FY25_03();

		if (param.ssr) {
			this.addSSR(param.ssr);
		}

		const orderedEntries = this.entriesTimeline.getOrderedEntries({ start, stop });
		const fy25_03 = await calculator_fy25_03.calculate({
			orderedEntries,
			startTime: start,
			stopTime: stop,
			interactionId,
			isPostInteraction: this.isPostInteraction,
			include3p,
		});
		if (fy25_03) {
			results.push(fy25_03);
		}

		return results;
	}

	private addStartEntry(startTime: DOMHighResTimeStamp) {
		this.entriesTimeline.push({
			time: startTime,
			data: {
				type: 'mutation:element',
				elementName: 'START',
				visible: true,
				rect: {
					x: 0,
					y: 0,
					width: window.innerWidth,
					height: window.innerHeight,
					top: 0,
					left: 0,
					bottom: window.innerHeight,
					right: window.innerWidth,
					toJSON: function () {
						return {
							x: this.x,
							y: this.y,
							width: this.width,
							height: this.height,
							top: this.top,
							left: this.left,
							bottom: this.bottom,
							right: this.right,
						};
					},
				} as DOMRect,
			},
		});
	}

	private getElementName(element: HTMLElement) {
		return getElementName(this.selectorConfig, element);
	}
}
