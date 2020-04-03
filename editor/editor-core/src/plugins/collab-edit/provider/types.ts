import { ServiceConfig } from '@atlaskit/util-service-support';

import {
  CollabEventTelepointerData as TelepointerData,
  CollabParticipant as Participant,
} from '@atlaskit/editor-common';

export {
  CollabEvent,
  CollabEventData,
  CollabEditProvider,
} from '@atlaskit/editor-common';

export { TelepointerData, Participant };

export interface DocumentResponse {
  version: number;
  doc: any;
}

export interface StepResponse {
  version: number;
  steps: any[];
}

export type MixedResponse = DocumentResponse & StepResponse;

export interface Config extends ServiceConfig {
  docId: string;
  userId: string;
}

/**
 * Same as PubSub client types (don't want a direct dep though)
 */

export type ARI = string;
export type AVI = string;

export interface PubSubOnEvent<T = any> {
  (event: string, data: T): void;
}

export interface PubSubClient {
  on(eventAvi: string, listener: PubSubOnEvent): PubSubClient;

  off(eventAvi: string, listener: PubSubOnEvent): PubSubClient;

  join(aris: ARI[]): Promise<PubSubClient>;

  leave(aris: ARI[]): Promise<PubSubClient>;
}

export enum PubSubSpecialEventType {
  ERROR = 'ERROR',
  CONNECTED = 'CONNECTED',
  RECONNECT = 'RECONNECT',
}
