import { plot } from './plot';

export const valueY = (value: number): number =>
	plot.bottom - (value / 100) * (plot.bottom - plot.top);
