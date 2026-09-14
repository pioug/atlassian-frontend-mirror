import type { MockConfig } from './mock-config-2';

export const mockCatchAll: any = ({ fetchMock }: MockConfig) => {
	fetchMock.mock('*', (path: string) => {
		// eslint-disable-next-line no-console
		console.error(`Unmatched request: ${path}`);
	});
};
