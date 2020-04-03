import analyticsPlugin from './plugin';
import { analyticsPluginKey as pluginKey } from './plugin-key';

export {
  ACTION,
  ACTION_SUBJECT,
  ACTION_SUBJECT_ID,
  AnalyticsDispatch,
  AnalyticsEventPayload,
  AnalyticsEventPayloadWithChannel,
  EVENT_TYPE,
  ErrorEventPayload,
  FULL_WIDTH_MODE,
  FormatEventPayload,
  GeneralEventPayload,
  HistoryEventPayload,
  INDENT_DIR,
  INDENT_TYPE,
  INPUT_METHOD,
  InputMethodInsertLink,
  InputMethodInsertMedia,
  InsertEventPayload,
  LINK_REPRESENTATION,
  LINK_RESOURCE,
  LINK_STATUS,
  MODE,
  MediaAltTextActionType,
  MediaEventPayload,
  PANEL_TYPE,
  PASTE_ACTION_SUBJECT_ID,
  PLATFORMS,
  PUNC,
  PasteContent,
  PasteContents,
  PasteEventPayload,
  PasteSource,
  PasteSources,
  PasteType,
  PasteTypes,
  SYMBOL,
  SubstituteEventPayload,
  TABLE_ACTION,
  TABLE_BREAKOUT,
  TableEventPayload,
  USER_CONTEXT,
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
