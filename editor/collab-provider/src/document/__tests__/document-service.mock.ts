import type { ParticipantsService } from '../../participants/participants-service';
import { DocumentService } from '../document-service';
import AnalyticsHelper from '../../analytics/analytics-helper';
import { MetadataService } from '../../metadata/metadata-service';
import type { Config } from '../../types';

jest.mock('../../analytics/analytics-helper');

export const createMockService = (config: Partial<Config> = {}, getConnected = () => true) => {
	const participantsServiceMock = {
		updateLastActive: jest.fn(),
		emitTelepointersFromSteps: jest.fn(),
		getCollabMode: jest.fn(),
	} as unknown as ParticipantsService;

	const fetchCatchupv2Mock = jest.fn();
	const fetchReconcileMock = jest.fn();
	const fetchGeneratedDiffStepsMock = jest.fn();
	const providerEmitCallbackMock = jest.fn();
	const sendMetadataMock = jest.fn();
	const broadcastMock = jest.fn();
	const getUserIdMock = jest.fn();
	const onErrorHandledMock = jest.fn();
	const metadataService = new MetadataService(providerEmitCallbackMock, sendMetadataMock);
	const isNameSpaceLockedMock = jest.fn().mockReturnValue(false);
	const options = { __livePage: config.__livePage ?? false };

	const service = new DocumentService(
		participantsServiceMock,
		// @ts-expect-error - mock class
		new AnalyticsHelper(),
		fetchCatchupv2Mock,
		fetchReconcileMock,
		fetchGeneratedDiffStepsMock,
		providerEmitCallbackMock,
		broadcastMock,
		getUserIdMock,
		onErrorHandledMock,
		metadataService,
		isNameSpaceLockedMock,
		Boolean(config.enableErrorOnFailedDocumentApply),
		options,
		getConnected,
	);

	// @ts-expect-error - jest mock class
	const analyticsHelperMock = AnalyticsHelper.mock.instances[0];
	// @ts-expect-error - get private member
	const stepQueue = service.stepQueue;
	// @ts-expect-error - get private member
	const commitStepServiceMock = service.commitStepService;

	return {
		service,
		analyticsHelperMock,
		participantsServiceMock,
		fetchCatchupv2Mock,
		fetchReconcileMock,
		fetchGeneratedDiffStepsMock,
		providerEmitCallbackMock,
		sendMetadataMock,
		broadcastMock,
		getUserIdMock,
		stepQueue,
		onErrorHandledMock,
		isNameSpaceLockedMock,
		commitStepServiceMock,
	};
};
