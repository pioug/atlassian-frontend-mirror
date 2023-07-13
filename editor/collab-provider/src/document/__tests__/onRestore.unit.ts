import { Provider } from '../../';

describe('DocumentService onRestore', () => {
  let dummyPayload: any;
  let provider: any;
  let getUnconfirmedStepsSpy: any;
  let sendActionEventSpy: any;
  let sendErrorEventSpy: any;
  let onErrorHandledSpy: any;
  let applyLocalStepsSpy: any;

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
    const pds = provider.documentService;
    getUnconfirmedStepsSpy = jest.spyOn(pds, 'getUnconfirmedSteps');
    onErrorHandledSpy = jest.spyOn(pds, 'onErrorHandled');
    applyLocalStepsSpy = jest.spyOn(
      provider.documentService,
      'applyLocalSteps',
    );
    sendActionEventSpy = jest.spyOn(pds.analyticsHelper, 'sendActionEvent');
    sendErrorEventSpy = jest.spyOn(pds.analyticsHelper, 'sendErrorEvent');
  });

  afterEach(() => jest.clearAllMocks());

  describe('reinitialise the document', () => {
    it('sends correct initial metadata and reserveCursor to provider', (done) => {
      expect.assertions(4);
      getUnconfirmedStepsSpy.mockReturnValue([]);
      const updateDoc = jest.spyOn(provider.documentService, 'updateDocument');
      provider.on('init', (data: any) => {
        expect(data).toEqual({
          ...dummyPayload,
          reserveCursor: true,
        });
      });
      provider.on('metadata:changed', (data: any) => {
        expect(data).toEqual(dummyPayload.metadata);
        done();
      });
      // @ts-ignore
      provider.documentService.onRestore(dummyPayload);
      expect(updateDoc).toBeCalledTimes(1);
      expect(updateDoc).toBeCalledWith({
        ...dummyPayload,
        reserveCursor: true,
      });
    });

    describe('without unconfirmed steps', () => {
      beforeEach(() => {
        getUnconfirmedStepsSpy.mockReturnValue([]);
        // @ts-ignore
        provider.documentService.onRestore(dummyPayload);
      });

      it('fires analytics with correct unconfirmedSteps length', () => {
        expect(sendActionEventSpy).toBeCalledTimes(1);
        expect(sendActionEventSpy).toBeCalledWith(
          'reinitialiseDocument',
          'SUCCESS',
          { hasTitle: true, numUnconfirmedSteps: 0 },
        );
      });

      it('doesnot call applyLocalSteps if there are not steps to apply', () => {
        // @ts-ignore assessing private function for test
        expect(applyLocalStepsSpy).not.toBeCalled();
      });
    });

    describe('with unconfirmed steps', () => {
      beforeEach(() => {
        getUnconfirmedStepsSpy.mockReturnValue(['test', 'test']);
      });

      it('fires analytics with correct unconfirmedSteps length', () => {
        provider.documentService.onRestore(dummyPayload);
        expect(sendActionEventSpy).toBeCalledTimes(1);
        expect(sendActionEventSpy).toBeCalledWith(
          'reinitialiseDocument',
          'SUCCESS',
          { hasTitle: true, numUnconfirmedSteps: 2 },
        );
      });

      it('calls applyLocalSteps with steps to apply', (done) => {
        provider.on('local-steps', ({ steps }: any) => {
          expect(steps).toEqual(['test', 'test']);
          done();
        });
        provider.documentService.onRestore(dummyPayload);
        expect(applyLocalStepsSpy).toBeCalledTimes(1);
        expect(applyLocalStepsSpy).toBeCalledWith(['test', 'test']);
      });
    });
  });

  describe('Catch and relay correct errors', () => {
    const testError = new Error('testing');
    beforeEach(() => {
      getUnconfirmedStepsSpy.mockReturnValue(['test', 'test']);
    });

    it('when updateDocument throws', (done) => {
      expect.assertions(7);
      jest
        .spyOn(provider.documentService, 'updateDocument')
        .mockImplementation(() => {
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
        } catch (e) {
          done(e);
        }
      });
      provider.documentService.onRestore(dummyPayload);
      expect(sendActionEventSpy).toBeCalledTimes(1);
      expect(sendActionEventSpy).toBeCalledWith(
        'reinitialiseDocument',
        'FAILURE',
        { numUnconfirmedSteps: 2 },
      );
      expect(sendErrorEventSpy).toBeCalledTimes(3);
      expect(sendErrorEventSpy).toBeCalledWith(
        testError,
        'Error while reinitialising document',
      );
      expect(onErrorHandledSpy).toBeCalledTimes(1);
      expect(onErrorHandledSpy).toHaveBeenNthCalledWith(1, {
        message: 'Caught error while trying to recover the document',
        data: {
          status: 500,
          code: 'DOCUMENT_RESTORE_ERROR',
        },
      });
      done();
    });

    it('when applyLocalSteps throws', () => {
      expect.assertions(9);
      jest
        .spyOn(provider.documentService, 'applyLocalSteps')
        .mockImplementation(() => {
          throw new Error('testing');
        });
      jest
        .spyOn(provider.documentService, 'updateDocument')
        .mockImplementation(() => {
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
      provider.documentService.onRestore(dummyPayload);

      expect(sendActionEventSpy).toBeCalledTimes(1);
      expect(sendActionEventSpy).toBeCalledWith(
        'reinitialiseDocument',
        'FAILURE',
        { numUnconfirmedSteps: 2 },
      );
      expect(sendErrorEventSpy).toBeCalledTimes(3);
      expect(sendErrorEventSpy).toHaveBeenNthCalledWith(
        1,
        testError,
        'Error while reinitialising document',
      );
      expect(sendErrorEventSpy).toHaveBeenNthCalledWith(
        2,
        {
          data: { code: 'DOCUMENT_RESTORE_ERROR', status: 500 },
          message: 'Caught error while trying to recover the document',
        },
        'Error handled',
      );
      expect(sendErrorEventSpy).toHaveBeenNthCalledWith(
        3,
        {
          code: 'DOCUMENT_RESTORE_ERROR',
          recoverable: false,
          message: 'Collab service unable to restore document',
          status: 500,
        },
        'Error emitted',
      );
      expect(onErrorHandledSpy).toBeCalledTimes(1);
      expect(onErrorHandledSpy).toBeCalledWith({
        message: 'Caught error while trying to recover the document',
        data: {
          status: 500,
          code: 'DOCUMENT_RESTORE_ERROR',
        },
      });
    });
  });
});
