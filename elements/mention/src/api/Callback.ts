import { type MentionNameDetails } from '../types';

export interface Callback {
	(value: MentionNameDetails): void;
}
