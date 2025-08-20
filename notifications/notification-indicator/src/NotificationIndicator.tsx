import React from 'react';
import { Component } from 'react';

import Badge from '@atlaskit/badge';
import { type NotificationLogProvider } from '@atlaskit/notification-log-client';

const MAX_NOTIFICATIONS_COUNT: number = 9;
const NAVIGATION_CHANNEL = 'navigation';

export interface ValueUpdatingParams {
	source: string;
	visibilityChangesSinceTimer?: number;
}

export interface ValueUpdatingResult {
	countOverride?: number;
	skip?: boolean;
}

export interface ValueUpdatedParams {
	newCount: number;
	oldCount: number;
	source: string;
}

export interface Props {
	appearance?: 'added' | 'default' | 'important' | 'primary' | 'primaryInverted' | 'removed';
	createAnalyticsEvent?: any;
	max?: number;
	notificationLogProvider: Promise<NotificationLogProvider>;
	onCountUpdated?: (param: ValueUpdatedParams) => void;
	onCountUpdating?: (param: ValueUpdatingParams) => ValueUpdatingResult;
	refreshOnHidden?: boolean;
	refreshOnVisibilityChange?: boolean;
	refreshRate?: number;
	ssrInitialValue?: number;
}

export interface State {
	count: number | null;
}

class NotificationIndicator extends Component<Props, State> {
	private intervalId?: number;
	private visibilityChangesSinceTimer: number = 0;
	private notificationLogProvider?: NotificationLogProvider;

	static defaultProps: Partial<Props> = {
		appearance: 'important',
		max: MAX_NOTIFICATIONS_COUNT,
		refreshRate: 0,
		refreshOnHidden: false,
		refreshOnVisibilityChange: true,
	};

	state: State = {
		count: this.props.ssrInitialValue || null,
	};

	async componentDidMount() {
		this.notificationLogProvider = await this.props.notificationLogProvider;
		this.refresh('mount');
		this.updateInterval();
		if (typeof document !== 'undefined') {
			document.addEventListener('visibilitychange', this.onVisibilityChange);
		}
	}

	componentDidUpdate(prevProps: Props) {
		if (prevProps.refreshRate !== this.props.refreshRate) {
			this.updateInterval();
		}
	}

	componentWillUnmount() {
		if (this.intervalId) {
			clearInterval(this.intervalId);
		}
		if (typeof document !== 'undefined') {
			document.removeEventListener('visibilitychange', this.onVisibilityChange);
		}
	}

	private updateInterval() {
		const { refreshRate } = this.props;
		if (this.intervalId) {
			clearInterval(this.intervalId);
		}
		if (refreshRate && refreshRate > 0) {
			this.intervalId = window.setInterval(this.timerTick, refreshRate);
		}
	}

	private onVisibilityChange = () => {
		if (this.props.refreshOnVisibilityChange && this.shouldRefresh()) {
			this.visibilityChangesSinceTimer++;
			this.refresh('visibility');
		}
	};

	private shouldRefresh = () => {
		return (typeof document !== 'undefined' && !document.hidden) || this.props.refreshOnHidden;
	};

	private timerTick = () => {
		this.visibilityChangesSinceTimer = 0;
		this.refresh('timer');
	};

	private handleAnalytics = (countUpdateProperties: ValueUpdatedParams) => {
		const { newCount, oldCount, source } = countUpdateProperties;

		// Only fire an 'activating' analytics event if the notification indicator is 'activating' for the first time
		// ie going from a number of 0 (the indicator is not visible)
		// to a number > 0 (the indicator becomes visible)
		if (this.props.createAnalyticsEvent && newCount > 0 && oldCount === 0) {
			const event = this.props.createAnalyticsEvent({
				actionSubject: 'notificationIndicator',
				action: 'activated',
				attributes: {
					badgeCount: newCount,
					refreshSource: source,
				},
			});
			event.fire(NAVIGATION_CHANNEL);
		}

		if (this.props.createAnalyticsEvent && newCount !== oldCount) {
			const event = this.props.createAnalyticsEvent({
				actionSubject: 'notificationIndicator',
				action: 'updated',
				attributes: {
					oldCount: oldCount,
					newCount: newCount,
					refreshSource: source,
				},
			});
			event.fire(NAVIGATION_CHANNEL);
		}
	};

	private refresh = async (source: string) => {
		// Provider should be available by this point, if not, we exit.
		if (!this.notificationLogProvider) {
			return;
		}
		// If user is not viewing the webpage, then skip this refresh to avoid unnecessary request.
		if (!this.shouldRefresh()) {
			return;
		}

		const visibilityChangesSinceTimer = this.visibilityChangesSinceTimer;
		const updatingEvent: ValueUpdatingParams = {
			source,
			visibilityChangesSinceTimer,
		};
		const updatingResult =
			(this.props.onCountUpdating && this.props.onCountUpdating(updatingEvent)) || {};

		if (updatingResult.skip) {
			return;
		}

		try {
			const count =
				updatingResult.countOverride ||
				(
					await this.notificationLogProvider.countUnseenNotifications({
						queryParams: {
							currentCount: this.state.count || 0,
						},
					})
				).count;

			if (this.state.count === null || this.state.count !== count) {
				const countUpdateProperties = {
					oldCount: this.state.count || 0,
					newCount: count,
					source,
				};

				this.handleAnalytics(countUpdateProperties);

				if (this.props.onCountUpdated) {
					this.props.onCountUpdated(countUpdateProperties);
				}

				this.setState({ count });
			}
		} catch (e) {
			// Do nothing
		}
	};

	render() {
		const { count } = this.state;
		const { appearance, max } = this.props;

		return count ? (
			<div data-test-selector="NotificationIndicator">
				<Badge testId="notification-indicator-badge" max={max} appearance={appearance}>
					{count}
				</Badge>
			</div>
		) : null;
	}
}

export default NotificationIndicator;
