/** deprecated Use React Testing Library's waitFor like method instead */
export const flushPromises = () => new Promise((resolve) => setImmediate(resolve));
