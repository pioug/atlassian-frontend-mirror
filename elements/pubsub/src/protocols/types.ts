import { type AVI, type ProtocolConfig } from '../types';

export interface Message {
	type: AVI;
	sequenceNumber: number;
	payload: any;
}
export interface APSProtocolConfig extends ProtocolConfig {
	type: string;
	channels: string[];
}
