import uuid from 'uuid/v4';
import {
  createAndFireEvent,
  AnalyticsEventPayload,
} from '@atlaskit/analytics-next';
import { name as packageName, version as packageVersion } from './version.json';
import {
  AtlaskitSelectValue,
  ContainerPickerProps,
  ContainerPickerState,
  ContainerOptionValue,
  ContainerOption,
} from './types';

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

export type Session = {
  id: string;
  start: number;
  inputChangeTime: number;
};

export const startSession = (): Session => ({
  id: uuid(),
  start: window.performance.now(),
  inputChangeTime: window.performance.now(),
});

const optionData2Analytics = ({ id, type }: ContainerOptionValue) => ({
  id,
  type,
});

const buildValueForAnalytics = (value?: AtlaskitSelectValue) => {
  if (value) {
    const valueToConvert = Array.isArray(value) ? value : [value];
    return valueToConvert.map(({ value }) => optionData2Analytics(value));
  }

  return [];
};

export interface EventCreator {
  (
    props: ContainerPickerProps,
    state: ContainerPickerState,
    session?: Session,
    journeyId?: string,
    ...args: any[]
  ): AnalyticsEventPayload;
  (
    props: ContainerPickerProps,
    state: ContainerPickerState,
    session?: Session,
    journeyId?: string,
    ...args: any[]
  ): AnalyticsEventPayload;
}

const createDefaultPickerAttributes = (
  props: ContainerPickerProps,
  state: ContainerPickerState,
  session?: Session,
  journeyId?: string,
) => ({
  context: props.contextType,
  isMulti: props.isMulti,
  journeyId,
  maxOptions: props.maxOptions,
  maxRequestOptions: props.maxRequestOptions,
  product: props.product,
  principalId: props.principalId,
  queryLength: (state.inputValue || '').length,
  sessionId: getSessionId(session),
  siteId: props.cloudId,
});

export const focusEvent: EventCreator = (
  props: ContainerPickerProps,
  state: ContainerPickerState,
  session?: Session,
  journeyId?: string,
) =>
  createEvent('ui', 'focused', 'containerPicker', {
    ...createDefaultPickerAttributes(props, state, session, journeyId),
    values: buildValueForAnalytics(state.value),
  });

export const cancelEvent: EventCreator = (
  props: ContainerPickerProps,
  state: ContainerPickerState,
  session?: Session,
  journeyId?: string,
  ...args: any[]
) =>
  createEvent('ui', 'cancelled', 'containerPicker', {
    ...createDefaultPickerAttributes(props, state, session, journeyId),
    sessionDuration: sessionDuration(session),
  });

export const selectEvent: EventCreator = (
  props: ContainerPickerProps,
  state: ContainerPickerState,
  session?: Session,
  journeyId?: string,
  ...args: any[]
) =>
  createEvent('ui', 'selected', 'containerPicker', {
    ...createDefaultPickerAttributes(props, state, session, journeyId),
    sessionDuration: sessionDuration(session),
    position: position(state, args[0]),
    result: result(args[0]),
  });

export const searchedEvent: EventCreator = (
  props: ContainerPickerProps,
  state: ContainerPickerState,
  session?: Session,
  journeyId?: string,
) =>
  createEvent('operational', 'searched', 'containerPicker', {
    ...createDefaultPickerAttributes(props, state, session, journeyId),
    sessionDuration: sessionDuration(session),
    durationSinceInputChange: durationSinceInputChange(session),
    isLoading: isLoading(props, state),
    results: results(state),
  });

export const requestContainersEvent: EventCreator = (
  props: ContainerPickerProps,
  state: ContainerPickerState,
  session?: Session,
  journeyId?: string,
  attributes: any = {},
) =>
  createEvent('operational', 'requested', 'containers', {
    ...createDefaultPickerAttributes(props, state, session, journeyId),
    ...attributes,
  });

export const successfulRequestContainersEvent: EventCreator = (
  props: ContainerPickerProps,
  state: ContainerPickerState,
  session?: Session,
  journeyId?: string,
  attributes: any = {},
) =>
  createEvent('operational', 'successful', 'containersRequest', {
    ...createDefaultPickerAttributes(props, state, session, journeyId),
    results: results(state),
    ...attributes,
  });

export const failedRequestContainersEvent: EventCreator = (
  props: ContainerPickerProps,
  state: ContainerPickerState,
  session?: Session,
  journeyId?: string,
  attributes: any = {},
) =>
  createEvent('operational', 'failed', 'containersRequest', {
    ...createDefaultPickerAttributes(props, state, session, journeyId),
    ...attributes,
  });

export function getSessionId(session?: Session) {
  return session && session.id;
}

function sessionDuration(session?: Session) {
  return session ? window.performance.now() - session.start : null;
}

function durationSinceInputChange(session?: Session) {
  return session ? window.performance.now() - session.inputChangeTime : null;
}

function position(state: ContainerPickerState, value?: ContainerOption) {
  return value
    ? state.options.findIndex((option) => option.value.id === value.value.id)
    : -1;
}

function result(option?: ContainerOption) {
  return option ? optionData2Analytics(option.value) : null;
}

function results(state: ContainerPickerState) {
  return (state.options || []).map((option) =>
    optionData2Analytics(option.value),
  );
}

function isLoading(props: ContainerPickerProps, state: ContainerPickerState) {
  return state.loading || props.isLoading;
}
