export const flushPromises = () =>
  new Promise((resolve) => setImmediate(resolve));

export const flushAsyncOperations = async (
  count: number,
  intervalMS: number[],
) => {
  const setTimeoutIntervals = [...intervalMS];
  for (let i = 0; i < count; i++) {
    const nextTimeout = setTimeoutIntervals.shift();
    if (nextTimeout !== undefined && nextTimeout > 0) {
      jest.advanceTimersByTime(nextTimeout);
    }
    await flushPromises();
  }
};
