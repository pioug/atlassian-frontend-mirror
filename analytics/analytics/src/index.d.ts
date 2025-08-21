import { Component } from 'react';

export type EventMap = {
	[eventName: string]: string | Function;
};

export type EventMapOrFunction =
	| EventMap
	| ((fireAnalyticsEvent: (eventName: string, eventData?: Object) => void) => EventMap);

export type AnalyticsProps = {
	analyticsData?: Object;
	analyticsId?: string;
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
	match?: string | ((name: string) => boolean);
	matchPrivate?: boolean;
	onEvent: (eventName: string, eventData: Object) => any;
}

/**
 * @deprecated Please use @atlaskit/analytics-next instead
 */
export class AnalyticsListener extends Component<AnalyticsListenerProps, {}> {}

export interface AnalyticsDelegateProps {
	delegateAnalyticsEvent?: DelegateAnalyticsEvent;
}

/**
 * @deprecated Please use @atlaskit/analytics-next instead
 */
export class AnalyticsDelegate extends Component<AnalyticsDelegateProps, {}> {}

export interface AnalyticsDecoratorProps {
	data?: Object;
	getData?: (name: string, decoratedData: Object) => Object;
	match?: string | ((name: string) => boolean);
	matchPrivate?: boolean;
}

/**
 * @deprecated Please use @atlaskit/analytics-next instead
 */
export class AnalyticsDecorator extends Component<AnalyticsDecoratorProps, {}> {}
