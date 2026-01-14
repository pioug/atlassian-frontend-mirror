import React, { Suspense } from 'react';

import { type AnalyticsEventPayload, withAnalyticsEvents } from '@atlaskit/analytics-next';
import { GiveKudosLauncherLazy, KudosType } from '@atlaskit/give-kudos';
import { componentWithFG } from '@atlaskit/platform-feature-flags-react';
import { type FireEventType, useAnalyticsEvents } from '@atlaskit/teams-app-internal-analytics';

import filterActions from '../../internal/filterActions';
import { CardWrapper } from '../../styled/UserTrigger';
import {
	type AnalyticsProps,
	type ProfileCardAction,
	type ProfileCardClientData,
	type ProfileCardResourcedProps,
	type ProfileCardResourcedState,
	type TeamCentralReportingLinesData,
} from '../../types';
import { fireEvent } from '../../util/analytics';
import { ErrorMessage } from '../Error';

import ProfileCard from './ProfileCard';
import UserLoadingState from './UserLoadingState';

class ProfileCardResourced extends React.PureComponent<
	ProfileCardResourcedProps & AnalyticsProps,
	ProfileCardResourcedState
> {
	static defaultProps: Partial<ProfileCardResourcedProps> = {
		actions: [],
	};

	_isMounted: boolean = false;

	state: ProfileCardResourcedState = {
		visible: false,
		isLoading: undefined,
		hasError: false,
		error: null,
		data: null,
		reportingLinesData: undefined,
		isKudosEnabled: false,
		kudosDrawerOpen: false,
		teamCentralBaseUrl: undefined,
	};

	fireAnalytics = (payload: AnalyticsEventPayload): void => {
		// Don't fire analytics if the component is unmounted
		if (!this._isMounted) {
			return;
		}

		if (this.props.createAnalyticsEvent) {
			fireEvent(this.props.createAnalyticsEvent, payload);
		}
	};

	fireAnalyticsNext: FireEventType = (eventKey, ...attributes) => {
		// Don't fire analytics if the component is unmounted
		if (!this._isMounted) {
			return;
		}

		if (this.props.fireEvent) {
			this.props.fireEvent(eventKey, ...attributes);
		}
	};
	componentDidMount(): void {
		this._isMounted = true;
		this.clientFetchProfile();
	}

	componentDidUpdate(prevProps: ProfileCardResourcedProps): void {
		const { userId, cloudId, resourceClient } = this.props;

		if (
			userId !== prevProps.userId ||
			cloudId !== prevProps.cloudId ||
			resourceClient !== prevProps.resourceClient
		) {
			this.setState(
				{
					isLoading: undefined,
				},
				this.clientFetchProfile,
			);
		}
	}

	componentWillUnmount(): void {
		this._isMounted = false;
	}

	clientFetchProfile = (): void => {
		const { cloudId, userId } = this.props;
		const { isLoading } = this.state;

		if (isLoading === true) {
			// don't fetch data when fetching is in process
			return;
		}

		this.setState(
			{
				isLoading: true,
				hasError: false,
				data: null,
			},
			() => {
				const requests = Promise.all([
					this.props.resourceClient.getProfile(
						cloudId,
						userId,
						this.fireAnalytics,
						this.fireAnalyticsNext,
					),
					this.props.resourceClient.getReportingLines(userId),
					this.props.resourceClient.shouldShowGiveKudos(),
					this.props.resourceClient.getTeamCentralBaseUrl({
						withOrgContext: true,
						withSiteContext: true,
					}),
				]);

				requests
					.then(
						(res) => this.handleClientSuccess(...res),
						(err) => this.handleClientError(err),
					)
					.catch((err) => this.handleClientError(err));
			},
		);
	};

	handleClientSuccess(
		profileData: ProfileCardClientData,
		reportingLinesData: TeamCentralReportingLinesData,
		shouldShowGiveKudos: boolean,
		teamCentralBaseUrl?: string,
	): void {
		if (!this._isMounted) {
			return;
		}

		this.setState({
			isLoading: false,
			hasError: false,
			data: profileData,
			reportingLinesData,
			isKudosEnabled: shouldShowGiveKudos,
			teamCentralBaseUrl,
		});
	}

	handleClientError(err: any): void {
		if (!this._isMounted) {
			return;
		}

		this.setState({
			isLoading: false,
			hasError: true,
			error: err,
		});
	}

	filterActions = (): ProfileCardAction[] => filterActions(this.props.actions, this.state.data);

	openKudosDrawer = (): void => {
		this.setState({ kudosDrawerOpen: true });
	};

	closeKudosDrawer = (): void => {
		this.setState({ kudosDrawerOpen: false });
	};

	render(): React.ReactNode {
		const {
			isLoading,
			hasError,
			error,
			data,
			reportingLinesData,
			isKudosEnabled,
			teamCentralBaseUrl,
		} = this.state;
		const { onReportingLinesClick, cloudId, userId, addFlag } = this.props;

		const isFetchingOrNotStartToFetchYet = isLoading === true || isLoading === undefined;

		if (isFetchingOrNotStartToFetchYet) {
			return (
				<CardWrapper>
					<UserLoadingState
						fireAnalytics={this.fireAnalytics}
						fireAnalyticsNext={this.fireAnalyticsNext}
					/>
				</CardWrapper>
			);
		} else if (hasError) {
			return (
				<CardWrapper testId="profile-card-resourced-error-state">
					<ErrorMessage
						errorType={error}
						reload={this.clientFetchProfile}
						fireAnalytics={this.fireAnalytics}
						fireAnalyticsNext={this.fireAnalyticsNext}
					/>
				</CardWrapper>
			);
		}

		const newProps = {
			hasError,
			errorType: error,
			clientFetchProfile: this.clientFetchProfile,
			reportingLines: reportingLinesData,
			onReportingLinesClick: onReportingLinesClick,
			cloudId,
			userId,
			addFlag,
			...data,
			isKudosEnabled,
			teamCentralBaseUrl,
			openKudosDrawer: this.openKudosDrawer,
		};

		return (
			<CardWrapper>
				<>
					{isKudosEnabled && newProps.teamCentralBaseUrl && (
						<Suspense fallback={null}>
							<GiveKudosLauncherLazy
								isOpen={this.state.kudosDrawerOpen}
								recipient={{
									type: KudosType.INDIVIDUAL,
									recipientId: this.props.userId!,
								}}
								analyticsSource="profile-card"
								teamCentralBaseUrl={newProps.teamCentralBaseUrl}
								cloudId={this.props.cloudId!}
								addFlag={this.props.addFlag}
								onClose={this.closeKudosDrawer}
							/>
						</Suspense>
					)}
					<ProfileCard {...newProps} actions={this.filterActions()} />
				</>
			</CardWrapper>
		);
	}
}

export const ProfileCardResourcedInternal = ProfileCardResourced;

const ProfileCardResourcedWithAnalytics = (props: ProfileCardResourcedProps) => {
	const { fireEvent } = useAnalyticsEvents();
	return <ProfileCardResourced fireEvent={fireEvent} {...props} />;
};

export default componentWithFG(
	'ptc-enable-profile-card-analytics-refactor',
	ProfileCardResourcedWithAnalytics,
	withAnalyticsEvents()(ProfileCardResourced),
);
