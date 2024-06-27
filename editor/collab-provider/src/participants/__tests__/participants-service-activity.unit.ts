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
	let payload: ActivityPayload;
	let activityData: CollabActivityData;

	beforeEach(() => {
		jest.clearAllMocks();
		broadcast = jest.fn();
		emit = jest.fn();
		getUser = jest.fn();
		sendPresenceJoined = jest.fn();
		setUserId = jest.fn();
		getPresenceData = jest.fn().mockReturnValue(payload);
		analyticsHelper = new AnalyticsHelper('nope');
		analyticsSpy = jest.spyOn(analyticsHelper, 'sendErrorEvent');
		payload = {
			userId: '456',
			activity: 'VIEWING',
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
		activityData = {
			userId: '456',
			activity: 'VIEWING',
		};
	});

	describe('onParticipantActivityJoin', () => {
		describe('on success', () => {
			beforeEach(() => {
				participantsService.onParticipantActivityJoin(payload);
			});

			it('should emit presence', () => {
				expect(emit).toHaveBeenCalledTimes(1);
				expect(emit).toHaveBeenCalledWith('activity:join', activityData);
			});
		});

		describe('on failure', () => {
			const error = new Error('pooped the bed');
			beforeEach(() => {
				emit.mockImplementation(() => {
					throw error;
				});
				participantsService.onParticipantActivityJoin(payload);
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
				participantsService.onParticipantActivityAck(payload);
			});

			it('should broadcast presence', () => {
				expect(emit).toHaveBeenCalledTimes(1);
				expect(emit).toHaveBeenCalledWith('activity:ack', payload);
			});
		});

		describe('on failure', () => {
			const error = new Error('pooped the bed');
			beforeEach(() => {
				emit.mockImplementation(() => {
					throw error;
				});
				participantsService.onParticipantActivityAck(payload);
			});

			it('should catch error and send analytics', () => {
				expect(analyticsSpy).toHaveBeenCalledTimes(1);
				expect(analyticsSpy).toHaveBeenCalledWith(error, "Error while sending 'activity:ack'");
			});
		});
	});
});
