import { Comment } from './ShareEntities';
import { ValueType } from '@atlaskit/select';

export type ShareToSlackResponse = {
  ok: boolean;
};

export type Team = {
  avatarUrl: string;
  label: string;
  value: string;
};

export type Conversation = {
  label: string;
  value: string;
};

export type SlackTeamsResponse = Array<Team>;

export type SlackTeamsServiceResponse = {
  teams: Array<Workspace>;
};

export type ChannelAndUser = {
  value: string;
  label: string;
};

export type SlackConversationsResponse = Array<{
  label: string;
  options: Array<ChannelAndUser>;
}>;

export type SlackConversationsServiceResponse = {
  channels: Array<Channel>;
  dms: Array<SlackUser>;
};

export type SelectOption = {
  label: string;
  value: string;
};

export type SlackContentState = {
  team: ValueType<Team>;
  conversation: ValueType<Conversation>;
  comment?: Comment;
};

export type Channel = {
  id: string;
  name: string;
  type: string;
};

export type SlackUser = {
  id: string;
  name: string;
  displayName: string;
  type: string;
};

export type Workspace = {
  id: string;
  name: string;
  avatar: string;
};
