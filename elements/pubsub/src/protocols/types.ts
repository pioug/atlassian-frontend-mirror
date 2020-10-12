import { AVI, ProtocolConfig } from '../types';

export enum ConnectionState {
  CONNECTING = 'CONNECTING',
  CONNECTED = 'CONNECTED',
  ACCESS_DENIED = 'ACCESS_DENIED',
  CANT_CONNECT = 'CANT_CONNECT',
  SUSPENDED = 'SUSPENDED',
  OFFLINE = 'OFFLINE',
}

export interface PubNubProtocolConfig extends ProtocolConfig {
  type: string;
  authKey: string;
  subscribeKey: string;
  userUuid: string;
  channels: string[];
  channelGroups: string[];
  filterExpression: string;
}

export interface PubNubPayload {
  version: string;
  messages: Message[];
}

export interface Message {
  type: AVI;
  time: number;
  payload: any;
}
