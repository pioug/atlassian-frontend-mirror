import { type OptionData } from '@atlaskit/smart-user-picker';

import { type Comment } from './ShareEntities';
import { type User } from './User';

export type ShareContentState = {
	comment?: Comment;
	users: User[];
};

export type ShareError = {
	errorCode?: string;
	helpUrl?: string;
	message: string;
	retryable: boolean;
};

export type ShareData = {
	[key: string]: unknown;
	comment: Comment;
	users: OptionData[];
};
