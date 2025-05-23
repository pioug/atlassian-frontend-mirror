import type { RevisionPayload, VCRawDataType, VCResult } from '../common/vc/types';
import { isVCRevisionEnabled } from '../config';

import { VCObserverNOOP } from './no-op-vc-observer';
import type { GetVCResultType, VCObserverInterface, VCObserverOptions } from './types';
import { VCObserver } from './vc-observer';
import VCObserverNew from './vc-observer-new';

declare global {
	var __vcObserver: VCObserverInterface;
}

export class VCObserverWrapper implements VCObserverInterface {
	private oldVCObserver: VCObserver | null;
	private newVCObserver: VCObserverNew | null;

	constructor(opts: VCObserverOptions = {}) {
		this.newVCObserver = null;

		this.oldVCObserver = null;

		if (isVCRevisionEnabled('fy25.03')) {
			this.newVCObserver = new VCObserverNew({
				selectorConfig: opts.selectorConfig,
			});
		}

		if (isVCRevisionEnabled('fy25.01') || isVCRevisionEnabled('fy25.02')) {
			this.oldVCObserver = new VCObserver(opts);
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
	}

	getVCRawData(): VCRawDataType | null {
		return this.oldVCObserver?.getVCRawData() ?? null;
	}

	async getVCResult(param: GetVCResultType): Promise<VCResult> {
		const { experienceKey } = param;

		const v1v2Result =
			isVCRevisionEnabled('fy25.01', experienceKey) || isVCRevisionEnabled('fy25.02', experienceKey)
				? await this.oldVCObserver?.getVCResult(param)
				: {};
		const v3Result = isVCRevisionEnabled('fy25.03', experienceKey)
			? await this.newVCObserver?.getVCResult({
					start: param.start,
					stop: param.stop,
				})
			: [];

		if (!v3Result) {
			return v1v2Result ?? {};
		}

		return {
			...v1v2Result,
			'ufo:vc:rev': [
				...((v1v2Result?.['ufo:vc:rev'] as RevisionPayload | undefined) ?? []),
				...(v3Result ?? []),
			],
		};
	}
	setSSRElement(element: HTMLElement): void {
		this.oldVCObserver?.setSSRElement(element);
	}
	setReactRootRenderStart(startTime: number): void {
		this.oldVCObserver?.setReactRootRenderStart(startTime || performance.now());
	}
	setReactRootRenderStop(stopTime: number): void {
		this.oldVCObserver?.setReactRootRenderStop(stopTime || performance.now());
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
