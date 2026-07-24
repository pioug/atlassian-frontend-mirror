import { type SurfaceColor, surfaceColorMap } from './surface-color';

export const isSurfaceColorToken = (color: unknown): color is SurfaceColor =>
	surfaceColorMap[color as SurfaceColor] !== undefined;
