import { fg } from '@atlaskit/platform-feature-flags';

import type { MultiHeatmapPayload, VCRawDataType, VCResult } from '../common/vc/types';
import { getConfig } from '../config';

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
		this.oldVCObserver = new VCObserver(opts);

		this.newVCObserver = null;
		const isNewVCObserverEnabled =
			fg('platform_ufo_vc_observer_new') || getConfig()?.vc?.enableVCObserverNew;
		if (isNewVCObserverEnabled) {
			this.newVCObserver = new VCObserverNew({
				selectorConfig: opts.selectorConfig,
			});
		}
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
				...((oldResult?.['ufo:vc:rev'] as MultiHeatmapPayload | undefined) ?? []),
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

export const getVCObserver = (opts: VCObserverOptions = {}): VCObserverInterface => {
	if (!globalThis.__vcObserver) {
		globalThis.__vcObserver = new VCObserverWrapper(opts);
	}
	return globalThis.__vcObserver;
};
