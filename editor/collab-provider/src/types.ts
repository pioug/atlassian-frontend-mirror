import {
  CollabParticipant,
  CollabEventTelepointerData,
  CollabSendableSelection,
} from '@atlaskit/editor-common';

export type ConnectedPayload = {
  sid: string;
};

export type InitPayload = {
  doc: any;
  version: number;
};

export type ParticipantPayload = {
  sessionId: string;
  userId: string;
  clientId: string;
  timestamp: number;
};

export type TelepointerPayload = ParticipantPayload & {
  selection: CollabSendableSelection;
};

export type StepJson = {
  from?: number;
  to?: number;
  stepType?: string;
  clientId: string;
  userId: string;
};

export type StepsPayload = {
  version: number;
  steps: StepJson[];
};

export type ChannelEvent = {
  connected: ConnectedPayload;
  init: InitPayload;
  'participant:joined': ParticipantPayload;
  'participant:left': ParticipantPayload;
  'participant:telepointer': TelepointerPayload;
  'participant:updated': ParticipantPayload;
  'steps:commit': StepsPayload & { userId: string };
  'steps:added': StepsPayload;
  'title:changed': { title: string };
  disconnect: { reason: string };
};

export type CollabEvent = {
  init: Omit<ConnectedPayload, 'sid'>;
  connected: Pick<ConnectedPayload, 'sid'>;
  presence: {
    joined?: CollabParticipant[];
    left?: Pick<CollabParticipant, 'sessionId'>[];
  };
  telepointer: Omit<CollabEventTelepointerData, 'type'>;
  data: {
    json: StepJson[];
    version: number;
    userIds: string[];
  };
  'title:changed': { title: string };
};

export interface Config {
  url: string;
  documentAri: string;
  userId: string;

  getUser?(
    userId: string,
  ): Promise<
    Pick<CollabParticipant, 'avatar' | 'email' | 'name'> & { userId: string }
  >;
}
