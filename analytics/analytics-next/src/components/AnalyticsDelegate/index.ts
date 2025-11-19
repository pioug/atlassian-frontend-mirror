import React, { Component } from 'react';

import PropTypes from 'prop-types';

type AnalyticsDelegateProps = {
	children: React.ReactNode;
	delegateAnalyticsEvent?: (name: string, data: any, isPrivate: boolean) => void;
};

type AnalyticsDelegateContext = {
	onAnalyticsEvent?: (name: string, data: any, isPrivate: boolean) => void;
};

const ContextTypes = {
	onAnalyticsEvent: PropTypes.func,
};

/**
 * Listens to public and private events and delegates to an analytics
 * stack in a different React root.
 */
// eslint-disable-next-line @repo/internal/react/no-class-components
class AnalyticsDelegate extends Component<AnalyticsDelegateProps> {
	static contextTypes: {
		onAnalyticsEvent: PropTypes.Requireable<(...args: any[]) => any>;
	} = ContextTypes;

	static childContextTypes: {
		onAnalyticsEvent: PropTypes.Requireable<(...args: any[]) => any>;
	} = ContextTypes;

	getChildContext(): AnalyticsDelegateContext {
		return {
			onAnalyticsEvent: this.onAnalyticsEvent,
		};
	}

	onAnalyticsEvent = (name: string, data: any, isPrivate: boolean): void => {
		const { delegateAnalyticsEvent } = this.props;

		const eventData = { ...data };
		if (delegateAnalyticsEvent) {
			delegateAnalyticsEvent(name, eventData, isPrivate);
		}

		const { onAnalyticsEvent } = this.context as any;
		if (typeof onAnalyticsEvent === 'function') {
			onAnalyticsEvent(name, data, isPrivate);
		}
	};

	render(): React.ReactNode {
		const { children } = this.props;
		return React.Children.only(children);
	}
}

export default AnalyticsDelegate;
