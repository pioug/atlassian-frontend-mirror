import { fg } from '@atlaskit/platform-feature-flags';

import * as Sentry from '../sentry';

import { BaseClient, type ClientConfig, type LogExceptionFN } from './index';

const mockLogException: LogExceptionFN = jest.fn();

const clientConfig: ClientConfig = {
	logException: mockLogException,
};

jest.mock('../sentry');
jest.mock('@atlaskit/platform-feature-flags', () => ({
	fg: jest.fn(),
}));

describe('BaseClient', () => {
	let client: BaseClient;

	beforeEach(() => {
		jest.clearAllMocks();
		(fg as jest.Mock).mockReturnValue(false);
		client = new BaseClient(clientConfig);
	});

	it('sets and gets context', () => {
		const context = { cloudId: 'cloud-1', orgId: 'org-1' };
		client.setContext(context);
		expect(client.getContext()).toEqual(context);
	});

	it('throws an error when trying to get orgId without setting context', () => {
		expect(() => client.getOrgId()).toThrow('No orgId set');
	});

	it('logs an error when trying to get orgId without setting context', () => {
		const spy = jest.spyOn(Sentry, 'logException');
		expect(() => client.getOrgId()).toThrow('No orgId set');
		expect(spy).toHaveBeenCalled();
	});

	it('retrieves orgId when context is set', () => {
		const context = { cloudId: 'cloud-1', orgId: 'org-1' };
		client.setContext(context);
		expect(client.getOrgId()).toEqual('org-1');
	});

	it('retrieves cloudId when context is set', () => {
		const context = { cloudId: 'cloud-1', orgId: 'org-1' };
		client.setContext(context);
		expect(client.getCloudId()).toEqual('cloud-1');
	});

	describe('flag off (legacy behaviour)', () => {
		it('initialises with "None" sentinel', () => {
			expect(client.getCloudId()).toEqual('None');
		});

		it('falls back to "None" when cloudId is null', () => {
			client.setContext({ cloudId: null });
			expect(client.getCloudId()).toEqual('None');
		});

		it('falls back to "None" when cloudId is undefined', () => {
			client.setContext({ cloudId: undefined });
			expect(client.getCloudId()).toEqual('None');
		});

		it('falls back to "None" when cloudId is empty string', () => {
			client.setContext({ cloudId: '' });
			expect(client.getCloudId()).toEqual('None');
		});
	});

	describe('flag on (fixed behaviour)', () => {
		beforeEach(() => {
			(fg as jest.Mock).mockReturnValue(true);
			client = new BaseClient(clientConfig);
		});

		it('initialises with empty string instead of "None"', () => {
			expect(client.getCloudId()).toEqual('');
		});

		it('stores empty string when cloudId is null', () => {
			client.setContext({ cloudId: null });
			expect(client.getCloudId()).toEqual('');
		});

		it('stores empty string when cloudId is undefined', () => {
			client.setContext({ cloudId: undefined });
			expect(client.getCloudId()).toEqual('');
		});

		it('stores empty string when cloudId is empty string', () => {
			client.setContext({ cloudId: '' });
			expect(client.getCloudId()).toEqual('');
		});
	});

	it('logs exception', () => {
		const error = new Error('Test error');
		client.logException(error, 'Test name');
		expect(mockLogException).toHaveBeenCalledWith(error, 'Test name', undefined);
	});
});
