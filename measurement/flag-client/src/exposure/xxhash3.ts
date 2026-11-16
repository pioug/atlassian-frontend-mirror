import type { createXXHash3 as CreateXXHash3 } from 'hash-wasm';
// Node bundlers select the root CommonJS entry, which includes every hashing algorithm.
// @ts-ignore TS7016: hash-wasm ships declarations only for its root entry.
import { createXXHash3 as createXXHash3Bundle } from 'hash-wasm/dist/xxhash3.umd.min';

export const createXXHash3: typeof CreateXXHash3 = createXXHash3Bundle;
