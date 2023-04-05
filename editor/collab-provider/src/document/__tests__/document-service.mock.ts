import { ParticipantsService } from '../../participants/participants-service';
import { DocumentService } from '../document-service';
import AnalyticsHelper from '../../analytics/analytics-helper';

jest.mock('../../analytics/analytics-helper');

export const createMockService = () => {
  let participantsServiceMock = {
    updateLastActive: jest.fn(),
    emitTelepointersFromSteps: jest.fn(),
  } as unknown as ParticipantsService;

  const fetchCatchupMock = jest.fn();
  const providerEmitCallbackMock = jest.fn();
  const sendMetadataMock = jest.fn();
  const broadcastMock = jest.fn();
  const getUserIdMock = jest.fn();
  const onErrorHandledMock = jest.fn();
  const service = new DocumentService(
    participantsServiceMock,
    // @ts-expect-error - mock class
    new AnalyticsHelper(),
    fetchCatchupMock,
    providerEmitCallbackMock,
    sendMetadataMock,
    broadcastMock,
    getUserIdMock,
    onErrorHandledMock,
  );

  // @ts-expect-error - jest mock class
  const analyticsHelperMock = AnalyticsHelper.mock.instances[0];
  // @ts-expect-error - get private member
  const stepQueue = service.stepQueue;

  return {
    service,
    analyticsHelperMock,
    participantsServiceMock,
    fetchCatchupMock,
    providerEmitCallbackMock,
    sendMetadataMock,
    broadcastMock,
    getUserIdMock,
    stepQueue,
    onErrorHandledMock,
  };
};
