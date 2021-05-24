import { RecommendationItem } from './SmartMentionTypes';
import { MentionContextIdentifier } from '../types';

export const SMART_EVENT_TYPE = 'smart';

export enum Actions {
  REQUESTED = 'requested',
  SUCCESSFUL = 'successful',
  SEARCHED = 'searched',
  FAILED = 'failed',
  SELECTED = 'selected',
}
export type DefaultAttributes = {
  [key: string]: any;
  context: string;
  sessionId: string;
  pickerType: 'mentions';
  source: 'smarts';
};

export const defaultAttributes = (
  context?: MentionContextIdentifier,
): DefaultAttributes => {
  return {
    context: context?.objectId || '',
    sessionId: context?.sessionId || '',
    pickerType: 'mentions',
    source: 'smarts',
  };
};
export const getUsersForAnalytics = (users: RecommendationItem[]) => {
  return users
    ? users.map(({ id, entityType }) => ({
        id,
        type: entityType.toLowerCase(),
      }))
    : [];
};
