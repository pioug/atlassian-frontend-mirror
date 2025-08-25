import { type Comment } from './Comment';

export interface Conversation {
	comments?: Comment[];
	containerId?: string;
	conversationId: string;
	error?: Error;
	isMain?: boolean;
	localId?: string;
	meta: {
		// Ignored via go/ees005
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		[key: string]: any;
	};
	objectId: string;
}
