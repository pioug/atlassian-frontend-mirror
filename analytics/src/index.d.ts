import { Component, PureComponent } from 'react';

export type EventMap = {
  [eventName: string]: string | Function;
};

export type EventMapOrFunction =
  | EventMap
  | ((
      fireAnalyticsEvent: (eventName: string, eventData?: Object) => void,
    ) => EventMap);

export type AnalyticsProps = {
  analyticsId?: string;
  analyticsData?: Object;
  innerRef?: Function;
};

export declare function withAnalytics<C>(
  component: C,
  map: EventMapOrFunction,
  defaultProps: AnalyticsProps,
  withDelegation?: boolean,
): C;

export declare function cleanProps<T>(props: Object): T;

export type FireAnalyticsEvent = (name: string, data: Object) => any;
export type DelegateAnalyticsEvent = (
  analyticsId: string,
  data: Object,
  isPrivate: boolean,
) => void;

export interface AnalyticsListenerProps {
  onEvent: (eventName: string, eventData: Object) => any;
  match?: string | ((name: string) => boolean);
  matchPrivate?: boolean;
}

export class AnalyticsListener extends Component<AnalyticsListenerProps, {}> {}

export interface AnalyticsDelegateProps {
  delegateAnalyticsEvent?: DelegateAnalyticsEvent;
}

export class AnalyticsDelegate extends Component<AnalyticsDelegateProps, {}> {}

export interface AnalyticsDecoratorProps {
  data?: Object;
  getData?: (name: string, decoratedData: Object) => Object;
  match?: string | ((name: string) => boolean);
  matchPrivate?: boolean;
}

export class AnalyticsDecorator extends Component<
  AnalyticsDecoratorProps,
  {}
> {}
