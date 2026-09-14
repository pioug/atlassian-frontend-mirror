/**
 * Iframe event shaping helpers
 *
 * These functions normalise raw Forge bridge event data into compact, consistent
 * shapes before storing in segment3pTimings, reducing payload size and aligning
 * with the equivalent host-page metrics where applicable.
 *
 * Each function receives the full raw event object (minus `type`) and returns
 * only the fields worth retaining in the analytics payload.
 */
export const num = (v: unknown): number => (typeof v === 'number' ? Math.round(v) : 0);
