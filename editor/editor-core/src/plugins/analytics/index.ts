import analyticsPlugin from './plugin';
import { analyticsPluginKey as pluginKey } from './plugin-key';

export {
  ACTION_SUBJECT_ID,
  ACTION_SUBJECT,
  ACTION,
  BROWSER_FREEZE_INTERACTION_TYPE,
  EVENT_TYPE,
  FULL_WIDTH_MODE,
  INDENT_DIRECTION,
  INDENT_TYPE,
  INPUT_METHOD,
  LINK_REPRESENTATION,
  LINK_RESOURCE,
  LINK_STATUS,
  MODE,
  PasteContents,
  PasteSources,
  PasteTypes,
  PLATFORMS,
  PUNC,
  SYMBOL,
  TABLE_ACTION,
  TABLE_BREAKOUT,
  TRIGGER_METHOD,
  USER_CONTEXT,
  DELETE_DIRECTION,
  LIST_TEXT_SCENARIOS,
} from './types';
export type {
  AnalyticsDispatch,
  AnalyticsEventPayload,
  AnalyticsEventPayloadWithChannel,
  CommonListAnalyticsAttributes,
  CreateLinkInlineDialogActionType,
  CreateLinkInlineDialogEventPayload,
  ErrorEventPayload,
  FormatEventPayload,
  GeneralEventPayload,
  InputMethodInsertLink,
  InputMethodInsertMedia,
  InsertEventPayload,
  MediaAltTextActionType,
  MediaEventPayload,
  MediaLinkAEP,
  PASTE_ACTION_SUBJECT_ID,
  PasteContent,
  PasteEventPayload,
  PasteSource,
  PasteType,
  SubstituteEventPayload,
  TableEventPayload,
} from './types';
export {
  withAnalytics,
  addAnalytics,
  findInsertLocation,
  getAnalyticsEventsFromTransaction,
  getSelectionType,
  getStateContext,
  mapActionSubjectIdToAttributes,
} from './utils';

export const analyticsPluginKey = pluginKey;
export default analyticsPlugin;
export { fireAnalyticsEvent } from './fire-analytics-event';
export type { FireAnalyticsEvent } from './fire-analytics-event';
export type { FireAnalyticsCallback } from './fire-analytics-event';
export type { HigherOrderCommand } from '../../types/command';
export type { DispatchAnalyticsEvent } from './types/dispatch-analytics-event';
