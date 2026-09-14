import type { createMediaDurationMetrics } from './createMediaDurationMetrics';

export type MediaDurationMetrics = ReturnType<typeof createMediaDurationMetrics>;

export type UfoDurationMetrics = Record<string, { start: number; end?: number; size?: number }>;
