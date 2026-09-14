import { PollingError } from './PollingError';

export function isPollingError(err?: Error): err is PollingError {
	return err instanceof PollingError;
}
