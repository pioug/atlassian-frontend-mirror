import { AGGErrors } from '../util/AGGErrors';

export const handleAGGErrors = (errors: unknown, traceId: string | null): void => {
	throw new AGGErrors(errors, traceId);
};
