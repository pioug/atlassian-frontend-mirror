/**
 * Max time we allow for a page to become idle after render.
 */
export const THRESHOLD = 5000;
export const THRESHOLD_INITIAL = 6500;
/**
 * We run N batches of idle checks with M runs in each (a render & idle check).
 */
export const NUMBER_OF_BATCHES = 3;
export const NUMBER_OF_RUNS = 6;
