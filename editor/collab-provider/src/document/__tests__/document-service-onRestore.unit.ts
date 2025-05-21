import { Provider } from '../..';
import { Step as ProseMirrorStep } from '@atlaskit/editor-prosemirror/transform';
import { defaultSchema } from '@atlaskit/adf-schema/schema-default';
import { type JSONDocNode } from '@atlaskit/editor-json-transformer';

const step1 = {
	userId: 'ari:cloud:identity::user/123',
	clientId: 123,
	from: 1,
	to: 4,
	stepType: 'replace',
	slice: {
		content: [{ type: 'paragraph', content: [{ type: 'text', text: 'abc' }] }],
	},
};

const step2 = {
	userId: 'ari:cloud:identity::user/123',
	clientId: 123,
	from: 1,
	to: 3,
	stepType: 'replace',
	slice: {
		content: [{ type: 'paragraph', content: [{ type: 'text', text: 'ab' }] }],
	},
};

const pmSteps = [
	ProseMirrorStep.fromJSON(defaultSchema, step1),
	ProseMirrorStep.fromJSON(defaultSchema, step2),
];

const expectedObfuscatedSteps = [
	{
		stepContent: [
			{
				content: [
					{
						attrs: {
							localId: null,
						},
						content: [
							{
								text: 'lor',
								type: 'text',
							},
						],
						type: 'paragraph',
					},
				],
				type: 'doc',
			},
		],
		stepMetadata: undefined,
		stepPositions: {
			from: 1,
			to: 4,
		},
		stepType: {
			contentTypes: 'paragraph',
			type: 'replace',
		},
	},
	{
		stepContent: [
			{
				content: [
					{
						attrs: {
							localId: null,
						},
						content: [
							{
								text: 'lo',
								type: 'text',
							},
						],
						type: 'paragraph',
					},
				],
				type: 'doc',
			},
		],
		stepMetadata: undefined,
		stepPositions: {
			from: 1,
			to: 3,
		},
		stepType: {
			contentTypes: 'paragraph',
			type: 'replace',
		},
	},
];

const editorState: any = {
	content: {
		type: 'doc',
		version: 1,
		content: [
			{
				type: 'paragraph',
				content: [
					{ type: 'text', text: 'Hello, World!' },
					{
						// Add a node that looks different in ADF
						type: 'text',
						marks: [
							{
								type: 'typeAheadQuery',
								attrs: {
									trigger: '/',
								},
							},
						],
						text: '/',
					},
				],
			},
		],
	} as JSONDocNode,
};

const expectedObfuscatedDoc = {
	content: [
		{
			content: [
				{
					text: 'Lorem, Ipsum!',
					type: 'text',
				},
				{
					marks: [
						{
							attrs: {
								trigger: '/',
							},
							type: 'typeAheadQuery',
						},
					],
					text: '/',
					type: 'text',
				},
			],
			type: 'paragraph',
		},
	],
	type: 'doc',
	version: 1,
};

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

	afterEach(() => {
		jest.clearAllMocks();
		provider.destroy();
	});

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

		it('sets hasRecovered flag to true if triggered by page recovery', async () => {
			getUnconfirmedStepsSpy.mockReturnValue([]);
			getCurrentStateSpy.mockReturnValue({ content: 'something' });
			provider.on('init', (data: any) => {
				expect(data).toEqual({
					...dummyPayload,
					reserveCursor: true,
				});
			});
			await provider.documentService.onRestore(dummyPayload);
			expect(provider.documentService.hasRecovered).toBe(true);
		});

		describe('without unconfirmed steps', () => {
			beforeEach(async () => {
				getUnconfirmedStepsSpy.mockReturnValue([]);
				getCurrentStateSpy.mockReturnValue(undefined);
				await provider.documentService.onRestore(dummyPayload);
			});

			it('fires analytics with correct unconfirmedSteps length', () => {
				expect(sendActionEventSpy).toBeCalledTimes(2);
				expect(sendActionEventSpy).toHaveBeenNthCalledWith(1, 'reinitialiseDocument', 'INFO', {
					numUnconfirmedSteps: 0,
					clientId: '123456',
					hasTitle: true,
					targetClientId: undefined,
					triggeredByCatchup: false,
					obfuscatedSteps: [],
					obfuscatedDoc: undefined,
				});

				expect(sendActionEventSpy).toHaveBeenNthCalledWith(2, 'reinitialiseDocument', 'SUCCESS', {
					numUnconfirmedSteps: 0,
					useReconcile: false,
					clientId: '123456',
					hasTitle: true,
					targetClientId: undefined,
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
				expect(sendActionEventSpy).toBeCalledTimes(2);
				expect(sendActionEventSpy).toHaveBeenNthCalledWith(
					1,
					'reinitialiseDocument',
					'INFO',
					expect.objectContaining({
						numUnconfirmedSteps: 2,
						clientId: '123456',
						hasTitle: true,
						targetClientId: undefined,
						triggeredByCatchup: false,
					}),
				);
				expect(sendActionEventSpy).toHaveBeenNthCalledWith(
					2,
					'reinitialiseDocument',
					'SUCCESS',
					expect.objectContaining({
						numUnconfirmedSteps: 2,
						useReconcile: false,
						clientId: '123456',
						hasTitle: true,
						targetClientId: undefined,
						triggeredByCatchup: false,
					}),
				);
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

				it('call applyLocalSteps by default', async () => {
					await provider.documentService.onRestore(dummyPayload);
					expect(applyLocalStepsSpy).toBeCalledTimes(1);
				});

				it('fires analytics with correct unconfirmedSteps length', async () => {
					await provider.documentService.onRestore(dummyPayload);
					expect(sendActionEventSpy).toBeCalledTimes(2);
					expect(sendActionEventSpy).toHaveBeenNthCalledWith(
						1,
						'reinitialiseDocument',
						'INFO',
						expect.objectContaining({
							numUnconfirmedSteps: 2,
							clientId: '123456',
							hasTitle: true,
							targetClientId: undefined,
							triggeredByCatchup: false,
						}),
					);
					expect(sendActionEventSpy).toHaveBeenNthCalledWith(
						2,
						'reinitialiseDocument',
						'SUCCESS',
						expect.objectContaining({
							numUnconfirmedSteps: 2,
							useReconcile: true,
							clientId: '123456',
							hasTitle: true,
							targetClientId: undefined,
							triggeredByCatchup: false,
						}),
					);
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

		it('does not set hasRecovered flag to true if triggered for targetClientId', async () => {
			getUnconfirmedStepsSpy.mockReturnValue([]);
			getCurrentStateSpy.mockReturnValue({ content: 'something' });
			await provider.documentService.onRestore({ ...dummyPayload, targetClientId: '123456' });
			expect(provider.documentService.hasRecovered).toBe(false);
		});
	});

	describe('onRestore with applyLocalSteps only', () => {
		it('should restore document using applyLocalSteps only', async () => {
			// When unconfirmedSteps are in range and targetClientId is provided and matches clientId
			// should restore document using applyLocalSteps only
			getUnconfirmedStepsSpy.mockReturnValue(pmSteps);
			getCurrentStateSpy.mockReturnValue(editorState);
			await provider.documentService.onRestore({ ...dummyPayload, targetClientId: '123456' });
			expect(getCurrentStateSpy).toHaveBeenCalledTimes(1);
			expect(fetchReconcileSpy).not.toHaveBeenCalled();
			expect(applyLocalStepsSpy).toHaveBeenCalledTimes(1);
			expect(sendActionEventSpy).toHaveBeenCalledTimes(2);
			expect(sendActionEventSpy).toHaveBeenNthCalledWith(1, 'reinitialiseDocument', 'INFO', {
				numUnconfirmedSteps: 2,
				clientId: '123456',
				hasTitle: true,
				targetClientId: '123456',
				triggeredByCatchup: true,
				obfuscatedSteps: expectedObfuscatedSteps,
				obfuscatedDoc: expectedObfuscatedDoc,
			});
			expect(sendActionEventSpy).toHaveBeenNthCalledWith(2, 'reinitialiseDocument', 'SUCCESS', {
				numUnconfirmedSteps: 2,
				useReconcile: false, // use useReconcile as fallback
				clientId: '123456',
				hasTitle: true,
				targetClientId: '123456',
				triggeredByCatchup: true,
			});
		});
	});

	describe('onRestore with applyLocalSteps, fetchReconcile when catching error', () => {
		it('should restore document using applyLocalSteps first and then catching error to fetch reconcile', async () => {
			// When unconfirmedSteps are out of range and targetClientId is provided and matches clientId
			// should restore document using applyLocalSteps first and then catching error to fetch reconcile
			getUnconfirmedStepsSpy.mockReturnValue(pmSteps);
			getCurrentStateSpy.mockReturnValue(editorState);
			applyLocalStepsSpy.mockImplementation(() => {
				throw new RangeError('Out of range index');
			});
			fetchReconcileSpy.mockReturnValue('thing');
			await provider.documentService.onRestore({ ...dummyPayload, targetClientId: '123456' });
			expect(getCurrentStateSpy).toHaveBeenCalledTimes(1);
			expect(fetchReconcileSpy).toHaveBeenCalledTimes(1);
			expect(applyLocalStepsSpy).toHaveBeenCalledTimes(1);
			expect(sendActionEventSpy).toHaveBeenCalledTimes(2);
			expect(sendActionEventSpy).toHaveBeenNthCalledWith(1, 'reinitialiseDocument', 'INFO', {
				numUnconfirmedSteps: 2,
				clientId: '123456',
				hasTitle: true,
				targetClientId: '123456',
				triggeredByCatchup: true,
				obfuscatedSteps: expectedObfuscatedSteps,
				obfuscatedDoc: expectedObfuscatedDoc,
			});
			expect(sendActionEventSpy).toHaveBeenNthCalledWith(2, 'reinitialiseDocument', 'SUCCESS', {
				numUnconfirmedSteps: 2,
				useReconcile: true, // use useReconcile as fallback
				clientId: '123456',
				hasTitle: true,
				targetClientId: '123456',
				triggeredByCatchup: true,
			});
		});
	});
});
