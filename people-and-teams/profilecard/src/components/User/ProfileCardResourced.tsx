import React, { Suspense } from 'react';

import { type AnalyticsEventPayload, withAnalyticsEvents } from '@atlaskit/analytics-next';
import { GiveKudosLauncherLazy, KudosType } from '@atlaskit/give-kudos';

import filterActions from '../../internal/filterActions';
import { CardWrapper } from '../../styled/Card';
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
	};

	fireAnalytics = (payload: AnalyticsEventPayload) => {
		// Don't fire analytics if the component is unmounted
		if (!this._isMounted) {
			return;
		}

		if (this.props.createAnalyticsEvent) {
			fireEvent(this.props.createAnalyticsEvent, payload);
		}
	};

	componentDidMount() {
		this._isMounted = true;
		this.clientFetchProfile();
	}

	componentDidUpdate(prevProps: ProfileCardResourcedProps) {
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

	componentWillUnmount() {
		this._isMounted = false;
	}

	clientFetchProfile = () => {
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
					this.props.resourceClient.getProfile(cloudId, userId, this.fireAnalytics),
					this.props.resourceClient.getReportingLines(userId),
					this.props.resourceClient.shouldShowGiveKudos(),
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
	) {
		if (!this._isMounted) {
			return;
		}

		this.setState({
			isLoading: false,
			hasError: false,
			data: profileData,
			reportingLinesData,
			isKudosEnabled: shouldShowGiveKudos,
		});
	}

	handleClientError(err: any) {
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

	openKudosDrawer = () => {
		this.setState({ kudosDrawerOpen: true });
	};

	closeKudosDrawer = () => {
		this.setState({ kudosDrawerOpen: false });
	};

	render(): React.ReactNode {
		const { isLoading, hasError, error, data, reportingLinesData, isKudosEnabled } = this.state;
		const { onReportingLinesClick, cloudId, userId, addFlag } = this.props;

		const isFetchingOrNotStartToFetchYet = isLoading === true || isLoading === undefined;

		if (isFetchingOrNotStartToFetchYet) {
			return (
				<CardWrapper>
					<UserLoadingState fireAnalytics={this.fireAnalytics} />
				</CardWrapper>
			);
		} else if (hasError) {
			return (
				<CardWrapper>
					<ErrorMessage
						errorType={error}
						reload={this.clientFetchProfile}
						fireAnalytics={this.fireAnalytics}
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
			teamCentralBaseUrl: this.props.resourceClient.getTeamCentralBaseUrl(),
			openKudosDrawer: this.openKudosDrawer,
		};

		return (
			<CardWrapper>
				<>
					{isKudosEnabled && (
						<Suspense fallback={null}>
							<GiveKudosLauncherLazy
								isOpen={this.state.kudosDrawerOpen}
								recipient={{
									type: KudosType.INDIVIDUAL,
									recipientId: this.props.userId!,
								}}
								analyticsSource="profile-card"
								teamCentralBaseUrl={newProps.teamCentralBaseUrl!}
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

export default withAnalyticsEvents()(ProfileCardResourced);
