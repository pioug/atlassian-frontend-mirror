export const waitFor = (time = 1): Promise<void> => new Promise((res) => setTimeout(res, time));
