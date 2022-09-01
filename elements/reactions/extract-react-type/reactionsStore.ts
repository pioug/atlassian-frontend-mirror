import type { Store } from '../src/types';

/**
 * The props definition in src/types/store.ts breaks ERT unfortunately, hence this hack (for the custom component props).
 */
export default function (_: Store) {}
