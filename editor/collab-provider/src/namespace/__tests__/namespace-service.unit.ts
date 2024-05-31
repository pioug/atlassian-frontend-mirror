import { NamespaceService } from '../namespace-service';

describe('onNamespaceStatusChanged', () => {
	describe('when namespace is locked and we recieve isLocked true', () => {
		const isNamespaceLocked = true;
		const namespaceService = new NamespaceService(isNamespaceLocked);
		const data = {
			isLocked: true,
			waitTimeInMs: 1000,
			timestamp: 0,
		};

		it('should set isNamespaceLocked to true', async () => {
			await namespaceService.onNamespaceStatusChanged(data);
			expect(namespaceService.getIsNamespaceLocked()).toBe(true);
		});

		it('should set isNamespaceLocked to false after waitTimeInMs', async () => {
			await namespaceService.onNamespaceStatusChanged(data);
			expect(namespaceService.getIsNamespaceLocked()).toBe(true);
			await new Promise((resolve) => setTimeout(resolve, 1000));
			expect(namespaceService.getIsNamespaceLocked()).toBe(false);
		});
	});

	describe('when namespace is locked and we recieve isLocked false', () => {
		const isNamespaceLocked = true;
		const namespaceService = new NamespaceService(isNamespaceLocked);
		const data = {
			isLocked: false,
			waitTimeInMs: 1000,
			timestamp: 0,
		};

		it('should set isNamespaceLocked to false', async () => {
			await namespaceService.onNamespaceStatusChanged(data);
			expect(namespaceService.getIsNamespaceLocked()).toBe(false);
		});
	});

	describe('when namespace is not locked and we recieve isLocked false', () => {
		const isNamespaceLocked = false;
		const namespaceService = new NamespaceService(isNamespaceLocked);
		const data = {
			isLocked: false,
			waitTimeInMs: 1000,
			timestamp: 0,
		};

		it('should set isNamespaceLocked to false', async () => {
			await namespaceService.onNamespaceStatusChanged(data);
			expect(namespaceService.getIsNamespaceLocked()).toBe(false);
		});
	});

	describe('when namespace is not locked and we recieve isLocked true', () => {
		const isNamespaceLocked = false;
		const namespaceService = new NamespaceService(isNamespaceLocked);
		const data = {
			isLocked: true,
			waitTimeInMs: 1000,
			timestamp: 0,
		};

		it('should set isNamespaceLocked to true', async () => {
			await namespaceService.onNamespaceStatusChanged(data);
			expect(namespaceService.getIsNamespaceLocked()).toBe(true);
		});
	});
});
