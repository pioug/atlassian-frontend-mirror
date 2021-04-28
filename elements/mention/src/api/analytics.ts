import { RecommendationItem } from './SmartMentionTypes';
import { MentionContextIdentifier } from '../types';

export const SMART_EVENT_TYPE = 'smart';

export enum Actions {
  REQUESTED = 'requested',
  SUCCESSFUL = 'successful',
  SEARCHED = 'searched',
  FAILED = 'failed',
}

export const defaultAttributes: any = (context: MentionContextIdentifier) => {
  return {
    context: context.objectId,
    sessionId: context.sessionId,
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
