export const nextTick = (): Promise<void> => Promise.resolve();
export const sleep = (time: number = 0): Promise<void> =>
	new Promise((resolve) => window.setTimeout(resolve, time));
