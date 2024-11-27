import { Provider } from '../..';
import { type NamespaceStatus } from '../../types';

describe('DocumentService onNamespaceStatusChanged', () => {
	let provider: any;

	beforeEach(() => {
		const testConfig: any = {
			url: 'localhost',
			documentAri: 'ari:cloud:confluence:ABC:page/test',
		};
		provider = new Provider(testConfig);
		provider.documentService.clientId = '123456';
	});

	afterEach(() => jest.clearAllMocks());

	describe('Lock/Unlock namespace', () => {
		it('Should lock and auto unlock namespace after waiting time', async () => {
			expect(provider.documentService.getIsNamespaceLocked()).toBe(false);

			// Simulate a status event to lock the namespace
			const lockEvent: NamespaceStatus = {
				isLocked: true,
				waitTimeInMs: 1000,
				timestamp: Date.now(),
			};

			await provider.namespaceService.onNamespaceStatusChanged(lockEvent);

			expect(provider.documentService.getIsNamespaceLocked()).toBe(true);

			// Wait for the lock to expire
			await new Promise((resolve) => setTimeout(resolve, 1000));

			expect(provider.documentService.getIsNamespaceLocked()).toBe(false);
		});

		it('Should lock and unlock namespace when emit status event', async () => {
			expect(provider.documentService.getIsNamespaceLocked()).toBe(false);

			// Simulate a status event to lock the namespace
			const lockEvent: NamespaceStatus = {
				isLocked: true,
				waitTimeInMs: 1000,
				timestamp: Date.now(),
			};

			await provider.namespaceService.onNamespaceStatusChanged(lockEvent);

			expect(provider.documentService.getIsNamespaceLocked()).toBe(true);

			// Simulate a status event to unlock the namespace immediately
			const unlockEvent: NamespaceStatus = {
				isLocked: false,
				waitTimeInMs: 0,
				timestamp: Date.now(),
			};

			await provider.namespaceService.onNamespaceStatusChanged(unlockEvent);

			expect(provider.documentService.getIsNamespaceLocked()).toBe(false);
		});
	});
});
