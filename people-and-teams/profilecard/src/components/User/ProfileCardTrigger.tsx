import React, { Suspense } from 'react';

import {
  type AnalyticsEventPayload,
  withAnalyticsEvents,
} from '@atlaskit/analytics-next';
import { GiveKudosLauncherLazy, KudosType } from '@atlaskit/give-kudos';
import { getBooleanFF } from '@atlaskit/platform-feature-flags';
import Popup from '@atlaskit/popup';
import { layers } from '@atlaskit/theme/constants';

import filterActions from '../../internal/filterActions';
import { CardWrapper } from '../../styled/Card';
import {
  type AnalyticsProps,
  type ProfileCardAction,
  type ProfileCardClientData,
  type ProfilecardProps,
  type ProfileCardTriggerProps,
  type ProfileCardTriggerState,
  type TeamCentralReportingLinesData,
} from '../../types';
import { cardTriggered, fireEvent } from '../../util/analytics';
import { DELAY_MS_HIDE, DELAY_MS_SHOW } from '../../util/config';

import { ProfileCardLazy } from './lazyProfileCard';
import ProfilecardTriggerNext from './ProfileCardTriggerNext';
import UserLoadingState from './UserLoadingState';

class ProfilecardTrigger extends React.PureComponent<
  ProfileCardTriggerProps & AnalyticsProps,
  ProfileCardTriggerState
> {
  static defaultProps: Partial<ProfileCardTriggerProps> = {
    actions: [],
    trigger: 'hover',
    position: 'bottom-start',
  };

  _isMounted: boolean = false;
  showDelay: number = this.props.trigger === 'click' ? 0 : DELAY_MS_SHOW;
  hideDelay: number = this.props.trigger === 'click' ? 0 : DELAY_MS_HIDE;
  showTimer: number = 0;
  hideTimer: number = 0;

  fireAnalytics = (payload: AnalyticsEventPayload) => {
    // Don't fire any analytics if the component is unmounted
    if (!this._isMounted) {
      return;
    }

    if (this.props.createAnalyticsEvent) {
      fireEvent(this.props.createAnalyticsEvent, payload);
    }
  };

  hideProfilecard = () => {
    clearTimeout(this.showTimer);
    clearTimeout(this.hideTimer);

    this.hideTimer = window.setTimeout(() => {
      this.setState({ visible: false });
    }, this.hideDelay);
  };

  showProfilecard = () => {
    clearTimeout(this.hideTimer);
    clearTimeout(this.showTimer);

    this.showTimer = window.setTimeout(() => {
      if (!this.state.visible) {
        this.clientFetchProfile();
        this.setState({ visible: true });
      }
    }, this.showDelay);
  };

  onClick = (event: React.MouseEvent) => {
    // If the user clicks on the trigger then we don't want that click event to
    // propagate out to parent containers. For example when clicking a mention
    // lozenge in an inline-edit.
    event.stopPropagation();

    this.showProfilecard();

    if (!this.state.visible) {
      this.fireAnalytics(cardTriggered('user', 'click'));
    }
  };

  onMouseEnter = () => {
    this.showProfilecard();

    if (!this.state.visible) {
      this.fireAnalytics(cardTriggered('user', 'hover'));
    }
  };

  onKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.showProfilecard();
      if (!this.state.visible) {
        this.fireAnalytics(cardTriggered('user', 'click'));
      }
    }
  };

  onFocus = () => {
    this.showProfilecard();
  };

  containerListeners =
    this.props.trigger === 'hover'
      ? {
          onMouseEnter: this.onMouseEnter,
          onMouseLeave: this.hideProfilecard,
          onBlur: this.hideProfilecard,
          onKeyPress: this.onKeyPress,
        }
      : {
          onClick: this.onClick,
          onKeyPress: this.onKeyPress,
        };

  layerListeners = {
    handleClickOutside: this.hideProfilecard,
    handleEscapeKeydown: this.hideProfilecard,
  };

  state: ProfileCardTriggerState = {
    visible: false,
    isLoading: undefined,
    hasError: false,
    error: null,
    data: null,
    reportingLinesData: undefined,
    shouldShowGiveKudos: false,
    teamCentralBaseUrl: undefined,
    kudosDrawerOpen: false,
  };

  componentDidMount() {
    this._isMounted = true;
  }

  componentDidUpdate(prevProps: ProfileCardTriggerProps) {
    const { userId, cloudId, resourceClient } = this.props;
    const { visible } = this.state;

    // just re-fetching data when the card opens
    if (
      visible &&
      (userId !== prevProps.userId ||
        cloudId !== prevProps.cloudId ||
        resourceClient !== prevProps.resourceClient)
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
    clearTimeout(this.showTimer);
    clearTimeout(this.hideTimer);
  }

  clientFetchProfile = () => {
    const { cloudId, userId } = this.props;
    const { isLoading } = this.state;

    if (isLoading === true) {
      // don't fetch data when fetching is in process
      return;
    }

    this.setState({
      teamCentralBaseUrl: this.props.resourceClient.getTeamCentralBaseUrl(),
    });

    this.setState(
      {
        isLoading: true,
        hasError: false,
        data: null,
      },
      () => {
        const requests = Promise.all([
          this.props.resourceClient.getProfile(
            cloudId || '',
            userId,
            this.fireAnalytics,
          ),
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
      shouldShowGiveKudos,
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

  filterActions(): ProfileCardAction[] {
    return filterActions(this.props.actions, this.state.data);
  }

  renderProfileCard() {
    const newProps: ProfilecardProps = {
      userId: this.props.userId,
      isCurrentUser: this.state.data?.isCurrentUser,
      clientFetchProfile: this.clientFetchProfile,
      ...this.state.data,
      reportingLines: this.state.reportingLinesData,
      onReportingLinesClick: this.props.onReportingLinesClick,
      isKudosEnabled: this.state.shouldShowGiveKudos,
      teamCentralBaseUrl: this.state.teamCentralBaseUrl,
      cloudId: this.props.cloudId,
      openKudosDrawer: this.openKudosDrawer,
    };

    const wrapperProps =
      this.props.trigger === 'hover'
        ? {
            onMouseEnter: this.onMouseEnter,
            onMouseLeave: this.hideProfilecard,
            onFocus: this.onFocus,
          }
        : {};

    return (
      <div {...wrapperProps}>
        {this.state.visible && (
          <Suspense fallback={null}>
            <ProfileCardLazy
              {...newProps}
              actions={this.filterActions()}
              hasError={this.state.hasError}
              errorType={this.state.error}
              withoutElevation
            />
          </Suspense>
        )}
      </div>
    );
  }

  openKudosDrawer = () => {
    this.hideProfilecard();
    this.setState({ kudosDrawerOpen: true });
  };

  closeKudosDrawer = () => {
    this.setState({ kudosDrawerOpen: false });
  };

  renderCard = () => {
    const { isLoading } = this.state;

    if (isLoading === true || isLoading === undefined) {
      return (
        <CardWrapper>
          <UserLoadingState fireAnalytics={this.fireAnalytics} />
        </CardWrapper>
      );
    } else {
      return this.renderProfileCard();
    }
  };

  renderWithTrigger() {
    return (
      <>
        <Popup
          isOpen={!!this.state.visible}
          onClose={this.hideProfilecard}
          placement={this.props.position}
          content={this.renderCard}
          trigger={(triggerProps) => {
            const { ref, ...innerProps } = triggerProps;
            return (
              <span
                {...innerProps}
                {...this.containerListeners}
                ref={ref}
                data-testid={this.props.testId}
                role="button"
                tabIndex={0}
              >
                {this.props.children}
              </span>
            );
          }}
          zIndex={layers.modal()}
          shouldUseCaptureOnOutsideClick
          autoFocus={this.props.trigger === 'click'}
          shouldRenderToParent
        />
        {this.state.shouldShowGiveKudos && (
          <Suspense fallback={null}>
            <GiveKudosLauncherLazy
              isOpen={this.state.kudosDrawerOpen}
              recipient={{
                type: KudosType.INDIVIDUAL,
                recipientId: this.props.userId!,
              }}
              analyticsSource="profile-card"
              teamCentralBaseUrl={this.state.teamCentralBaseUrl!}
              cloudId={this.props.cloudId!}
              addFlag={this.props.addFlag}
              onClose={this.closeKudosDrawer}
            />
          </Suspense>
        )}
      </>
    );
  }

  render() {
    if (this.props.children) {
      return this.renderWithTrigger();
    } else {
      throw new Error(
        'Component "ProfileCardTrigger" must have "children" property',
      );
    }
  }
}

const ProfilecardTriggerLegacy = withAnalyticsEvents()(ProfilecardTrigger);

export default function ProfilecardTriggerSwitch(
  props: ProfileCardTriggerProps,
) {
  return getBooleanFF('platform.profile-card-trigger-next') ? (
    <ProfilecardTriggerNext
      {...props}
      onVisibilityChange={(isVisible) => {
        if (props.onVisibilityChange) {
          props.onVisibilityChange(isVisible);
        }
      }}
    />
  ) : (
    <ProfilecardTriggerLegacy {...props} />
  );
}
