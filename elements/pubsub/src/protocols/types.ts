import { type AVI, type ProtocolConfig } from '../types';

export interface Message {
	payload: any;
	sequenceNumber: number;
	type: AVI;
}
export interface APSProtocolConfig extends ProtocolConfig {
	channels: string[];
	type: string;
}
