import { Provider } from '../..';

describe('DocumentService onRestore', () => {
	let dummyPayload: any;
	let provider: any;
	let getUnconfirmedStepsSpy: any;
	let fetchReconcileSpy: any;
	let getCurrentStateSpy: any;
	let sendActionEventSpy: any;
	let sendErrorEventSpy: any;
	let onErrorHandledSpy: any;
	let applyLocalStepsSpy: any;
	let sendProviderErrorEventSpy: any;

	beforeEach(() => {
		dummyPayload = {
			doc: {
				data: 'someData',
			},
			version: 1,
			metadata: {
				title: 'Hello bello',
			},
		};
		const testConfig: any = {
			url: 'localhost',
			documentAri: 'ari:coud:confluence:ABC:page/test',
		};
		provider = new Provider(testConfig);
		provider.documentService.clientId = '123456';
		const pds = provider.documentService;
		getUnconfirmedStepsSpy = jest.spyOn(pds, 'getUnconfirmedSteps');
		fetchReconcileSpy = jest.spyOn(pds, 'fetchReconcile');
		getCurrentStateSpy = jest.spyOn(pds, 'getCurrentState');
		onErrorHandledSpy = jest.spyOn(pds, 'onErrorHandled');
		applyLocalStepsSpy = jest.spyOn(provider.documentService, 'applyLocalSteps');
		sendActionEventSpy = jest.spyOn(pds.analyticsHelper, 'sendActionEvent');
		sendErrorEventSpy = jest.spyOn(pds.analyticsHelper, 'sendErrorEvent');
		sendProviderErrorEventSpy = jest.spyOn(pds.analyticsHelper, 'sendProviderErrorEvent');
	});

	afterEach(() => jest.clearAllMocks());

	describe('reinitialise the document', () => {
		it('sends correct initial metadata and reserveCursor to provider', async () => {
			expect.assertions(4);
			getUnconfirmedStepsSpy.mockReturnValue([]);
			getCurrentStateSpy.mockReturnValue({ content: 'something' });
			const updateDoc = jest.spyOn(provider.documentService, 'updateDocument');
			provider.on('init', (data: any) => {
				expect(data).toEqual({
					...dummyPayload,
					reserveCursor: true,
				});
			});
			provider.on('metadata:changed', (data: any) => {
				expect(data).toEqual(dummyPayload.metadata);
			});
			await provider.documentService.onRestore(dummyPayload);
			expect(updateDoc).toBeCalledTimes(1);
			expect(updateDoc).toBeCalledWith({
				...dummyPayload,
				reserveCursor: true,
			});
		});

		describe('without unconfirmed steps', () => {
			beforeEach(async () => {
				getUnconfirmedStepsSpy.mockReturnValue([]);
				getCurrentStateSpy.mockReturnValue(undefined);
				await provider.documentService.onRestore(dummyPayload);
			});

			it('fires analytics with correct unconfirmedSteps length', () => {
				expect(sendActionEventSpy).toBeCalledTimes(1);
				expect(sendActionEventSpy).toBeCalledWith('reinitialiseDocument', 'SUCCESS', {
					hasTitle: true,
					numUnconfirmedSteps: 0,
					useReconcile: false,
					clientId: '123456',
					triggeredByCatchup: false,
				});
			});

			it('doesnot call applyLocalSteps if there are not steps to apply', () => {
				// @ts-ignore assessing private function for test
				expect(applyLocalStepsSpy).not.toBeCalled();
			});
		});

		describe('with unconfirmed steps and no state', () => {
			beforeEach(() => {
				getUnconfirmedStepsSpy.mockReturnValue(['test', 'test']);
				getCurrentStateSpy.mockReturnValue(undefined);
			});

			it('fires analytics with correct unconfirmedSteps length', async () => {
				await provider.documentService.onRestore(dummyPayload);
				expect(sendActionEventSpy).toBeCalledTimes(1);
				expect(sendActionEventSpy).toBeCalledWith('reinitialiseDocument', 'SUCCESS', {
					hasTitle: true,
					numUnconfirmedSteps: 2,
					useReconcile: false,
					clientId: '123456',
					triggeredByCatchup: false,
				});
			});

			it('calls applyLocalSteps with steps to apply', async () => {
				provider.on('local-steps', ({ steps }: any) => {
					expect(steps).toEqual(['test', 'test']);
				});
				await provider.documentService.onRestore(dummyPayload);
				expect(applyLocalStepsSpy).toBeCalledTimes(1);
				expect(applyLocalStepsSpy).toBeCalledWith(['test', 'test']);
			});

			describe('when reconcile on recovery', () => {
				beforeEach(() => {
					getCurrentStateSpy.mockReturnValue({ content: 'something' });
					fetchReconcileSpy.mockReturnValue('thing');
				});

				it('doesnt call applyLocalSteps', async () => {
					await provider.documentService.onRestore(dummyPayload);
					expect(applyLocalStepsSpy).toBeCalledTimes(0);
				});

				it('calls reconcile', async () => {
					await provider.documentService.onRestore(dummyPayload);
					expect(getCurrentStateSpy).toBeCalledTimes(1);
					expect(fetchReconcileSpy).toBeCalledTimes(1);
				});

				it('fires analytics with correct unconfirmedSteps length', async () => {
					await provider.documentService.onRestore(dummyPayload);
					expect(sendActionEventSpy).toBeCalledTimes(1);
					expect(sendActionEventSpy).toBeCalledWith('reinitialiseDocument', 'SUCCESS', {
						hasTitle: true,
						numUnconfirmedSteps: 2,
						useReconcile: true,
						clientId: '123456',
						triggeredByCatchup: false,
					});
				});
			});
		});
	});

	describe('Catch and relay correct errors', () => {
		const testError = new Error('testing');
		beforeEach(() => {
			getUnconfirmedStepsSpy.mockReturnValue(['test', 'test']);
			getCurrentStateSpy.mockReturnValue(undefined);
			fetchReconcileSpy.mockReturnValue({});
		});

		it('when updateDocument throws', async () => {
			jest.spyOn(provider.documentService, 'updateDocument').mockImplementation(() => {
				throw testError;
			});
			provider.on('error', (err: any) => {
				try {
					expect(err).toEqual({
						recoverable: false,
						code: 'DOCUMENT_RESTORE_ERROR',
						message: 'Collab service unable to restore document',
						status: 500,
					});
				} catch (e) {}
			});
			await provider.documentService.onRestore(dummyPayload);
			expect(sendActionEventSpy).toBeCalledTimes(1);
			expect(sendActionEventSpy).toBeCalledWith('reinitialiseDocument', 'FAILURE', {
				numUnconfirmedSteps: 2,
				useReconcile: false,
				clientId: '123456',
				triggeredByCatchup: false,
			});
			expect(sendErrorEventSpy).toBeCalledTimes(2);
			expect(sendErrorEventSpy).toHaveBeenNthCalledWith(
				1,
				testError,
				'Error while reinitialising document. Use Reconcile: false',
			);
			expect(sendProviderErrorEventSpy).toBeCalledTimes(1);
			expect(onErrorHandledSpy).toBeCalledTimes(1);
			expect(onErrorHandledSpy).toHaveBeenNthCalledWith(1, {
				message: 'Caught error while trying to recover the document',
				data: {
					status: 500,
					code: 'DOCUMENT_RESTORE_ERROR',
				},
			});
			expect.assertions(8);
		});

		it('when applyLocalSteps throws', async () => {
			jest.spyOn(provider.documentService, 'applyLocalSteps').mockImplementation(() => {
				throw new Error('testing');
			});
			jest.spyOn(provider.documentService, 'updateDocument').mockImplementation(() => {
				// Mockout updateDocument to exclude its own metrics that it can emit
			});
			provider.on('error', (err: any) => {
				expect(err).toEqual({
					recoverable: false,
					code: 'DOCUMENT_RESTORE_ERROR',
					message: 'Collab service unable to restore document',
					status: 500,
				});
			});
			await provider.documentService.onRestore(dummyPayload);

			expect(sendActionEventSpy).toBeCalledTimes(1);
			expect(sendActionEventSpy).toBeCalledWith('reinitialiseDocument', 'FAILURE', {
				numUnconfirmedSteps: 2,
				useReconcile: false,
				clientId: '123456',
				triggeredByCatchup: false,
			});
			expect(sendErrorEventSpy).toBeCalledTimes(2);
			expect(sendProviderErrorEventSpy).toBeCalledTimes(1);
			expect(sendErrorEventSpy).toHaveBeenNthCalledWith(
				1,
				testError,
				'Error while reinitialising document. Use Reconcile: false',
			);
			expect(sendErrorEventSpy).toHaveBeenNthCalledWith(
				2,
				{
					data: { code: 'DOCUMENT_RESTORE_ERROR', status: 500 },
					message: 'Caught error while trying to recover the document',
				},
				'Error handled',
			);
			expect(sendProviderErrorEventSpy).toHaveBeenCalledWith({
				code: 'DOCUMENT_RESTORE_ERROR',
				recoverable: false,
				message: 'Collab service unable to restore document',
				status: 500,
			});
			expect(onErrorHandledSpy).toBeCalledTimes(1);
			expect(onErrorHandledSpy).toBeCalledWith({
				message: 'Caught error while trying to recover the document',
				data: {
					status: 500,
					code: 'DOCUMENT_RESTORE_ERROR',
				},
			});
			expect.assertions(10);
		});
	});

	describe('Targeting clients', () => {
		it('should not restore document if targetClientId is provided and does not match clientId', async () => {
			getUnconfirmedStepsSpy.mockReturnValue(['test', 'test']);
			getCurrentStateSpy.mockReturnValue({ content: 'something' });
			fetchReconcileSpy.mockReturnValue('thing');

			await provider.documentService.onRestore({ ...dummyPayload, targetClientId: '999999' });
			expect(getCurrentStateSpy).not.toHaveBeenCalled();
			expect(fetchReconcileSpy).not.toHaveBeenCalled();
		});
		it('should restore document using applyLocalSteps if targetClientId is provided and matches clientId', async () => {
			getUnconfirmedStepsSpy.mockReturnValue(['test', 'test']);
			getCurrentStateSpy.mockReturnValue({ content: 'something' });
			fetchReconcileSpy.mockReturnValue('thing');

			await provider.documentService.onRestore({ ...dummyPayload, targetClientId: '123456' });
			expect(getCurrentStateSpy).toHaveBeenCalledTimes(1);
			expect(fetchReconcileSpy).not.toHaveBeenCalled();
			expect(applyLocalStepsSpy).toHaveBeenCalledTimes(1);
			expect(sendActionEventSpy).toHaveBeenCalledWith('reinitialiseDocument', 'SUCCESS', {
				numUnconfirmedSteps: 2,
				useReconcile: false,
				clientId: '123456',
				hasTitle: true,
				targetClientId: '123456',
				triggeredByCatchup: true,
			});
		});
		it('should restore document if no targetClientId is provided', async () => {
			getUnconfirmedStepsSpy.mockReturnValue(['test', 'test']);
			getCurrentStateSpy.mockReturnValue({ content: 'something' });
			fetchReconcileSpy.mockReturnValue('thing');

			await provider.documentService.onRestore({ ...dummyPayload });
			expect(getCurrentStateSpy).toHaveBeenCalledTimes(1);
			expect(fetchReconcileSpy).toHaveBeenCalledTimes(1);
		});
	});
});
