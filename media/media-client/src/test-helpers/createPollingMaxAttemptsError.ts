import { PollingError } from '../utils/polling';

export const createPollingMaxAttemptsError = (attempts = 1): PollingError =>
	new PollingError('pollingMaxAttemptsExceeded', { attempts });
