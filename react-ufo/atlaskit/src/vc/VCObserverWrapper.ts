import type { RevisionPayload, VCRawDataType, VCResult } from '../common/vc/types';
import { isVCRevisionEnabled } from '../config';

import type { GetVCResultType, VCObserverInterface, VCObserverOptions } from './types';
import { VCObserver } from './vc-observer';
import { default as VCObserverNew } from './vc-observer-new/index';
import { RLLPlaceholderHandlers } from './vc-observer/observers/rll-placeholders';
import { SSRPlaceholderHandlers } from './vc-observer/observers/ssr-placeholders';

export class VCObserverWrapper implements VCObserverInterface {
	private oldVCObserver: VCObserver | null;
	private newVCObserver: VCObserverNew | null;
	private ssrPlaceholderHandler: SSRPlaceholderHandlers;

	constructor(opts: VCObserverOptions = {}) {
		this.newVCObserver = null;
		this.oldVCObserver = null;

		// Initialize SSR placeholder handler once
		this.ssrPlaceholderHandler = new SSRPlaceholderHandlers({
			enablePageLayoutPlaceholder: opts.ssrEnablePageLayoutPlaceholder ?? false,
		});

		this.newVCObserver = new VCObserverNew({
			selectorConfig: opts.selectorConfig,
			isPostInteraction: opts.isPostInteraction,
			SSRConfig: {
				enablePageLayoutPlaceholder: opts.ssrEnablePageLayoutPlaceholder ?? false,
			},
			ssrPlaceholderHandler: this.ssrPlaceholderHandler,
			trackLayoutShiftOffenders: opts.trackLayoutShiftOffenders ?? false,
			searchPageConfig: opts.searchPageConfig,
		});

		if (isVCRevisionEnabled('fy25.01') || isVCRevisionEnabled('fy25.02')) {
			this.oldVCObserver = new VCObserver({
				...opts,
				ssrPlaceholderHandler: this.ssrPlaceholderHandler,
			});
		}
	}

	// Helper method to process SSR abort listeners
	private processSsrAbortListeners() {
		// Process any SSR abort listeners that remain
		if (window?.__SSR_ABORT_LISTENERS__) {
			// Clean up any event listeners that may have been registered during SSR
			// This is centralized here so only the wrapper handles unbinding, not individual observers
			if (
				window.__SSR_ABORT_LISTENERS__.unbinds &&
				Array.isArray(window.__SSR_ABORT_LISTENERS__.unbinds)
			) {
				window.__SSR_ABORT_LISTENERS__.unbinds.forEach((unbind) => {
					if (typeof unbind === 'function') {
						unbind();
					}
				});
			}

			// After all observers had a chance to process abort events,
			// we can safely delete the SSR_ABORT_LISTENERS object
			delete window.__SSR_ABORT_LISTENERS__;
		}
	}

	start({ startTime, experienceKey }: { startTime: number; experienceKey: string }): void {
		if (
			isVCRevisionEnabled('fy25.01', experienceKey) ||
			isVCRevisionEnabled('fy25.02', experienceKey)
		) {
			this.oldVCObserver?.start({ startTime });
		}

		this.newVCObserver?.start({ startTime });

		// Clean up any remaining SSR abort listeners after all observers have been started
		this.processSsrAbortListeners();
	}

	stop(experienceKey?: string): void {
		if (
			isVCRevisionEnabled('fy25.01', experienceKey) ||
			isVCRevisionEnabled('fy25.02', experienceKey)
		) {
			this.oldVCObserver?.stop();
		}

		this.newVCObserver?.stop();

		RLLPlaceholderHandlers.getInstance().reset();
		// Clear shared SSR placeholder handler
		this.ssrPlaceholderHandler.clear();
	}

	getVCRawData(): VCRawDataType | null {
		return this.oldVCObserver?.getVCRawData() ?? null;
	}

	async getVCResult(param: GetVCResultType): Promise<VCResult> {
		const {
			experienceKey,
			include3p,
			excludeSmartAnswersInSearch,
			includeSSRRatio,
			includeRawData,
		} = param;

		const v1v2Result =
			isVCRevisionEnabled('fy25.01', experienceKey) || isVCRevisionEnabled('fy25.02', experienceKey)
				? await this.oldVCObserver?.getVCResult(param)
				: {};

		const v3v4Result = await this.newVCObserver?.getVCResult({
			start: param.start,
			stop: param.stop,
			interactionId: param.interactionId,
			ssr: param.ssr,
			include3p,
			excludeSmartAnswersInSearch,
			includeSSRRatio,
			interactionType: param.interactionType,
			isPageVisible: param.isPageVisible,
			interactionAbortReason: param.interactionAbortReason,
			includeRawData,
			includeSSRInV3: param.includeSSRInV3,
			rawDataStopTime: param.rawDataStopTime,
			reportLayoutShiftOffenders: param.reportLayoutShiftOffenders,
		});

		if (!v3v4Result || v3v4Result.length === 0) {
			return v1v2Result ?? {};
		}

		const ssrRatio = v3v4Result?.[0]?.ssrRatio;

		return {
			...(includeSSRRatio && ssrRatio !== undefined ? { 'ufo:vc:ssrRatio': ssrRatio } : {}),
			...v1v2Result,
			'ufo:vc:rev': [
				...((v1v2Result?.['ufo:vc:rev'] as RevisionPayload | undefined) ?? []),
				...(v3v4Result ?? []),
			],
		};
	}
	setSSRElement(element: HTMLElement): void {
		this.oldVCObserver?.setSSRElement(element);
		this.newVCObserver?.setReactRootElement(element);
	}
	setReactRootRenderStart(startTime: number): void {
		this.oldVCObserver?.setReactRootRenderStart(startTime || performance.now());
		this.newVCObserver?.setReactRootRenderStart(startTime || performance.now());
	}
	setReactRootRenderStop(stopTime: number): void {
		this.oldVCObserver?.setReactRootRenderStop(stopTime || performance.now());
		this.newVCObserver?.setReactRootRenderStop(stopTime || performance.now());
	}
	collectSSRPlaceholders(): void {
		this.ssrPlaceholderHandler.collectExistingPlaceholders();
	}
}
