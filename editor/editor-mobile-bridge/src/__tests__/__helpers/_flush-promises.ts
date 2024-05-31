// For jest 27+, use process.nextTick
// await new Promise(process.nextTick);
export const flushPromises = () => new Promise((resolve) => setImmediate(resolve));
