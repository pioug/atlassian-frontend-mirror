import React from 'react';

import { AnalyticsName } from '../../internal/analytics';
import filterActions from '../../internal/filterActions';
import { CardWrapper } from '../../styled/Card';
import {
  ProfileCardAction,
  ProfileCardClientData,
  ProfileCardResourcedProps,
  ProfileCardResourcedState,
  TeamCentralReportingLinesData,
} from '../../types';
import { ErrorMessage } from '../Error';

import ProfileCard from './ProfileCard';
import UserLoadingState from './UserLoadingState';

export default class ProfileCardResourced extends React.PureComponent<
  ProfileCardResourcedProps,
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
  };

  componentDidMount() {
    this._isMounted = true;
    this.clientFetchProfile();
  }

  componentDidUpdate(
    prevProps: ProfileCardResourcedProps,
    prevState: ProfileCardResourcedState,
  ) {
    const { userId, cloudId, resourceClient } = this.props;
    const { hasError } = this.state;

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

    if (hasError !== prevState.hasError && hasError) {
      this.callAnalytics(AnalyticsName.PROFILE_CARD_RESOURCED_ERROR);
    }
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  private callAnalytics = (id: string, options: any = {}) => {
    const { analytics } = this.props;
    if (analytics) {
      analytics(id, options);
    }
  };

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
          this.props.resourceClient.getProfile(cloudId, userId),
          this.props.resourceClient.getReportingLines(userId),
        ]);

        requests
          .then(
            (res) => this.handleClientSuccess(res[0], res[1]),
            (err) => this.handleClientError(err),
          )
          .catch((err) => this.handleClientError(err));
      },
    );
  };

  handleClientSuccess(
    profileData: ProfileCardClientData,
    reportingLinesData: TeamCentralReportingLinesData,
  ) {
    if (!this._isMounted) {
      return;
    }

    this.setState({
      isLoading: false,
      hasError: false,
      data: profileData,
      reportingLinesData,
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

  filterActions = (): ProfileCardAction[] =>
    filterActions(this.props.actions, this.state.data);

  render(): React.ReactNode {
    const { isLoading, hasError, error, data, reportingLinesData } = this.state;
    const { analytics, onReportingLinesClick } = this.props;

    const isFetchingOrNotStartToFetchYet =
      isLoading === true || isLoading === undefined;

    if (isFetchingOrNotStartToFetchYet) {
      return (
        <CardWrapper>
          <UserLoadingState />
        </CardWrapper>
      );
    } else if (hasError) {
      return (
        <CardWrapper>
          <ErrorMessage errorType={error} reload={this.clientFetchProfile} />
        </CardWrapper>
      );
    }

    const newProps = {
      hasError,
      errorType: error,
      clientFetchProfile: this.clientFetchProfile,
      analytics,
      reportingLines: reportingLinesData,
      onReportingLinesClick: onReportingLinesClick,
      ...data,
    };

    return (
      <CardWrapper>
        <ProfileCard {...newProps} actions={this.filterActions()} />
      </CardWrapper>
    );
  }
}
