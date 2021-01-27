import { GasCorePayload } from '@atlaskit/analytics-gas-types';

import { MediaType, MediaFeatureFlags } from './';

// Base Media Analytics Event Shape
export type BaseAttributes = {
  packageName: string;
  packageVersion: string;
  componentName: string;
};

export type BaseEventPayload<
  Attributes extends BaseAttributes
> = GasCorePayload & {
  attributes: Attributes;
  featureFlags?: MediaFeatureFlags;
};

// Base Attributes ...

export type FileAttributes = {
  fileId: string;
  fileSize?: number;
  fileMediatype?: MediaType;
  fileMimetype?: string;
  fileSource?: string;
  fileStatus?:
    | 'uploading'
    | 'processing'
    | 'processed'
    | 'error'
    | 'failed-processing';
};

export type SuccessAttributes = {
  status: 'success';
};

export type FailureAttributes = {
  status: 'fail';
  failReason: string;
  error?: string;
};

export type StatusAttributes = SuccessAttributes | FailureAttributes;

// Operational Events ...
// https://hello.atlassian.net/wiki/spaces/MEASURE/pages/134329315/Operational+Events

export type OperationalAttributes =
  | BaseAttributes
  | (BaseAttributes & FileAttributes)
  | (BaseAttributes & FileAttributes & StatusAttributes);

export type OperationalEventPayload<
  Attributes extends OperationalAttributes,
  Action extends string,
  ActionSubject extends string
> = BaseEventPayload<Attributes> & {
  eventType: 'operational';
  action: Action;
  actionSubject: ActionSubject;
  actionSubjectId?: string;
};

// UI Events ...
// https://hello.atlassian.net/wiki/spaces/MEASURE/pages/134329336/UI+Events

export type UIAttributes = BaseAttributes;

export type UIEventPayload<
  Attributes extends UIAttributes,
  Action extends string,
  ActionSubject extends string
> = BaseEventPayload<Attributes> & {
  eventType: 'ui';
  action: Action;
  actionSubject: ActionSubject;
  actionSubjectId?: string;
};

// Screen Events ...
// https://hello.atlassian.net/wiki/spaces/MEASURE/pages/134329341/Screen+Events

export type ScreenAttributes = BaseAttributes;

export type ScreenEventPayload<
  Attributes extends ScreenAttributes
> = BaseEventPayload<Attributes> & {
  eventType: 'screen';
};

// Track Events ...
// https://hello.atlassian.net/wiki/spaces/MEASURE/pages/134329319/Track+Events

export type TrackAttributes = BaseAttributes;

export type TrackEventPayload<
  Attributes extends TrackAttributes
> = BaseEventPayload<Attributes> & {
  eventType: 'track';
};
