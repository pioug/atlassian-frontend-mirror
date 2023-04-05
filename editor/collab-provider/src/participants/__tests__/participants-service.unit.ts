import type { CollabEventTelepointerData } from '@atlaskit/editor-common/collab';
import type { PresencePayload, StepJson } from '../../types';
import type {
  ParticipantsMap,
  ProviderParticipant,
} from '../participants-helper';
import { ParticipantsService } from '../participants-service';
import { ParticipantsState } from '../participants-state';
import { PARTICIPANT_UPDATE_INTERVAL } from '../participants-helper';

const baseTime = 1676863793756;

const sessionId = '69';

const activeUser: ProviderParticipant = {
  userId: '420',
  clientId: 'unused1',
  sessionId: sessionId,
  lastActive: baseTime,
  name: 'Mr Kafei',
  email: 'active@43654376dgfdsdf.com',
  avatar: 'www.jamescameron.com/image.png',
};

describe('updateParticipant', () => {
  const payload: PresencePayload = {
    sessionId: activeUser.sessionId,
    userId: activeUser.userId,
    clientId: activeUser.clientId,
    timestamp: baseTime,
  };

  const getUser = jest.fn().mockReturnValue({
    name: activeUser.name,
    email: activeUser.email,
    avatar: activeUser.avatar,
  });

  const emit = jest.fn();

  beforeEach(() => jest.clearAllMocks());

  describe('when participant is new', () => {
    const participantsService = new ParticipantsService(undefined);

    it('should call emit with participant', async () => {
      await participantsService.updateParticipant(payload, getUser, emit);
      expect(emit).toBeCalledWith('presence', { joined: [activeUser] });
    });
  });

  describe('when participant already exists', () => {
    const participantsMap: ParticipantsMap = new Map().set(
      activeUser.sessionId,
      activeUser,
    );
    const participants: ParticipantsState = new ParticipantsState(
      participantsMap,
    );
    const participantsService = new ParticipantsService(
      undefined,
      participants,
    );

    it('should not call emit', async () => {
      await participantsService.updateParticipant(payload, getUser, emit);
      expect(emit).not.toBeCalled();
    });
  });

  describe('when no userId provided', () => {
    const payloadWithNoId = { ...payload, userId: undefined };
    const participantsService = new ParticipantsService(undefined);

    it('should not call emit', async () => {
      await participantsService.updateParticipant(
        payloadWithNoId,
        getUser,
        emit,
      );
      expect(emit).not.toBeCalled();
    });
  });

  describe('removeInactiveParticipants', () => {
    it('Should not throw when filterInactive throws an error', () => {
      const participantsService = new ParticipantsService(undefined);
      jest.useFakeTimers();
      expect(setTimeout).not.toBeCalled();
      // @ts-ignore
      participantsService.filterInactive = jest.fn().mockImplementation(() => {
        throw new Error('Mock Error');
      });
      participantsService.removeInactiveParticipants(undefined, jest.fn());
      expect(setTimeout).toBeCalledWith(
        expect.any(Function),
        PARTICIPANT_UPDATE_INTERVAL,
      );
    });
  });
});

describe('emitTelepointersFromSteps', () => {
  const emit = jest.fn();
  const participantsMap: ParticipantsMap = new Map().set(
    activeUser.sessionId,
    activeUser,
  );
  const participants: ParticipantsState = new ParticipantsState(
    participantsMap,
  );
  const participantsService = new ParticipantsService(undefined, participants);
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
  const expectedData: CollabEventTelepointerData = {
    sessionId: activeUser.sessionId,
    selection: {
      type: 'textSelection',
      anchor: 123 + 1,
      head: 123 + 1,
    },
    type: 'telepointer',
  };

  beforeEach(() => jest.clearAllMocks());

  it('should call emit with telepointer', () => {
    participantsService.emitTelepointersFromSteps(fakeSteps, emit);
    expect(emit).toBeCalledWith('telepointer', expectedData);
  });

  it('should not emit when a telepointer can not be created from a step', () => {
    participantsService.emitTelepointersFromSteps([{} as any], emit);
    expect(emit).not.toBeCalled();
  });
});
