import { isEnvironmentSupported } from './isEnvironmentSupported';
import { VCObserverNOOP } from './no-op-vc-observer';
import type { VCObserverInterface, VCObserverOptions } from './types';
import { VCObserverWrapper } from './VCObserverWrapper';

declare global {
	var __vcObserver: VCObserverInterface;
}

// eslint-disable-next-line @atlaskit/volt-strict-mode/no-multiple-exports
export function getVCObserver(opts: VCObserverOptions = {}): VCObserverInterface {
	if (!globalThis.__vcObserver) {
		const shouldMockVCObserver = !isEnvironmentSupported();
		globalThis.__vcObserver = shouldMockVCObserver
			? new VCObserverNOOP()
			: new VCObserverWrapper(opts);
	}
	return globalThis.__vcObserver;
}
