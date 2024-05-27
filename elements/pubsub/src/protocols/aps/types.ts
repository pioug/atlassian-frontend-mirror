import { type Message } from '../types';

export interface AccessDeniedMessage {
  type: 'CHANNEL_ACCESS_DENIED';
  payload?: any;
}

export type MessageData = Message | AccessDeniedMessage;
