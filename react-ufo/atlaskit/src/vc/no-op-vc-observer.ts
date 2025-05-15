import type { VCResult } from '../common/vc/types';

import type { GetVCResultType, VCObserverInterface } from './types';

// This class should be used on scenarios where VC can not be calculate
// such as: SSR environment and legacy browsers
export class VCObserverNOOP implements VCObserverInterface {
	start(startArg: { startTime: number }): void {}

	stop(): void {}
	getVCRawData(): null {
		return null;
	}
	getVCResult(param: GetVCResultType): Promise<VCResult> {
		return Promise.resolve({
			'ufo:vc:noop': true,
		});
	}
	setSSRElement(element: HTMLElement): void {}
	setReactRootRenderStart(startTime: number): void {}
	setReactRootRenderStop(stopTime: number): void {}
}
