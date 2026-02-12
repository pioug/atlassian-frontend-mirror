import { fg } from '@atlaskit/platform-feature-flags';

import { type RevisionPayloadEntry } from '../../common/vc/types';
import { isVCRevisionEnabled } from '../../config';
import { getActiveInteraction } from '../../interaction-metrics';
import type { SearchPageConfig } from '../types';
import { SSRPlaceholderHandlers } from '../vc-observer/observers/ssr-placeholders';

import EntriesTimeline from './entries-timeline';
import getElementName, { type SelectorConfig } from './get-element-name';
import VCCalculator_FY25_03 from './metric-calculator/fy25_03';
import VCCalculator_FY26_04 from './metric-calculator/fy26_04';
import getViewportHeight from './metric-calculator/utils/get-viewport-height';
import getViewportWidth from './metric-calculator/utils/get-viewport-width';
import VCCalculator_Next from './metric-calculator/vc-next';
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
	searchPageConfig?: SearchPageConfig;
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

let hasAbortingEventDuringSSR = false;

export function getHasAbortingEventDuringSSR() {
	return hasAbortingEventDuringSSR;
}

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

				if (element) {
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
			searchPageConfig: config.searchPageConfig,
		});

		this.windowEventObserver = new WindowEventObserver({
			onEvent: ({ time, type }) => {
				// Don't abort press interactions on keydown events, as keydown is expected
				// when users press Enter/Space to activate buttons or other interactive elements
				if (type === 'keydown' && fg('platform_ufo_keypress_interaction_abort')) {
					const interaction = getActiveInteraction();
					if (interaction?.type === 'press') {
						return;
					}
				}
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

	start(_: any): void {
		// Reset SSR state on start (matches old VCObserver behavior)
		this.ssr = {
			state: SSRState.normal,
			reactRootElement: null, // Reset to null (matches old VCObserver)
			renderStart: -1,
			renderStop: -1,
		};

		this.viewportObserver?.start();

		if (fg('ufo_fix_aborting_interaction_detection_during_ssr')) {
			this.entriesTimeline.clear();

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
		} else {
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

							if (fg('ufo_detect_aborting_interaction_during_ssr')) {
								hasAbortingEventDuringSSR = true;
							}
						}
					});
				}
			}

			this.windowEventObserver?.start();
			this.entriesTimeline.clear();
		}
	}

	stop(): void {
		this.viewportObserver?.stop();
		this.windowEventObserver?.stop();

		// Clear SSR state on stop (matches old VCObserver behavior)
		this.ssr.reactRootElement = null;
	}

	// SSR related methods
	setReactRootElement(element: HTMLElement): void {
		this.ssr.reactRootElement = element;
	}

	setReactRootRenderStart(startTime: number = performance.now()): void {
		this.ssr.renderStart = startTime;
		this.ssr.state = SSRState.waitingForFirstRender;
	}

	setReactRootRenderStop(stopTime: number = performance.now()): void {
		this.ssr.renderStop = stopTime;
	}

	collectSSRPlaceholders(): void {
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

	addSSR(ssr: number): void {
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

	async getVCResult(param: VCObserverGetVCResultParam): Promise<RevisionPayloadEntry[]> {
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
			rawDataStopTime,
		} = param;
		const results: RevisionPayloadEntry[] = [];
		this.addStartEntry(start);
		const feVCCalculationStartTime = performance.now();

		const calculator_fy25_03 = new VCCalculator_FY25_03();

		if (param.includeSSRInV3 && param.ssr) {
			this.addSSR(param.ssr);
		}

		const orderedEntries = this.entriesTimeline.getOrderedEntries({ start, stop });

		const fy25_03 = isVCRevisionEnabled('fy25.03')
			? await calculator_fy25_03.calculate({
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
				})
			: null;

		if (fy25_03) {
			results.push(fy25_03);
		}

		// From TTVC v4 onwards, ensuring that SSR entry is always auto-added, whenever it is configured.
		if (param.ssr) {
			this.addSSR(param.ssr);
		}

		const calculator_fy26_04 = new VCCalculator_FY26_04();
		const calculator_next = new VCCalculator_Next();

		const calculatorParams = {
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
		};

		const [fy26_04, vcNext] = await Promise.all([
			isVCRevisionEnabled('fy26.04') ? calculator_fy26_04.calculate(calculatorParams) : null,
			isVCRevisionEnabled('next') ? calculator_next.calculate(calculatorParams) : null,
		]);

		if (fy26_04) {
			results.push(fy26_04);
		}

		if (vcNext) {
			results.push(vcNext);
		}

		const feVCCalculationEndTime = performance.now();

		if (includeRawData && fg('platform_ufo_enable_vc_raw_data')) {
			const rawVCCalculationStartTime = performance.now();
			const rawHandler = new RawDataHandler();
			// Use rawDataStopTime (end3p) when available to capture observations during 3p holds
			const rawStopTime = rawDataStopTime ?? stop;
			const rawOrderedEntries = rawDataStopTime
				? this.entriesTimeline.getOrderedEntries({ start, stop: rawStopTime })
				: orderedEntries;
			const raw = await rawHandler.getRawData({
				entries: rawOrderedEntries,
				startTime: start,
				stopTime: rawStopTime,
				isPageVisible,
			});
			results.forEach((result) => {
				delete result.vcDetails;
				delete result.ratios;
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
