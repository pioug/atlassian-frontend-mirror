import React, { Component } from 'react';

import PropTypes from 'prop-types';

import {
	default as AnalyticsReactContext,
	type AnalyticsReactContextInterface,
} from '@atlaskit/analytics-next-stable-react-context';

import type {
	default as UIAnalyticsEvent,
	UIAnalyticsEventHandler,
} from '../../events/UIAnalyticsEvent';

type Props = {
	/** The channel to listen for events on. */
	channel?: string;
	/** Children! */
	children?: React.ReactNode;
	/** A function which will be called when an event is fired on this Listener's
	 * channel. It is passed the event and the channel as arguments. */
	onEvent: (event: UIAnalyticsEvent, channel?: string) => void;
};

const ContextTypes = {
	getAtlaskitAnalyticsEventHandlers: PropTypes.func,
	getAtlaskitAnalyticsContext: PropTypes.func,
};

const noop = () => [];

// eslint-disable-next-line @repo/internal/react/no-class-components
class AnalyticsListener extends Component<Props> {
	context: any;
	static contextTypes: { getAtlaskitAnalyticsEventHandlers: PropTypes.Requireable<(...args: any[]) => any>; getAtlaskitAnalyticsContext: PropTypes.Requireable<(...args: any[]) => any>; } = ContextTypes;
	static childContextTypes: { getAtlaskitAnalyticsEventHandlers: PropTypes.Requireable<(...args: any[]) => any>; getAtlaskitAnalyticsContext: PropTypes.Requireable<(...args: any[]) => any>; } = ContextTypes;

	contextValue: AnalyticsReactContextInterface;

	constructor(props: Props) {
		super(props);

		this.contextValue = {
			getAtlaskitAnalyticsContext: this.getAtlaskitAnalyticsContext,
			getAtlaskitAnalyticsEventHandlers: this.getAnalyticsEventHandlers,
		};
	}

	getChildContext = (): {
        getAtlaskitAnalyticsContext: () => any;
        getAtlaskitAnalyticsEventHandlers: () => any[];
    } => ({
		getAtlaskitAnalyticsEventHandlers: this.getAnalyticsEventHandlers,
		getAtlaskitAnalyticsContext: this.getAtlaskitAnalyticsContext,
	});

	getAnalyticsEventHandlers = (): any[] => {
		const { channel, onEvent } = this.props;
		const { getAtlaskitAnalyticsEventHandlers = noop } = this.context;

		const handler: UIAnalyticsEventHandler = (event, eventChannel) => {
			if (channel === '*' || channel === eventChannel) {
				onEvent(event, eventChannel);
			}
		};

		return [handler, ...getAtlaskitAnalyticsEventHandlers()];
	};

	getAtlaskitAnalyticsContext = (): any => {
		const { getAtlaskitAnalyticsContext = noop } = this.context;
		return getAtlaskitAnalyticsContext();
	};

	render(): React.JSX.Element {
		const { children } = this.props;
		return (
			<AnalyticsReactContext.Provider value={this.contextValue}>
				{children}
			</AnalyticsReactContext.Provider>
		);
	}
}

export default AnalyticsListener;
