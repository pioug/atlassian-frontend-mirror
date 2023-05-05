import type {
  CollabEventPresenceData,
  CollabEventDisconnectedData,
} from '@atlaskit/editor-common/collab';
import { disconnectedReasonMapper } from '../disconnected-reason-mapper';
import AnalyticsHelper from '../analytics/analytics-helper';
import { EVENT_ACTION, EVENT_STATUS } from '../helpers/const';
import { telepointerFromStep } from './telepointers-helper';
import type {
  CollabEventTelepointerData,
  PresencePayload,
  StepJson,
  TelepointerPayload,
} from '../types';
import {
  createParticipantFromPayload as enrichParticipant,
  GetUserType,
  PARTICIPANT_UPDATE_INTERVAL,
  TelepointerEmit,
} from './participants-helper';
import type { PresenceEmit } from './participants-helper';
import { ParticipantsState } from './participants-state';

export class ParticipantsService {
  private participantsState: ParticipantsState;
  private participantUpdateTimeout: number | undefined;
  private analyticsHelper: AnalyticsHelper | undefined;

  constructor(
    analyticsHelper: AnalyticsHelper | undefined,
    participantsState: ParticipantsState = new ParticipantsState(),
  ) {
    this.participantsState = participantsState;
    this.analyticsHelper = analyticsHelper;
  }

  /**
   * Carries out 3 things: 1) enriches the participant with user data, 2) updates the participantsState, 3) emits the presence event
   * @param payload Payload from incoming socket event
   * @param getUser Function to get user data from confluence
   * @param emit Function to execute emit from provider socket
   * @returns Awaitable Promise, due to getUser
   */
  updateParticipant = async (
    payload: PresencePayload,
    getUser: GetUserType,
    emit: PresenceEmit,
  ): Promise<void> => {
    const { userId } = payload;

    // If userId does not exist, does nothing here to prevent duplication.
    if (!userId) {
      return;
    }

    let participant;
    // getUser is a failable callback, hence try-catch
    try {
      participant = await enrichParticipant(
        // userId _must_ be defined, this lets the compiler know
        { ...payload, userId },
        getUser,
      );
    } catch (error) {
      // We don't want to throw errors for Presence features as they tend to self-restore
      this.analyticsHelper?.sendErrorEvent(error, 'enriching participant');
    }

    if (!participant) {
      return;
    }

    const isNewParticipant = this.participantsState.doesntHave(
      participant.sessionId,
    );
    this.participantsState.setBySessionId(participant.sessionId, participant);

    if (!isNewParticipant) {
      return;
    }

    this.emitPresence(
      { joined: [participant] },
      emit,
      'handling participant updated event',
    );
  };

  /**
   * Called when a participant leaves the session.
   *
   * We emit the `presence` event to update the active avatars in the editor.
   */
  participantLeft = (
    { sessionId }: PresencePayload,
    emit: PresenceEmit,
  ): void => {
    this.participantsState.removeBySessionId(sessionId);
    this.emitPresence({ left: [{ sessionId }] }, emit, 'participant leaving');
  };

  disconnect = (
    reason: string,
    sessionId: string | undefined,
    emit: (
      evt: 'presence' | 'disconnected',
      data: CollabEventPresenceData | CollabEventDisconnectedData,
    ) => void,
  ) => {
    const left = this.participantsState.getParticipants();
    this.participantsState.clear();
    try {
      emit('disconnected', {
        reason: disconnectedReasonMapper(reason),
        sid: sessionId!,
      });
    } catch (error) {
      // We don't want to throw errors for Presence features as they tend to self-restore
      this.analyticsHelper?.sendErrorEvent(error, 'emitting disconnected data');
    }

    if (left.length) {
      this.emitPresence(
        { left },
        emit,
        'emitting presence update on disconnect',
      );
    }
  };

  /**
   * Updates when users were last active
   * @param userIds Users in most recent steps
   */
  updateLastActive = (userIds: string[] = []) =>
    this.participantsState.updateLastActive(Date.now(), userIds);

  /**
   * Called on receiving steps, emits each step's telepointer
   * @param steps Steps to extract telepointers from
   * @param emit Provider emit function
   */
  emitTelepointersFromSteps(steps: StepJson[], emit: TelepointerEmit) {
    steps.forEach((step) => {
      const event = telepointerFromStep(
        this.participantsState.getParticipants(),
        step,
      );
      if (event) {
        this.emitTelepointer(event, emit, 'emitting telepointers from steps');
      }
    });
  }

  /**
   * Called when we receive a telepointer update from another
   * participant.
   */
  participantTelepointer = (
    payload: TelepointerPayload,
    thisSessionId: string | undefined,
    getUser: GetUserType,
    emit: (
      evt: 'telepointer' | 'presence',
      data: CollabEventTelepointerData | CollabEventPresenceData,
    ) => void,
  ): void => {
    const { sessionId, selection, timestamp } = payload;
    const participant = this.participantsState.getBySessionId(sessionId);
    if (
      sessionId === thisSessionId ||
      // Ignore old telepointer events
      (participant && participant.lastActive > timestamp)
    ) {
      return;
    }

    const userId = payload.userId ? [payload.userId] : undefined;

    // Set last active
    this.updateLastActive(userId);

    this.emitTelepointer(
      {
        type: 'telepointer',
        selection,
        sessionId,
      },
      emit,
      'handling participant telepointer event',
    );
  };

  /**
   * Every 5 minutes (PARTICIPANT_UPDATE_INTERVAL), removes inactive participants and emits the update to other participants.
   * Needs to be kicked off in the Provider.
   * @param sessionId SessionId from provider's connection
   * @param emit Function to execute emit from provider socket
   */
  removeInactiveParticipants = (
    sessionId: string | undefined,
    emit: PresenceEmit,
  ) => {
    clearTimeout(this.participantUpdateTimeout);

    try {
      this.filterInactive(sessionId, emit);
    } catch (err) {
      this.analyticsHelper?.sendErrorEvent(
        err,
        'Failed filtering inactive participants',
      );
    }

    this.participantUpdateTimeout = window.setTimeout(
      () => this.removeInactiveParticipants(sessionId, emit),
      PARTICIPANT_UPDATE_INTERVAL,
    );
  };

  /**
   * Keep list of participants up to date. Filter out inactive users etc.
   */
  private filterInactive = (
    sessionId: string | undefined,
    emit: PresenceEmit,
  ): void => {
    const now: number = Date.now();

    const left = this.participantsState
      .getParticipants()
      .filter(
        (p) =>
          p.sessionId !== sessionId &&
          now - p.lastActive > PARTICIPANT_UPDATE_INTERVAL,
      );

    left.forEach((p) => this.participantsState.removeBySessionId(p.sessionId));

    left.length &&
      this.emitPresence({ left }, emit, 'filtering inactive participants');
  };

  /**
   * Wrapper function to emit with error handling and analytics
   * @param data Data to emit
   * @param emit Emit function from Provider
   */
  private emitPresence = (
    data: CollabEventPresenceData,
    emit: PresenceEmit,
    errorMessage: string,
  ): void => {
    try {
      emit('presence', data);
      this.analyticsHelper?.sendActionEvent(
        EVENT_ACTION.UPDATE_PARTICIPANTS,
        EVENT_STATUS.SUCCESS,
        { participants: this.participantsState.size() },
      );
    } catch (error) {
      // We don't want to throw errors for Presence features as they tend to self-restore
      this.analyticsHelper?.sendErrorEvent(
        error,
        `Error while ${errorMessage}`,
      );
    }
  };

  /**
   * Wrapper function to emit with error handling and analytics
   * @param data Data to emit
   * @param emit Emit function from Provider
   */
  private emitTelepointer = (
    data: CollabEventTelepointerData,
    emit: TelepointerEmit,
    errorMessage: string,
  ): void => {
    try {
      emit('telepointer', data);
    } catch (error) {
      // We don't want to throw errors for Presence features as they tend to self-restore
      this.analyticsHelper?.sendErrorEvent(
        error,
        `Error while ${errorMessage}`,
      );
    }
  };

  /**
   * Used when the provider is disconnected or destroyed to prevent perpetual timers from continuously running
   */
  clearTimers = () => {
    clearTimeout(this.participantUpdateTimeout);
  };
}
