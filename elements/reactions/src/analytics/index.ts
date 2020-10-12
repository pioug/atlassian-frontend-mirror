import {
  createAndFireEvent,
  AnalyticsEventPayload,
  CreateUIAnalyticsEvent,
} from '@atlaskit/analytics-next';
import {
  UI_EVENT_TYPE,
  OPERATIONAL_EVENT_TYPE,
  EventType,
} from '@atlaskit/analytics-gas-types';
import {
  name as packageName,
  version as packageVersion,
} from '../version.json';
import { ReactionSummary, ReactionSource } from '../types';

export type PreviousState = 'new' | 'existingNotReacted' | 'existingReacted';

export const createAndFireEventInElementsChannel = createAndFireEvent(
  'fabric-elements',
);

export const createAndFireSafe = <
  U extends any[],
  T extends (...args: U) => AnalyticsEventPayload
>(
  createAnalyticsEvent: CreateUIAnalyticsEvent | void,
  creator: T,
  ...args: U
) => {
  if (createAnalyticsEvent) {
    createAndFireEventInElementsChannel(creator(...args))(createAnalyticsEvent);
  }
};

const createPayload = (
  action: string,
  actionSubject: string,
  eventType: EventType,
  actionSubjectId?: string,
) => (attributes: { [key: string]: any }) => ({
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
  createPayload('succeeded', actionSubject, OPERATIONAL_EVENT_TYPE)({});

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

export const createReactionClickedEvent = (added: boolean, emojiId: string) =>
  createPayload(
    'clicked',
    'existingReaction',
    UI_EVENT_TYPE,
  )({
    added,
    emojiId,
  });
