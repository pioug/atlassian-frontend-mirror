import {
  createAndFireEvent,
  AnalyticsEventPayload,
} from '@atlaskit/analytics-next';
import { v4 as uuidv4 } from 'uuid';
import { name as packageName, version as packageVersion } from './version.json';
import { Option, OptionData, UserPickerProps, UserPickerState } from './types';
import { isExternalUser } from './components/utils';

const UUID_REGEXP_TEAMS_GROUPS = /^[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12}$/;
const UUID_REGEXP_OLD_AAID = /^[a-fA-F0-9]{1,8}:[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12}$/;
const UUID_REGEXP_NEW_AAID = /^[a-fA-F0-9]{24,24}$/;

export type UserPickerSession = {
  id: string;
  start: number;
  inputChangeTime: number;
  upCount: number;
  downCount: number;
  lastKey?: number;
};

export const startSession = (): UserPickerSession => ({
  id: uuidv4(),
  start: Date.now(),
  inputChangeTime: Date.now(),
  upCount: 0,
  downCount: 0,
  lastKey: undefined,
});

export const createAndFireEventInElementsChannel = createAndFireEvent(
  'fabric-elements',
);

const createEvent = (
  eventType: 'ui' | 'operational',
  action: string,
  actionSubject: string,
  attributes = {},
): AnalyticsEventPayload => ({
  eventType,
  action,
  actionSubject,
  attributes: {
    packageName,
    packageVersion,
    ...attributes,
  },
});

const checkValidId = (id: string) => {
  return (
    UUID_REGEXP_NEW_AAID.test(id) ||
    UUID_REGEXP_OLD_AAID.test(id) ||
    UUID_REGEXP_TEAMS_GROUPS.test(id)
  );
};

const optionData2Analytics = (option: OptionData) => {
  const { id, type } = option;
  // id's of email types are emails which is PII
  const validatedData = {
    id: checkValidId(id) ? id : null,
    type: type || null,
  };
  if (isExternalUser(option)) {
    return {
      ...validatedData,
      type: 'external_user',
      sources: option.sources,
      externalUserType: option.externalUserType,
    };
  } else {
    return validatedData;
  }
};
const buildValueForAnalytics = (value?: Option[] | Option | null) => {
  if (value) {
    const valueToConvert = Array.isArray(value) ? value : [value];
    return valueToConvert.map(({ data }) => optionData2Analytics(data));
  }

  return [];
};

export interface EventCreator {
  (
    props: UserPickerProps,
    state: UserPickerState,
    session?: UserPickerSession,
  ): AnalyticsEventPayload;
  (
    props: UserPickerProps,
    state: UserPickerState,
    session?: UserPickerSession,
    ...args: any[]
  ): AnalyticsEventPayload;
}

const createDefaultPickerAttributes = (
  props: UserPickerProps,
  session?: UserPickerSession,
  journeyId?: string,
) => ({
  context: props.fieldId,
  sessionId: sessionId(session),
  pickerType: pickerType(props),
  journeyId,
});

export const focusEvent: EventCreator = (
  props: UserPickerProps,
  state: UserPickerState,
  session?: UserPickerSession,
  journeyId?: string,
) =>
  createEvent('ui', 'focused', 'userPicker', {
    ...createDefaultPickerAttributes(props, session, journeyId),
    values: buildValueForAnalytics(state.value),
  });

export const clearEvent: EventCreator = (
  props: UserPickerProps,
  state: UserPickerState,
  session?: UserPickerSession,
  journeyId?: string,
) =>
  createEvent('ui', 'cleared', 'userPicker', {
    ...createDefaultPickerAttributes(props, session, journeyId),
    pickerOpen: state.menuIsOpen,
    values: values(state),
  });

export const deleteEvent: EventCreator = (
  props: UserPickerProps,
  state: UserPickerState,
  session?: UserPickerSession,
  journeyId?: string,
  ...args: any[]
) =>
  createEvent('ui', 'deleted', 'userPickerItem', {
    context: props.fieldId,
    sessionId: sessionId(session),
    journeyId,
    value: optionData2Analytics(args[0]),
    pickerOpen: state.menuIsOpen,
  });

export const cancelEvent: EventCreator = (
  props: UserPickerProps,
  _: UserPickerState,
  session?: UserPickerSession,
  journeyId?: string,
  ...args: any[]
) =>
  createEvent('ui', 'cancelled', 'userPicker', {
    ...createDefaultPickerAttributes(props, session, journeyId),
    sessionDuration: sessionDuration(session),
    queryLength: queryLength(args[0]),
    spaceInQuery: spaceInQuery(args[0]),
    upKeyCount: upKeyCount(session),
    downKeyCount: downKeyCount(session),
  });

export const selectEvent: EventCreator = (
  props: UserPickerProps,
  state: UserPickerState,
  session?: UserPickerSession,
  journeyId?: string,
  ...args: any[]
) => {
  return createEvent('ui', selectEventType(session), 'userPicker', {
    ...createDefaultPickerAttributes(props, session, journeyId),
    sessionDuration: sessionDuration(session),
    position: position(state, args[0]),
    queryLength: queryLength(state),
    spaceInQuery: spaceInQuery(state),
    upKeyCount: upKeyCount(session),
    downKeyCount: downKeyCount(session),
    result: result(args[0]),
  });
};

export const searchedEvent: EventCreator = (
  props: UserPickerProps,
  state: UserPickerState,
  session?: UserPickerSession,
  journeyId?: string,
) => {
  const searchResults = results(state);
  return createEvent('operational', 'searched', 'userPicker', {
    ...createDefaultPickerAttributes(props, session, journeyId),
    sessionDuration: sessionDuration(session),
    durationSinceInputChange: durationSinceInputChange(session),
    queryLength: queryLength(state),
    isLoading: isLoading(props, state),
    results: searchResults,
    numberOfResults: searchResults.length,
  });
};

export const failedEvent: EventCreator = (
  props: UserPickerProps,
  _: UserPickerState,
  session?: UserPickerSession,
  journeyId?: string,
) =>
  createEvent('operational', 'failed', 'userPicker', {
    ...createDefaultPickerAttributes(props, session, journeyId),
  });

export const userInfoEvent = (
  sources: string[],
  accountId: string,
): AnalyticsEventPayload =>
  createEvent('ui', 'displayed', 'userInfo', {
    sources,
    // accountId can be PII if it is an email so check that it's an AAID first
    accountId: checkValidId(accountId) ? accountId : null,
  });

function queryLength(state: UserPickerState) {
  return state.inputValue.length;
}

function selectEventType(session?: UserPickerSession): string {
  return session && session.lastKey === 13 ? 'pressed' : 'clicked';
}

function upKeyCount(session?: UserPickerSession) {
  return session ? session.upCount : null;
}

function downKeyCount(session?: UserPickerSession) {
  return session ? session.downCount : null;
}

function spaceInQuery(state: UserPickerState) {
  return state.inputValue.indexOf(' ') !== -1;
}

function sessionDuration(session?: UserPickerSession) {
  return session ? Date.now() - session.start : null;
}

function durationSinceInputChange(session?: UserPickerSession) {
  return session ? Date.now() - session.inputChangeTime : null;
}

function sessionId(session?: UserPickerSession) {
  return session && session.id;
}

function position(state: UserPickerState, value?: Option) {
  return value
    ? state.options.findIndex((option) => option === value.data)
    : -1;
}

function pickerType(props: UserPickerProps) {
  return props.isMulti ? 'multi' : 'single';
}

function result(option?: Option) {
  return option ? optionData2Analytics(option.data) : null;
}

function results(state: UserPickerState) {
  return (state.options || []).map(optionData2Analytics);
}

function isLoading(props: UserPickerProps, state: UserPickerState) {
  return state.count > 0 || props.isLoading;
}

function values(state: UserPickerState) {
  return state.value
    ? Array.isArray(state.value)
      ? state.value.map((option) => optionData2Analytics(option.data))
      : [optionData2Analytics(state.value.data)]
    : [];
}
