import { type OptionData } from '@atlaskit/smart-user-picker';

import { type Comment } from './ShareEntities';
import { type User } from './User';

export type ShareContentState = {
	users: User[];
	comment?: Comment;
};

export type ShareError = {
	message: string;
	errorCode?: string;
	helpUrl?: string;
	retryable: boolean;
};

export type ShareData = {
	users: OptionData[];
	comment: Comment;
};
