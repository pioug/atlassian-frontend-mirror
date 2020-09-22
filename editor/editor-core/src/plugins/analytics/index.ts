import analyticsPlugin from './plugin';
import { analyticsPluginKey as pluginKey } from './plugin-key';

export {
  ACTION_SUBJECT_ID,
  ACTION_SUBJECT,
  ACTION,
  AnalyticsDispatch,
  AnalyticsEventPayload,
  AnalyticsEventPayloadWithChannel,
  ErrorEventPayload,
  EVENT_TYPE,
  FormatEventPayload,
  FULL_WIDTH_MODE,
  GeneralEventPayload,
  HistoryEventPayload,
  INDENT_DIRECTION,
  INDENT_TYPE,
  INPUT_METHOD,
  InputMethodInsertLink,
  InputMethodInsertMedia,
  InsertEventPayload,
  LINK_REPRESENTATION,
  LINK_RESOURCE,
  LINK_STATUS,
  CreateLinkInlineDialogActionType,
  CreateLinkInlineDialogEventPayload,
  MediaAltTextActionType,
  MediaEventPayload,
  MODE,
  PASTE_ACTION_SUBJECT_ID,
  PasteContent,
  PasteContents,
  PasteEventPayload,
  PasteSource,
  PasteSources,
  PasteType,
  PasteTypes,
  PLATFORMS,
  PUNC,
  SubstituteEventPayload,
  SYMBOL,
  TABLE_ACTION,
  TABLE_BREAKOUT,
  TableEventPayload,
  TRIGGER_METHOD,
  USER_CONTEXT,
  DELETE_DIRECTION,
  LIST_TEXT_SCENARIOS,
  CommonListAnalyticsAttributes,
} from './types';
export {
  withAnalytics,
  addAnalytics,
  findInsertLocation,
  getAnalyticsEventsFromTransaction,
  getSelectionType,
  getStateContext,
  ruleWithAnalytics,
} from './utils';

export const analyticsPluginKey = pluginKey;
export default analyticsPlugin;
export { fireAnalyticsEvent } from './fire-analytics-event';
export { FireAnalyticsEvent } from './fire-analytics-event';
export { FireAnalyticsCallback } from './fire-analytics-event';
export { HigherOrderCommand } from '../../types/command';
export { DispatchAnalyticsEvent } from './types/dispatch-analytics-event';
