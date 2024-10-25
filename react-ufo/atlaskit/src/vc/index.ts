import { VCObserver, type VCObserverOptions } from './vc-observer';

let instance: null | VCObserver = null;

export const getVCObserver = (opts: VCObserverOptions = {}): VCObserver => {
	if (instance === null) {
		instance = new VCObserver(opts);
	}
	return instance;
};
