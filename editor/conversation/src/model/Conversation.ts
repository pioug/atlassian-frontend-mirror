import { type Comment } from './Comment';

export interface Conversation {
	conversationId: string;
	objectId: string;
	containerId?: string;
	localId?: string;
	comments?: Comment[];
	meta: {
		// Ignored via go/ees005
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		[key: string]: any;
	};
	error?: Error;
	isMain?: boolean;
}
