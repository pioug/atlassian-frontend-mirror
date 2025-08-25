import { type Conversation } from './Conversation';
import { type User } from './User';
export interface Comment extends Pick<Conversation, 'comments' | 'error'> {
	commentAri?: string;
	commentId: string;
	conversationId: string;
	createdAt: number;
	createdBy: User;
	deleted?: boolean;
	document: {
		// Ignored via go/ees005
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		adf?: any; // ADF
		html?: string;
		md?: string;
	};
	isPlaceholder?: boolean; // Whether this has been generated as a placeholder comment
	localId?: string;
	nestedDepth?: number;
	oldDocument?: {
		// Old document - used for restoring state
		// Ignored via go/ees005
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		adf?: any; // ADF
		html?: string;
		md?: string;
	};
	parentId?: string;
	state?: 'SUCCESS' | 'SAVING' | 'ERROR';
}
