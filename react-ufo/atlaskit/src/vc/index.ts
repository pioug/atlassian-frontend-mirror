import { fg } from '@atlaskit/platform-feature-flags';

import type { RevisionPayload, VCRawDataType, VCResult } from '../common/vc/types';
import { getConfig } from '../config';
import { markProfilingEnd, markProfilingStart, withProfiling } from '../self-measurements';

import { VCObserverNOOP } from './no-op-vc-observer';
import type { GetVCResultType, VCObserverInterface, VCObserverOptions } from './types';
import { VCObserver } from './vc-observer';
import VCObserverNew from './vc-observer-new';

declare global {
	var __vcObserver: VCObserverInterface;
}

class VCObserverWrapper implements VCObserverInterface {
	private oldVCObserver: VCObserver | null;
	private newVCObserver: VCObserverNew | null;

	constructor(opts: VCObserverOptions = {}) {
		const operationTimer = markProfilingStart('VCObserverWrapper constructor');
		this.newVCObserver = null;

		const isNewVCObserverEnabled =
			fg('platform_ufo_vc_observer_new') || getConfig()?.vc?.enableVCObserverNew;
		if (isNewVCObserverEnabled) {
			this.newVCObserver = new VCObserverNew({
				selectorConfig: opts.selectorConfig,
			});
		}

		this.oldVCObserver = new VCObserver(opts);

		this.start = withProfiling(this.start.bind(this), ['vc']);
		this.stop = withProfiling(this.stop.bind(this), ['vc']);
		this.getVCRawData = withProfiling(this.getVCRawData.bind(this), ['vc']);
		this.getVCResult = withProfiling(this.getVCResult.bind(this), ['vc']);
		this.setSSRElement = withProfiling(this.setSSRElement.bind(this), ['vc']);
		this.setReactRootRenderStart = withProfiling(this.setReactRootRenderStart.bind(this), ['vc']);
		this.setReactRootRenderStop = withProfiling(this.setReactRootRenderStop.bind(this), ['vc']);
		markProfilingEnd(operationTimer, { tags: ['vc'] });
	}
	start(startArg: { startTime: number }): void {
		this.oldVCObserver?.start(startArg);
		this.newVCObserver?.start({ startTime: startArg.startTime });
	}
	stop(): void {
		this.oldVCObserver?.stop();
		this.newVCObserver?.stop();
	}
	getVCRawData(): VCRawDataType | null {
		return this.oldVCObserver?.getVCRawData() ?? null;
	}
	async getVCResult(param: GetVCResultType): Promise<VCResult> {
		const oldResult = await this.oldVCObserver?.getVCResult(param);
		const newResult = await this.newVCObserver?.getVCResult({
			start: param.start,
			stop: fg('platform_ufo_vc_ttai_on_paint') ? param.stop : performance.now(),
		});

		if (oldResult && !newResult) {
			return oldResult;
		}

		return {
			...(oldResult ?? {}),
			'ufo:vc:rev': [
				...((oldResult?.['ufo:vc:rev'] as RevisionPayload | undefined) ?? []),
				...(newResult ?? []),
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

export const isEnvironmentSupported = withProfiling(
	function isEnvironmentSupported() {
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
	},
	['vc'],
);

export const getVCObserver = withProfiling(
	function getVCObserver(opts: VCObserverOptions = {}): VCObserverInterface {
		if (!globalThis.__vcObserver) {
			const shouldMockVCObserver = !isEnvironmentSupported();
			globalThis.__vcObserver = shouldMockVCObserver
				? new VCObserverNOOP()
				: new VCObserverWrapper(opts);
		}
		return globalThis.__vcObserver;
	},
	['vc'],
);
