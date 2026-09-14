import { createContextKey } from '@opentelemetry/api';

export const traceIdKey: any = createContextKey('traceId');
