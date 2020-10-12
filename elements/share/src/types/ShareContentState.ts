import { OptionData } from '@atlaskit/user-picker';
import { Comment } from './ShareEntities';
import { User } from './User';

export type ShareContentState = {
  users: User[];
  comment?: Comment;
};

export type ShareError = {
  message: string;
};

export type DialogContentState = {
  users: OptionData[];
  comment?: Comment;
};
