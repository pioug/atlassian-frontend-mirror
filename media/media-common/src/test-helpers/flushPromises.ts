/** deprecated Use React Testing Library's waitFor like method instead */
// eslint-disable-next-line @atlaskit/platform/no-set-immediate
export const flushPromises = (): Promise<unknown> =>
	// eslint-disable-next-line @atlaskit/platform/no-set-immediate
	new Promise((resolve) => setImmediate(resolve));
