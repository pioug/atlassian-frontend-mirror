import { GasCorePayload } from '@atlaskit/analytics-gas-types';
import { MEDIA_CONTEXT } from '@atlaskit/analytics-namespaced-context/MediaAnalyticsContext';

import { MediaType, FileStatus, WithMediaFeatureFlags } from '..';

// Base Media Analytics Event Shape
export type BaseAttributes = {};

export type PackageAttributes = {
  packageName: string;
  packageVersion: string;
  componentName: string;
  // duplicate of "componentName" (used by some teams for computing "componentHierarchy")
  component: string;
};

export type BaseEventPayload<Attributes extends BaseAttributes> = Omit<
  GasCorePayload,
  'attributes'
> & {
  attributes: Attributes;
};

// Base Attributes ...

export type FileAttributes = {
  fileId: string;
  fileSize?: number;
  fileMediatype?: MediaType;
  fileMimetype?: string;
  fileSource?: string;
  fileStatus?: FileStatus;
};

export type PerformanceAttributes = {
  overall: {
    durationSincePageStart: number;
    durationSinceCommenced?: number;
  };
};

export type WithFileAttributes = {
  fileAttributes: FileAttributes;
};

export type WithPerformanceAttributes = {
  performanceAttributes?: PerformanceAttributes;
};

export type SuccessAttributes = {
  status: 'success';
};

export type FailureAttributes = {
  status: 'fail';
  failReason: string;
  error?: string;
  errorDetail?: string;
};

export type StatusAttributes = SuccessAttributes | FailureAttributes;

// Operational Events ...
// https://hello.atlassian.net/wiki/spaces/MEASURE/pages/134329315/Operational+Events

export type OperationalAttributes =
  | BaseAttributes
  | (BaseAttributes & WithFileAttributes)
  | (BaseAttributes & WithFileAttributes & StatusAttributes)
  | (BaseAttributes &
      WithFileAttributes &
      StatusAttributes &
      WithPerformanceAttributes);

export type OperationalEventPayload<
  Attributes extends OperationalAttributes,
  Action extends string,
  ActionSubject extends string,
  ActionSubjectId extends string = string
> = BaseEventPayload<Attributes> & {
  eventType: 'operational';
  action: Action;
  actionSubject: ActionSubject;
  actionSubjectId?: ActionSubjectId;
};

// UI Events ...
// https://hello.atlassian.net/wiki/spaces/MEASURE/pages/134329336/UI+Events

export type UIAttributes =
  | BaseAttributes
  | (BaseAttributes & WithFileAttributes);

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

export type ScreenAttributes =
  | BaseAttributes
  | (BaseAttributes & WithFileAttributes);

export type ScreenEventPayload<
  Attributes extends ScreenAttributes,
  ActionSubject extends string
> = BaseEventPayload<Attributes> & {
  eventType: 'screen';
  // TODO BMPT-1130: evaluate if we can use actionSubject only (duplicate), at the cost of a breaking change
  actionSubject: ActionSubject;
  name: ActionSubject;
};

// Track Events ...
// https://hello.atlassian.net/wiki/spaces/MEASURE/pages/134329319/Track+Events

export type TrackAttributes =
  | BaseAttributes
  | (BaseAttributes & WithFileAttributes);

export type TrackEventPayload<
  Attributes extends TrackAttributes,
  Action extends string,
  ActionSubject extends string,
  ActionSubjectId extends string = string
> = BaseEventPayload<Attributes> & {
  eventType: 'track';
  action: Action;
  actionSubject: ActionSubject;
  actionSubjectId?: ActionSubjectId;
};

// Media Analytics Context Types

export type ContextPublicAttributes = PackageAttributes;
export type ContextPrivateAttributes = WithMediaFeatureFlags;
export type ContextStaticProps = WithMediaFeatureFlags;
export type ContextData = ContextPublicAttributes & {
  [MEDIA_CONTEXT]: ContextPrivateAttributes;
};
