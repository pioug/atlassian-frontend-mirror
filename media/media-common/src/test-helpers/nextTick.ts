export const nextTick = () => Promise.resolve();
export const sleep = (time: number = 0) =>
  new Promise((resolve) => window.setTimeout(resolve, time));
