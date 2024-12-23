import { type Conversation } from './Conversation';
import { type User } from './User';
export interface Comment extends Pick<Conversation, 'comments' | 'error'> {
	commentId: string;
	conversationId: string;
	parentId?: string;
	document: {
		// Ignored via go/ees005
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		adf?: any; // ADF
		md?: string;
		html?: string;
	};
	createdBy: User;
	createdAt: number;
	deleted?: boolean;
	state?: 'SUCCESS' | 'SAVING' | 'ERROR';
	localId?: string;
	oldDocument?: {
		// Old document - used for restoring state
		// Ignored via go/ees005
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		adf?: any; // ADF
		md?: string;
		html?: string;
	};
	isPlaceholder?: boolean; // Whether this has been generated as a placeholder comment
	commentAri?: string;
	nestedDepth?: number;
}
