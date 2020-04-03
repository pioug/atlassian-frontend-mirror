import { Conversation } from './Conversation';
import { User } from './User';
export interface Comment extends Pick<Conversation, 'comments' | 'error'> {
  commentId: string;
  conversationId: string;
  parentId?: string;
  document: {
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
    adf?: any; // ADF
    md?: string;
    html?: string;
  };
  isPlaceholder?: boolean; // Whether this has been generated as a placeholder comment
  commentAri?: string;
  nestedDepth?: number;
}
