import { fg } from '@atlaskit/platform-feature-flags';

import { type RevisionPayloadEntry } from '../../common/vc/types';
import { SSRPlaceholderHandlers } from '../vc-observer/observers/ssr-placeholders';

import EntriesTimeline from './entries-timeline';
import getElementName, { type SelectorConfig } from './get-element-name';
import VCCalculator_FY25_03 from './metric-calculator/fy25_03';
import getViewportHeight from './metric-calculator/utils/get-viewport-height';
import getViewportWidth from './metric-calculator/utils/get-viewport-width';
import VCNextCalculator from './metric-calculator/vcnext';
import RawDataHandler from './raw-data-handler';
import type { VCObserverGetVCResultParam, VCObserverLabelStacks, ViewportEntryData } from './types';
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

				const data: ViewportEntryData = {
					type,
					elementName,
					rect,
					previousRect,
					visible,
					attributeName: mutationData?.attributeName,
					oldValue: mutationData?.oldValue,
					newValue: mutationData?.newValue,
				};

				if (
					element &&
					this.isPostInteraction &&
					fg('platform_ufo_enable_late_mutation_label_stacks')
				) {
					const labelStacks = getLabelStacks(element);
					if (labelStacks) {
						Object.assign(data, { labelStacks });
					}
				}

				this.entriesTimeline.push({
					time,
					data,
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
		const {
			start,
			stop,
			interactionId,
			interactionType,
			interactionAbortReason,
			isPageVisible,
			include3p,
			includeSSRRatio,
			excludeSmartAnswersInSearch,
			includeRawData,
		} = param;
		const results: RevisionPayloadEntry[] = [];
		this.addStartEntry(start);
		const feVCCalculationStartTime = performance.now();

		const calculator_fy25_03 = new VCCalculator_FY25_03();

		if (param.includeSSRInV3 && param.ssr) {
			this.addSSR(param.ssr);
		}

		const orderedEntries = this.entriesTimeline.getOrderedEntries({ start, stop });
		const fy25_03 = await calculator_fy25_03.calculate({
			orderedEntries,
			startTime: start,
			stopTime: stop,
			interactionId,
			interactionType,
			isPostInteraction: this.isPostInteraction,
			include3p,
			excludeSmartAnswersInSearch,
			includeSSRRatio,
			isPageVisible,
			interactionAbortReason,
		});

		if (fy25_03) {
			results.push(fy25_03);
		}

		// From TTVC v4 onwards, ensuring that SSR entry is always auto-added, whenever it is configured.
		// From the next major version release (where TTVC v4 becomes the default TTVC version), the config for `includeSSRInV3` will be deprecated
		if (param.ssr && !param.includeSSRInV3 && fg('platform_ufo_auto_add_ssr_entry_in_ttvc_v4')) {
			this.addSSR(param.ssr);
		}

		// TODO on cleanup: put behind `enabledVCRevisions` config
		const calculator_next = new VCNextCalculator();

		const vcNext = await calculator_next.calculate({
			orderedEntries,
			startTime: start,
			stopTime: stop,
			interactionId,
			interactionType,
			isPostInteraction: this.isPostInteraction,
			include3p,
			includeSSRRatio,
			isPageVisible,
			interactionAbortReason,
		});

		if (vcNext) {
			results.push(vcNext);
		}
		const feVCCalculationEndTime = performance.now();

		if (includeRawData && fg('platform_ufo_enable_vc_raw_data')) {
			const rawVCCalculationStartTime = performance.now();
			const rawHandler = new RawDataHandler();
			const raw = await rawHandler.getRawData({
				entries: orderedEntries,
				startTime: start,
				stopTime: stop,
				isPageVisible,
			});

			if (raw) {
				raw.rawVCTime = Number((performance.now() - rawVCCalculationStartTime).toFixed(2));
				raw.feVCTime = Number((feVCCalculationEndTime - feVCCalculationStartTime).toFixed(2));
				results.push(raw);
			}
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

type ReactFiberType = {
	memoizedProps?: Record<string, any>;
	child?: ReactFiberType | null;
	type: { displayName?: any; name?: any } | null;
	return: ReactFiberType | null;
};

function labelStackFromFiber(fiber: ReactFiberType): { name: string; segmentId?: string }[] {
	const value = fiber?.child?.memoizedProps?.value;
	return Array.isArray(value?.labelStack) ? value.labelStack : [];
}

function labelStackToString(labelStack: { name: string; segmentId?: string }[]): string {
	return labelStack.map((label) => label.name).join('/');
}

function labelStackToSegment(labelStack: { name: string; segmentId?: string }[]): string {
	let segmentIndex = -1;
	for (let i = labelStack.length - 1; i >= 0; i--) {
		if (labelStack[i].segmentId) {
			segmentIndex = i;
			break;
		}
	}
	return labelStack
		.slice(0, segmentIndex + 1)
		.map((label) => label.name)
		.join('/');
}

function traverseFiber(fiber: ReactFiberType): VCObserverLabelStacks {
	let segment: string = 'unknown';
	let labelStackString: string = 'unknown';
	let currentFiber: null | ReactFiberType = fiber;
	while (currentFiber) {
		if (currentFiber.type) {
			const componentName = currentFiber.type.displayName || currentFiber.type.name;

			if (componentName === 'UFOSegment' || componentName === 'UFOLabel') {
				const labelStack = labelStackFromFiber(currentFiber);
				labelStackString = labelStackToString(labelStack) || 'unknown';
				segment = labelStackToSegment(labelStack) || 'unknown';
				break;
			}
		}
		currentFiber = currentFiber.return;
	}

	return { segment, labelStack: labelStackString };
}

function getLabelStacks(element: HTMLElement): VCObserverLabelStacks | null {
	const reactFiberKey = Object.keys(element as any).find((key) => key.startsWith('__reactFiber$'));
	if (!reactFiberKey) {
		return null;
	}
	const fiber = (element as any)[reactFiberKey] as ReactFiberType | undefined;
	return fiber ? traverseFiber(fiber) : null;
}
