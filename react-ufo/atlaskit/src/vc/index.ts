import { VCObserver, type VCObserverOptions } from './vc-observer';

declare global {
	var __vcObserver: VCObserver;
}

export const getVCObserver = (opts: VCObserverOptions = {}): VCObserver => {
	if (!globalThis.__vcObserver) {
		globalThis.__vcObserver = new VCObserver(opts);
	}
	return globalThis.__vcObserver;
};
