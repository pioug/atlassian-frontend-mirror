import {
  createAndFireEvent,
  type AnalyticsEventPayload,
  type CreateUIAnalyticsEvent,
} from '@atlaskit/analytics-next';
import {
  UI_EVENT_TYPE,
  OPERATIONAL_EVENT_TYPE,
  type EventType,
} from '@atlaskit/analytics-gas-types';
import { type ReactionSummary, type ReactionSource } from '../types';

const packageName = process.env._PACKAGE_NAME_ as string;
const packageVersion = process.env._PACKAGE_VERSION_ as string;

export type PreviousState = 'new' | 'existingNotReacted' | 'existingReacted';

/**
 * TODO: move to utility package?
 * A random sampling function
 * sampling algorithm is from @atlassian/jira-coinflip at https://stash.atlassian.com/projects/JIRACLOUD/repos/jira-frontend/browse/src/packages/platform/app-framework/coinflip/src/index.tsx
 * E.g. isSampled(2) will pass 50% of the time
 * @param rate The chance that it will pass (1 in <rate> times)
 * @returns bool, if it passes or not
 */
// default sampling function to determine which one to be sampled
export const isSampled = (rate: number) => {
  if (rate === 1) {
    return true;
  }
  if (rate === 0) {
    return false;
  }
  return Math.random() * rate <= 1;
};

export const createAndFireEventInElementsChannel =
  createAndFireEvent('fabric-elements');

export const createAndFireSafe = <
  U extends any[],
  T extends (...args: U) => AnalyticsEventPayload,
>(
  createAnalyticsEvent: CreateUIAnalyticsEvent | void,
  creator: T,
  ...args: U
) => {
  if (createAnalyticsEvent) {
    createAndFireEventInElementsChannel(creator(...args))(createAnalyticsEvent);
  }
};

const createPayload =
  (
    action: string,
    actionSubject: string,
    eventType: EventType,
    actionSubjectId?: string,
  ) =>
  (attributes: Record<string, any> = {}) => ({
    action,
    actionSubject,
    eventType,
    actionSubjectId,
    attributes: {
      ...attributes,
      packageName,
      packageVersion,
    },
  });

const calculateDuration = (startTime?: number) =>
  startTime ? Date.now() - startTime : undefined;

const getPreviousState = (reaction?: ReactionSummary): PreviousState => {
  if (reaction) {
    if (reaction.reacted) {
      return 'existingReacted';
    }
    return 'existingNotReacted';
  }
  return 'new';
};

export const createRestSucceededEvent = (actionSubject: string) =>
  createPayload('succeeded', actionSubject, OPERATIONAL_EVENT_TYPE)();

export const createRestFailedEvent = (
  actionSubject: string,
  errorCode?: number,
) =>
  createPayload(
    'failed',
    actionSubject,
    OPERATIONAL_EVENT_TYPE,
  )({
    errorCode,
  });

export const createReactionsRenderedEvent = (startTime: number) =>
  createPayload(
    'rendered',
    'reactionView',
    OPERATIONAL_EVENT_TYPE,
  )({
    duration: calculateDuration(startTime),
  });

export const createPickerButtonClickedEvent = (reactionEmojiCount: number) =>
  createPayload(
    'clicked',
    'reactionPickerButton',
    UI_EVENT_TYPE,
  )({
    reactionEmojiCount,
  });

export const createPickerCancelledEvent = (startTime?: number) =>
  createPayload(
    'cancelled',
    'reactionPicker',
    UI_EVENT_TYPE,
  )({
    duration: calculateDuration(startTime),
  });

export const createPickerMoreClickedEvent = (startTime?: number) =>
  createPayload(
    'clicked',
    'reactionPicker',
    UI_EVENT_TYPE,
    'more',
  )({
    duration: calculateDuration(startTime),
  });

export const createReactionSelectionEvent = (
  source: ReactionSource,
  emojiId: string,
  reaction?: ReactionSummary,
  startTime?: number,
) =>
  createPayload(
    'clicked',
    'reactionPicker',
    UI_EVENT_TYPE,
    'emoji',
  )({
    duration: calculateDuration(startTime),
    source,
    previousState: getPreviousState(reaction),
    emojiId,
  });

export const createReactionHoveredEvent = (startTime?: number) =>
  createPayload(
    'hovered',
    'existingReaction',
    UI_EVENT_TYPE,
  )({
    duration: calculateDuration(startTime),
  });

export const createReactionFocusedEvent = (startTime?: number) =>
  createPayload(
    'focused',
    'existingReaction',
    UI_EVENT_TYPE,
  )({
    duration: calculateDuration(startTime),
  });

export const createReactionClickedEvent = (added: boolean, emojiId: string) =>
  createPayload(
    'clicked',
    'existingReaction',
    UI_EVENT_TYPE,
  )({
    added,
    emojiId,
  });

/**
 * Used for store failure metadata for analytics
 * @param error The error could be a service error with {code, reason} or an Error
 * @returns any
 */
export const extractErrorInfo = (error: any) => {
  if (error instanceof Error) {
    return {
      name: error.name,
      message: error.message,
    };
  }
  return error;
};
