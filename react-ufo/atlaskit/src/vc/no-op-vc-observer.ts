import type { VCResult } from '../common/vc/types';

import type { GetVCResultType, VCObserverInterface } from './types';

// This class should be used on scenarios where VC can not be calculate
// such as: SSR environment and legacy browsers
export class VCObserverNOOP implements VCObserverInterface {
	start(_: { startTime: number }): void {}

	stop(): void {}
	getVCRawData(): null {
		return null;
	}
	getVCResult(_: GetVCResultType): Promise<VCResult> {
		return Promise.resolve({
			'ufo:vc:noop': true,
		});
	}
	setSSRElement(_: HTMLElement): void {}
	setReactRootRenderStart(_: number): void {}
	setReactRootRenderStop(_: number): void {}
}
