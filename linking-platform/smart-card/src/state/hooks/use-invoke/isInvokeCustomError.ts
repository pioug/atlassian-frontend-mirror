import type { InvokeError } from '@atlaskit/linking-types/smart-link-actions';

export const isInvokeCustomError = (err: InvokeError | Error): err is InvokeError =>
	(err as InvokeError)?.message !== undefined && (err as InvokeError)?.errorCode !== undefined;
