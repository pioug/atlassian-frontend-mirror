import { startLTObserver } from './utils/observer/start-lt-observer';
import { startLSObserver } from './utils/observer/start-ls-observer';

export function startLighthouseObserver(): void {
	startLSObserver();
	startLTObserver();
}
