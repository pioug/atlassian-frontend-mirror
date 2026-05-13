export const isMatchMediaAvailable = (): boolean =>
	typeof window !== 'undefined' && 'matchMedia' in window;
