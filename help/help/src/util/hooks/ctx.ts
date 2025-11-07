import { createContext, useContext, type Provider } from 'react';

export function createCtx<ContextType>(): readonly [
	() => NonNullable<ContextType>,
	Provider<ContextType | undefined>,
] {
	const ctx = createContext<ContextType | undefined>(undefined);
	function useCtx() {
		const c = useContext(ctx);
		if (!c) {
			throw new Error('useCtx must be inside a Provider with a value');
		}
		return c;
	}
	return [useCtx, ctx.Provider] as const;
}
