import React, { Component } from 'react';

import PropTypes from 'prop-types';

type AnalyticsData = {
	[key: string]: any;
};

type WithAnalyticsProps = {
	[key: string]: any;
	analyticsData?: AnalyticsData;
	analyticsId?: string;
	delegateAnalyticsEvent?: (analyticsId: string, data: any, isPrivate: boolean) => void;
	fireAnalyticsEvent?: (name: string, data?: AnalyticsData) => void;
	firePrivateAnalyticsEvent?: (name: string, data?: AnalyticsData) => void;
	getParentAnalyticsData?: (name: string) => AnalyticsData;
	innerRef?: React.Ref<any>;
};

type WithAnalyticsState = {
	evaluatedMap: {
		[key: string]: string | ((...args: any[]) => void);
	};
};

type WithAnalyticsContext = {
	getParentAnalyticsData?: (name: string, isPrivate: boolean) => AnalyticsData;
	onAnalyticsEvent?: (name: string, data: AnalyticsData | undefined, isPrivate: boolean) => void;
};

/**
 * The withAnalytics HOC wraps a component and provides the `fireAnalyticsEvent`
 * and `firePrivateAnalyticsEvent` methods to it as props. It contains the logic
 * for how to fire events, including handling the analyticsId and analyticsData
 * props. The `map` argument may be an object or a function that returns an object.
 * The properties of the `map` object/result can be strings (the name of the event
 * that will be fired) or functions (which are responsible for firing the event).
 * You can specify a default `analyticsId` and `analyticsData` with the `defaultProps`
 * param. Please be aware that specifying a default `analyticsId` will cause public
 * events to always fire for your component unless it has been set to a falsy by
 * the component consumer.
 *
 * @param WrappedComponent
 * @param map
 * @param defaultProps
 * @param withDelegation
 */
const withAnalytics = (
	WrappedComponent: React.ComponentType<any>,
	map:
		| { [key: string]: string | ((...args: any[]) => void) }
		| ((fireAnalyticsEvent: (name: string, data?: AnalyticsData) => void) => {
				[key: string]: string | ((...args: any[]) => void);
		  }) = {},
	defaultProps: Partial<WithAnalyticsProps> = {},
	withDelegation?: boolean,
): {
	new (props: WithAnalyticsProps): {
		componentDidMount(): void;
		delegateAnalyticsEvent: (analyticsId: string, data: any, isPrivate: boolean) => void;
		fireAnalyticsEvent: (name: string, data?: AnalyticsData) => void;
		privateAnalyticsEvent: (name: string, data?: AnalyticsData) => void;
		getParentAnalyticsData: (name: string) => AnalyticsData;
		render(): React.JSX.Element;
		context: unknown;
		setState<K extends 'evaluatedMap'>(
			state:
				| WithAnalyticsState
				| ((
						prevState: Readonly<WithAnalyticsState>,
						props: Readonly<WithAnalyticsProps>,
				  ) => WithAnalyticsState | Pick<WithAnalyticsState, K> | null)
				| Pick<WithAnalyticsState, K>
				| null,
			callback?: (() => void) | undefined,
		): void;
		forceUpdate(callback?: (() => void) | undefined): void;
		readonly props: Readonly<WithAnalyticsProps>;
		state: Readonly<WithAnalyticsState>;
		refs: {
			[key: string]: React.ReactInstance;
		};
		shouldComponentUpdate?(
			nextProps: Readonly<WithAnalyticsProps>,
			nextState: Readonly<WithAnalyticsState>,
			nextContext: any,
		): boolean;
		componentWillUnmount?(): void;
		componentDidCatch?(error: Error, errorInfo: React.ErrorInfo): void;
		getSnapshotBeforeUpdate?(
			prevProps: Readonly<WithAnalyticsProps>,
			prevState: Readonly<WithAnalyticsState>,
		): any;
		componentDidUpdate?(
			prevProps: Readonly<WithAnalyticsProps>,
			prevState: Readonly<WithAnalyticsState>,
			snapshot?: any,
		): void;
		componentWillMount?(): void;
		UNSAFE_componentWillMount?(): void;
		componentWillReceiveProps?(nextProps: Readonly<WithAnalyticsProps>, nextContext: any): void;
		UNSAFE_componentWillReceiveProps?(
			nextProps: Readonly<WithAnalyticsProps>,
			nextContext: any,
		): void;
		componentWillUpdate?(
			nextProps: Readonly<WithAnalyticsProps>,
			nextState: Readonly<WithAnalyticsState>,
			nextContext: any,
		): void;
		UNSAFE_componentWillUpdate?(
			nextProps: Readonly<WithAnalyticsProps>,
			nextState: Readonly<WithAnalyticsState>,
			nextContext: any,
		): void;
	};
	displayName: string;
	contextTypes: {
		onAnalyticsEvent: PropTypes.Requireable<(...args: any[]) => any>;
		getParentAnalyticsData: PropTypes.Requireable<(...args: any[]) => any>;
	};
	defaultProps: Partial<WithAnalyticsProps>;
	contextType?: React.Context<any> | undefined;
} => {
	return class WithAnalytics extends Component<WithAnalyticsProps, WithAnalyticsState> {
		static displayName = `WithAnalytics(${WrappedComponent.displayName || WrappedComponent.name})`;

		static contextTypes: {
			onAnalyticsEvent: PropTypes.Requireable<(...args: any[]) => any>;
			getParentAnalyticsData: PropTypes.Requireable<(...args: any[]) => any>;
		} = {
			onAnalyticsEvent: PropTypes.func,
			getParentAnalyticsData: PropTypes.func,
		};

		static defaultProps: Partial<WithAnalyticsProps> = {
			analyticsId: defaultProps.analyticsId,
			analyticsData: defaultProps.analyticsData,
		};

		constructor(props: WithAnalyticsProps) {
			super(props);
			this.state = {
				evaluatedMap: {},
			};
		}

		componentDidMount() {
			this.setState({
				evaluatedMap: typeof map === 'function' ? map(this.fireAnalyticsEvent) : map,
			});
		}

		delegateAnalyticsEvent = (analyticsId: string, data: any, isPrivate: boolean): void => {
			const { onAnalyticsEvent } = this.context as WithAnalyticsContext;
			if (!onAnalyticsEvent) {
				return;
			}
			onAnalyticsEvent(analyticsId, data, isPrivate);
		};

		fireAnalyticsEvent = (name: string, data?: AnalyticsData): void => {
			const { analyticsData, analyticsId } = this.props;
			const { onAnalyticsEvent } = this.context as WithAnalyticsContext;
			if (!analyticsId || !onAnalyticsEvent) {
				return;
			}
			const eventData = { ...analyticsData, ...data };
			onAnalyticsEvent(`${analyticsId}.${name}`, eventData, false);
		};

		privateAnalyticsEvent = (name: string, data?: AnalyticsData): void => {
			const { onAnalyticsEvent } = this.context as WithAnalyticsContext;
			if (!onAnalyticsEvent) {
				return;
			}
			onAnalyticsEvent(`${name}`, data, true);
		};

		getParentAnalyticsData = (name: string): AnalyticsData => {
			const { getParentAnalyticsData } = this.context as WithAnalyticsContext;
			let parentData = {} as AnalyticsData;
			if (typeof getParentAnalyticsData === 'function' && this.props.analyticsId) {
				const { analyticsId } = this.props;
				parentData = getParentAnalyticsData(`${analyticsId}.${name}`, false);
			}
			return parentData;
		};

		render() {
			const { analyticsId, analyticsData, ...componentProps } = this.props;
			Object.keys(this.state.evaluatedMap).forEach((prop) => {
				const handler = this.state.evaluatedMap[prop];
				const originalProp = componentProps[prop];
				(componentProps[prop] as (...args: any[]) => void) = (...args: any[]) => {
					if (typeof handler === 'function') {
						handler(...args);
					} else {
						this.fireAnalyticsEvent(handler);
					}
					if (typeof originalProp === 'function') {
						originalProp(...args);
					}
				};
			});

			return (
				<WrappedComponent
					fireAnalyticsEvent={this.fireAnalyticsEvent}
					firePrivateAnalyticsEvent={this.privateAnalyticsEvent}
					getParentAnalyticsData={this.getParentAnalyticsData}
					delegateAnalyticsEvent={withDelegation ? this.delegateAnalyticsEvent : undefined}
					analyticsId={analyticsId}
					ref={this.props.innerRef}
					{...componentProps}
				/>
			);
		}
	};
};

export default withAnalytics;
