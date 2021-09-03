import React from 'react';

import { AnalyticsName } from '../../internal/analytics';
import filterActions from '../../internal/filterActions';
import { CardWrapper } from '../../styled/Card';
import {
  ProfileCardAction,
  ProfileCardResourcedProps,
  ProfileCardResourcedState,
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
        this.props.resourceClient
          .getProfile(cloudId, userId)
          .then(
            (res) => this.handleClientSuccess(res),
            (err) => this.handleClientError(err),
          )
          .catch((err) => this.handleClientError(err));
      },
    );
  };

  handleClientSuccess(res: any) {
    if (!this._isMounted) {
      return;
    }

    this.setState({
      isLoading: false,
      hasError: false,
      data: res,
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
    const { isLoading, hasError, error, data } = this.state;
    const { analytics } = this.props;

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
      ...data,
    };

    return (
      <CardWrapper>
        <ProfileCard {...newProps} actions={this.filterActions()} />
      </CardWrapper>
    );
  }
}
