import { type CollabActivityData } from '@atlaskit/editor-common/src/collab';
import AnalyticsHelper from '../../analytics/analytics-helper';
import type { ActivityPayload } from '../../types';
import { ParticipantsService } from '../participants-service';

describe('participants-service-activity', () => {
	let broadcast: any;
	let emit: any;
	let getUser: any;
	let sendPresenceJoined: any;
	let setUserId: any;
	let getPresenceData: any;
	let analyticsHelper: AnalyticsHelper;
	let analyticsSpy: any;
	let participantsService: ParticipantsService;
	let activityPayload: ActivityPayload;
	let presenceData: Pick<CollabActivityData, 'sessionId' | 'userId'>;

	beforeEach(() => {
		jest.clearAllMocks();
		broadcast = jest.fn();
		emit = jest.fn();
		getUser = jest.fn();
		sendPresenceJoined = jest.fn();
		setUserId = jest.fn();
		getPresenceData = jest.fn().mockReturnValue(presenceData);
		analyticsHelper = new AnalyticsHelper('nope');
		analyticsSpy = jest.spyOn(analyticsHelper, 'sendErrorEvent');
		activityPayload = {
			userId: '123',
			activity: 'VIEWING',
			sessionId: 'xyz321',
		};
		participantsService = new ParticipantsService(
			analyticsHelper,
			// @ts-ignore
			undefined,
			emit,
			getUser,
			broadcast,
			sendPresenceJoined,
			getPresenceData,
			setUserId,
		);
		presenceData = {
			userId: '456',
			sessionId: 'abc654',
		};
	});

	describe('onParticipantActivityJoin', () => {
		describe('on success', () => {
			beforeEach(() => {
				participantsService.onParticipantActivityJoin(activityPayload);
			});

			it('should emit presence', () => {
				expect(emit).toHaveBeenCalledTimes(1);
				expect(emit).toHaveBeenCalledWith('activity:join', activityPayload);
			});
		});

		describe('on failure', () => {
			const error = new Error('pooped the bed');
			beforeEach(() => {
				emit.mockImplementation(() => {
					throw error;
				});
				participantsService.onParticipantActivityJoin(activityPayload);
			});

			it('should catch error and send analytics', () => {
				expect(analyticsSpy).toHaveBeenCalledTimes(1);
				expect(analyticsSpy).toHaveBeenCalledWith(error, "Error while sending 'activity:join'");
			});
		});
	});

	describe('onParticipantActivityAck', () => {
		describe('on success', () => {
			beforeEach(() => {
				participantsService.onParticipantActivityAck(activityPayload);
			});

			it('should broadcast presence', () => {
				expect(emit).toHaveBeenCalledTimes(1);
				expect(emit).toHaveBeenCalledWith('activity:ack', activityPayload);
			});
		});

		describe('on failure', () => {
			const error = new Error('pooped the bed');
			beforeEach(() => {
				emit.mockImplementation(() => {
					throw error;
				});
				participantsService.onParticipantActivityAck(activityPayload);
			});

			it('should catch error and send analytics', () => {
				expect(analyticsSpy).toHaveBeenCalledTimes(1);
				expect(analyticsSpy).toHaveBeenCalledWith(error, "Error while sending 'activity:ack'");
			});
		});
	});
});
