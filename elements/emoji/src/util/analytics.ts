import {
  createAndFireEvent,
  AnalyticsEventPayload,
  CreateUIAnalyticsEvent,
} from '@atlaskit/analytics-next';
import { EmojiDescription } from '../types';
import {
  name as packageName,
  version as packageVersion,
} from '../version.json';

export const createAndFireEventInElementsChannel = createAndFireEvent(
  'fabric-elements',
);

const createEvent = (
  eventType: 'ui' | 'operational',
  action: string,
  actionSubject: string,
  actionSubjectId?: string,
  attributes = {},
): AnalyticsEventPayload => ({
  eventType,
  action,
  actionSubject,
  actionSubjectId,
  attributes: {
    packageName,
    packageVersion,
    ...attributes,
  },
});

export type EmojiInsertionAnalytic = (
  source: 'picker' | 'typeahead',
) => AnalyticsEventPayload;

export const insertionSucceeded: EmojiInsertionAnalytic = (source) =>
  createEvent('operational', 'succeeded', 'recordEmojiSelection', undefined, {
    source,
  });

export const insertionFailed: EmojiInsertionAnalytic = (source) =>
  createEvent('operational', 'failed', 'recordEmojiSelection', undefined, {
    source,
  });

interface Duration {
  duration: number;
}

const emojiPickerEvent = (
  action: string,
  attributes = {},
  actionSubjectId?: string,
) => createEvent('ui', action, 'emojiPicker', actionSubjectId, attributes);

export const openedPickerEvent = () => emojiPickerEvent('opened');

export const closedPickerEvent = (attributes: Duration) =>
  emojiPickerEvent('closed', attributes);

interface EmojiAttributes {
  emojiId: string;
  baseEmojiId?: string; // mobile only
  skinToneModifier?: string;
  category: string;
  type: string;
}

const skinTones = [
  { id: '-1f3fb', skinToneModifier: 'light' },
  { id: '-1f3fc', skinToneModifier: 'mediumLight' },
  { id: '-1f3fd', skinToneModifier: 'medium' },
  { id: '-1f3fe', skinToneModifier: 'mediumDark' },
  { id: '-1f3ff', skinToneModifier: 'dark' },
];

const getSkinTone = (emojiId?: string) => {
  if (!emojiId) {
    return {};
  }
  for (const { id, skinToneModifier } of skinTones) {
    if (emojiId.indexOf(id) !== -1) {
      return { skinToneModifier, baseEmojiId: emojiId.replace(id, '') };
    }
  }

  return {};
};

export const pickerClickedEvent = (
  attributes: { queryLength: number } & EmojiAttributes & Duration,
) =>
  emojiPickerEvent(
    'clicked',
    {
      ...getSkinTone(attributes.emojiId),
      ...attributes,
    },
    'emoji',
  );

export const categoryClickedEvent = (attributes: { category: string }) =>
  emojiPickerEvent('clicked', attributes, 'category');

export const pickerSearchedEvent = (attributes: {
  queryLength: number;
  numMatches: number;
}) => emojiPickerEvent('searched', attributes, 'query');

const skintoneSelectorEvent = (action: string, attributes = {}) =>
  createEvent('ui', action, 'emojiSkintoneSelector', undefined, attributes);

export const toneSelectedEvent = (attributes: { skinToneModifier: string }) =>
  skintoneSelectorEvent('clicked', attributes);

export const toneSelectorOpenedEvent = (attributes: {
  skinToneModifier?: string;
}) => skintoneSelectorEvent('opened', attributes);

export const toneSelectorClosedEvent = () => skintoneSelectorEvent('cancelled');

const emojiUploaderEvent = (
  action: string,
  actionSubjectId?: string,
  attributes?: any,
) => createEvent('ui', action, 'emojiUploader', actionSubjectId, attributes);

export const uploadBeginButton = () =>
  emojiUploaderEvent('clicked', 'addButton');

export const uploadConfirmButton = (attributes: { retry: boolean }) =>
  emojiUploaderEvent('clicked', 'confirmButton', attributes);

export const uploadCancelButton = () =>
  emojiUploaderEvent('clicked', 'cancelButton');

export const uploadSucceededEvent = (attributes: Duration) =>
  createEvent(
    'operational',
    'finished',
    'emojiUploader',
    undefined,
    attributes,
  );

export const uploadFailedEvent = (attributes: { reason: string } & Duration) =>
  createEvent('operational', 'failed', 'emojiUploader', undefined, attributes);

interface EmojiId {
  emojiId?: string;
}

export const deleteBeginEvent = (attributes: EmojiId) =>
  createEvent('ui', 'clicked', 'emojiPicker', 'deleteEmojiTrigger', attributes);

export const deleteConfirmEvent = (attributes: EmojiId) =>
  createEvent('ui', 'clicked', 'emojiPicker', 'deleteEmojiConfirm', attributes);

export const deleteCancelEvent = (attributes: EmojiId) =>
  createEvent('ui', 'clicked', 'emojiPicker', 'deleteEmojiCancel', attributes);

export const selectedFileEvent = () =>
  createEvent('ui', 'clicked', 'emojiUploader', 'selectFile');

interface CommonAttributes {
  queryLength: number;
  spaceInQuery: boolean;
  emojiIds: string[];
}

const extractCommonAttributes = (
  query?: string,
  emojiList?: EmojiDescription[],
): CommonAttributes => {
  return {
    queryLength: query ? query.length : 0,
    spaceInQuery: query ? query.indexOf(' ') !== -1 : false,
    emojiIds: emojiList
      ? emojiList
          .map((emoji) => emoji.id!)
          .filter(Boolean)
          .slice(0, 20)
      : [],
  };
};

export const typeaheadCancelledEvent = (
  duration: number,
  query?: string,
  emojiList?: EmojiDescription[],
) =>
  createEvent('ui', 'cancelled', 'emojiTypeahead', undefined, {
    duration,
    ...extractCommonAttributes(query, emojiList),
  });

const getPosition = (
  emojiList: EmojiDescription[] | undefined,
  selectedEmoji: EmojiDescription,
): number | undefined => {
  if (emojiList) {
    const index = emojiList.findIndex((emoji) => emoji.id === selectedEmoji.id);
    return index === -1 ? undefined : index;
  }
  return;
};

export const typeaheadSelectedEvent = (
  pressed: boolean,
  duration: number,
  emoji: EmojiDescription,
  emojiList?: EmojiDescription[],
  query?: string,
  exactMatch?: boolean,
) =>
  createEvent(
    'ui',
    pressed ? 'pressed' : 'clicked',
    'emojiTypeahead',
    undefined,
    {
      duration,
      position: getPosition(emojiList, emoji),
      ...extractCommonAttributes(query, emojiList),
      ...getSkinTone(emoji.id),
      emojiType: emoji.type,
      exactMatch: exactMatch || false,
    },
  );

export const typeaheadRenderedEvent = (
  duration: number,
  query?: string,
  emojiList?: EmojiDescription[],
) =>
  createEvent('operational', 'rendered', 'emojiTypeahead', undefined, {
    duration,
    ...extractCommonAttributes(query, emojiList),
  });

export const recordSelectionSucceededSli = (options?: {
  createAnalyticsEvent?: CreateUIAnalyticsEvent;
}) => () => {
  if (options && options.createAnalyticsEvent) {
    createAndFireEvent('editor')(insertionSucceeded('typeahead'))(
      options.createAnalyticsEvent,
    );
  }
};

export const recordSelectionFailedSli = (options?: {
  createAnalyticsEvent?: CreateUIAnalyticsEvent;
}) => (err: Error) => {
  if (options && options.createAnalyticsEvent) {
    createAndFireEvent('editor')(insertionFailed('typeahead'))(
      options.createAnalyticsEvent,
    );
  }
  return Promise.reject(err);
};
