/**
 * Mutable state shared between `enableMockGlobalImage` and `MockImage`. Held on an object so the
 * flag can be written from one module and read from another.
 */
export const mockGlobalImageState: { isErrorInsteadOfLoad: boolean } = {
	isErrorInsteadOfLoad: false,
};
