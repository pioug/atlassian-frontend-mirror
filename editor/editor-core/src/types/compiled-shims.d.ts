// Shim declaration for cssMapScoped — an experimental non-public API in @compiled/react.
// cssMapScoped works like cssMap but groups all declarations for a variant under a single
// non-atomic class (cc-<hash>), avoiding thousands of atomic classes on the DOM.
// This shim gives us type safety without @compiled/react publicly exporting cssMapScoped.
import type { cssMap } from '@compiled/react';

declare module '@compiled/react' {
	export const cssMapScoped: typeof cssMap;
}
