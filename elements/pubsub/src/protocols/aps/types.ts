import { type Message } from '../types';

export interface AccessDeniedMessage {
	payload?: any;
	type: 'CHANNEL_ACCESS_DENIED';
}

export type MessageData = Message | AccessDeniedMessage;
