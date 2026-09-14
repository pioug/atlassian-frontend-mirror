/**
 * Soft budget (KB): when the flat array exceeds this, begin dropping entries by TRIM_ORDER.
 * Chosen as roughly 3× the P75 of segment3pTimings observed in production (~30 KB).
 */
export const SEGMENT_3P_SOFT_BUDGET_KB = 60;
