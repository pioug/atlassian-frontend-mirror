import { isEnvironmentSupported } from './isEnvironmentSupported';
import { VCObserverNOOP } from './no-op-vc-observer';
import type { VCObserverInterface, VCObserverOptions } from './types';
import { VCObserverWrapper } from './VCObserverWrapper';

// eslint-disable-next-line @atlaskit/volt-strict-mode/no-multiple-exports
export function newVCObserver(opts: VCObserverOptions = {}): VCObserverInterface {
	const shouldMockVCObserver = !isEnvironmentSupported();
	const observer = shouldMockVCObserver ? new VCObserverNOOP() : new VCObserverWrapper(opts);
	return observer;
}
