// eslint-disable-next-line @atlaskit/platform/no-set-immediate
export const flushPromises = (): Promise<void> => new Promise((resolve) => setImmediate(resolve));
