import * as Sentry from '../sentry';
import { BaseClient, type ClientConfig, type LogExceptionFN } from './index';

const mockLogException: LogExceptionFN = jest.fn();

const clientConfig: ClientConfig = {
	logException: mockLogException,
};

jest.mock('../sentry/addBreadcrumb');
jest.mock('../sentry/createErrorHandler');
jest.mock('../sentry/createErrorHandlerWithPackageContext');
jest.mock('../sentry/logErrorMessage');
jest.mock('../sentry/logErrorMessageWithPackageContext');
jest.mock('../sentry/logException');
jest.mock('../sentry/logExceptionWithPackageContext');
jest.mock('../sentry/logInfoMessage');
jest.mock('../sentry/logInfoMessageWithPackageContext');
jest.mock('../sentry/utils/use-teams-sentry-client-setup');

describe('BaseClient', () => {
	let client: BaseClient;

	beforeEach(() => {
		jest.clearAllMocks();
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

	describe('cloudId default handling', () => {
		it('initialises with empty string', () => {
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
