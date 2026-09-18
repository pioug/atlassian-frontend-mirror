import { startLSObserver } from './utils/observer/start-ls-observer';
import { startLTObserver } from './utils/observer/start-lt-observer';

export function startLighthouseObserver(): void {
	startLSObserver();
	startLTObserver();
}
