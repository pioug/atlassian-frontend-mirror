/** deprecated Use React Testing Library's waitFor like method instead */
// eslint-disable-next-line @atlaskit/platform/no-set-immediate
export const flushPromises = () => new Promise((resolve) => setImmediate(resolve));
