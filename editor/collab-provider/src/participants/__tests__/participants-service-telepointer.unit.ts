import AnalyticsHelper from '../../analytics/analytics-helper';
import {
  CollabEventTelepointerData,
  PresencePayload,
  StepJson,
} from '../../types';
import { ParticipantsMap, ProviderParticipant } from '../participants-helper';
import { ParticipantsService } from '../participants-service';
import { ParticipantsState } from '../participants-state';

const baseTime = 1676863793756;

const sessionId = 'vXrOwZ7OIyXq17jdB2jh';

const activeUser: ProviderParticipant = {
  userId: '70121:8fce2c13-5f60-40be-a9f2-956c6f041fbe',
  clientId: '328374441',
  sessionId: sessionId,
  lastActive: baseTime,
  name: 'Mr Kafei',
  avatar: 'www.jamescameron.com/image.png',
};

const payload: PresencePayload = {
  sessionId: activeUser.sessionId,
  userId: activeUser.userId,
  clientId: activeUser.clientId,
  timestamp: baseTime,
};

const participantsServiceConstructor = (deps: {
  analyticsHelper?: AnalyticsHelper;
  participants?: ParticipantsState;
  emit?: any;
  getUser?: any;
  broadcast?: any;
  sendPresenceJoined?: any;
  getPresenceData?: any;
  setUserId?: any;
}): ParticipantsService =>
  new ParticipantsService(
    deps.analyticsHelper,
    deps.participants,
    deps.emit || jest.fn(),
    deps.getUser || jest.fn(),
    deps.broadcast || jest.fn(),
    deps.sendPresenceJoined || jest.fn(),
    deps.getPresenceData || jest.fn().mockReturnValue(payload),
    deps.setUserId || jest.fn(),
  );

const fakeSteps: StepJson[] = [
  {
    stepType: 'replace',
    from: 123,
    to: 123,
    slice: {
      content: [
        {
          type: 'text',
          text: 'J',
          attrs: { something: 'something' },
          content: [],
          marks: [],
        },
      ],
      openStart: 123,
      openEnd: 123,
    },
    clientId: activeUser.clientId,
    userId: activeUser.userId,
  },
];

describe('emitTelepointersFromSteps', () => {
  beforeEach(jest.clearAllMocks);

  const participantsMap: ParticipantsMap = new Map().set(
    activeUser.sessionId,
    activeUser,
  );
  const participants: ParticipantsState = new ParticipantsState(
    participantsMap,
  );

  describe('on success', () => {
    const emit = jest.fn();

    const participantsService = participantsServiceConstructor({
      participants,
      emit,
    });
    const expectedData: CollabEventTelepointerData = {
      sessionId: activeUser.sessionId,
      selection: {
        type: 'textSelection',
        anchor: 123 + 1,
        head: 123 + 1,
      },
      type: 'telepointer',
    };

    it('should call emit with telepointer', () => {
      participantsService.emitTelepointersFromSteps(fakeSteps);
      expect(emit).toBeCalledWith('telepointer', expectedData);
    });

    it('should not emit when a telepointer can not be created from a step', () => {
      participantsService.emitTelepointersFromSteps([{} as any]);
      expect(emit).not.toBeCalled();
    });
  });

  describe('on failure to emit', () => {
    const analyticsHelper = new AnalyticsHelper('fakeDocumentAri');
    jest.spyOn(analyticsHelper, 'sendErrorEvent');
    const fakeError = new Error('fake error');

    const emit = jest.fn().mockImplementation(() => {
      throw fakeError;
    });

    const participantsService = participantsServiceConstructor({
      analyticsHelper,
      participants,
      emit,
    });

    it('should not throw', () => {
      expect(() =>
        participantsService.emitTelepointersFromSteps(fakeSteps),
      ).not.toThrow();
    });

    it('should send error to analytics', () => {
      participantsService.emitTelepointersFromSteps(fakeSteps);
      expect(analyticsHelper.sendErrorEvent).toBeCalledTimes(1);
      expect(analyticsHelper.sendErrorEvent).toBeCalledWith(
        fakeError,
        'Error while emitting telepointers from steps',
      );
    });
  });
});
