import type { RevisionPayload, VCRawDataType, VCResult } from '../common/vc/types';
import { isVCRevisionEnabled } from '../config';

import { VCObserverNOOP } from './no-op-vc-observer';
import type { GetVCResultType, VCObserverInterface, VCObserverOptions } from './types';
import { VCObserver } from './vc-observer';
import VCObserverNew from './vc-observer-new';
import { RLLPlaceholderHandlers } from './vc-observer/observers/rll-placeholders';
import { SSRPlaceholderHandlers } from './vc-observer/observers/ssr-placeholders';

export type { VCRevisionDebugDetails } from './vc-observer/getVCRevisionDebugDetails';

declare global {
	var __vcObserver: VCObserverInterface;
}

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

		if (isVCRevisionEnabled('fy25.03') || isVCRevisionEnabled('next')) {
			this.newVCObserver = new VCObserverNew({
				selectorConfig: opts.selectorConfig,
				isPostInteraction: opts.isPostInteraction,
				SSRConfig: {
					enablePageLayoutPlaceholder: opts.ssrEnablePageLayoutPlaceholder ?? false,
				},
				ssrPlaceholderHandler: this.ssrPlaceholderHandler,
			});
		}

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

		if (isVCRevisionEnabled('fy25.03', experienceKey)) {
			this.newVCObserver?.start({ startTime });
		}

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

		if (isVCRevisionEnabled('fy25.03', experienceKey)) {
			this.newVCObserver?.stop();
		}

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

		const v3v4Result = isVCRevisionEnabled('fy25.03', experienceKey)
			? await this.newVCObserver?.getVCResult({
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
				})
			: [];

		if (!v3v4Result) {
			return v1v2Result ?? {};
		}

		const ssrRatio = v3v4Result[0].ssrRatio;

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

// Some products set this variable to indicate it is running in SSR
let isServer = Boolean((globalThis as any)?.__SERVER__);
// Other products set this other variable to indicate it is running in SSR
let isReactSSR = typeof process !== 'undefined' && Boolean(process?.env?.REACT_SSR || false);

export function isEnvironmentSupported() {
	// SSR environment aren't supported
	if (isReactSSR || isServer) {
		return false;
	}

	// Legacy browsers that doesn't support WeakRef
	// aren't valid
	if (typeof globalThis?.WeakRef !== 'function') {
		return false;
	}

	if (
		typeof globalThis?.MutationObserver !== 'function' ||
		typeof globalThis?.IntersectionObserver !== 'function' ||
		typeof globalThis?.PerformanceObserver !== 'function'
	) {
		return false;
	}

	return true;
}

export function getVCObserver(opts: VCObserverOptions = {}): VCObserverInterface {
	if (!globalThis.__vcObserver) {
		const shouldMockVCObserver = !isEnvironmentSupported();
		globalThis.__vcObserver = shouldMockVCObserver
			? new VCObserverNOOP()
			: new VCObserverWrapper(opts);
	}
	return globalThis.__vcObserver;
}

export function newVCObserver(opts: VCObserverOptions = {}): VCObserverInterface {
	const shouldMockVCObserver = !isEnvironmentSupported();
	const observer = shouldMockVCObserver ? new VCObserverNOOP() : new VCObserverWrapper(opts);
	return observer;
}
