import React from 'react';

import Popup from '@atlaskit/popup';
import { layers } from '@atlaskit/theme/constants';

import filterActions from '../../internal/filterActions';
import { CardWrapper } from '../../styled/Card';
import {
  ProfileCardAction,
  ProfileCardClientData,
  ProfilecardProps,
  ProfileCardTriggerProps,
  ProfileCardTriggerState,
} from '../../types';
import { DELAY_MS_HIDE, DELAY_MS_SHOW } from '../../util/config';

import Profilecard from './ProfileCard';
import UserLoadingState from './UserLoadingState';

class ProfilecardTrigger extends React.PureComponent<
  ProfileCardTriggerProps,
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

  containerListeners =
    this.props.trigger === 'hover'
      ? {
          onMouseEnter: this.showProfilecard,
          onMouseLeave: this.hideProfilecard,
        }
      : {
          onClick: this.showProfilecard,
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

    this.setState(
      {
        isLoading: true,
        hasError: false,
        data: null,
      },
      () => {
        this.props.resourceClient
          .getProfile(cloudId || '', userId)
          .then(
            (res) => this.handleClientSuccess(res),
            (err) => this.handleClientError(err),
          )
          .catch((err) => this.handleClientError(err));
      },
    );
  };

  handleClientSuccess(res: ProfileCardClientData) {
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

  filterActions(): ProfileCardAction[] {
    return filterActions(this.props.actions, this.state.data);
  }

  renderProfileCard() {
    const newProps: ProfilecardProps = {
      clientFetchProfile: this.clientFetchProfile,
      analytics: this.props.analytics,
      ...this.state.data,
    };

    const wrapperProps =
      this.props.trigger === 'hover'
        ? {
            onMouseEnter: this.showProfilecard,
            onMouseLeave: this.hideProfilecard,
          }
        : {};

    return (
      <div {...wrapperProps}>
        <Profilecard
          {...newProps}
          actions={this.filterActions()}
          hasError={this.state.hasError}
          errorType={this.state.error}
          withoutElevation
        />
      </div>
    );
  }

  renderCard = () => {
    const { isLoading } = this.state;

    if (isLoading === true || isLoading === undefined) {
      return (
        <CardWrapper>
          <UserLoadingState />
        </CardWrapper>
      );
    } else {
      return this.renderProfileCard();
    }
  };

  renderWithTrigger() {
    return (
      <Popup
        isOpen={!!this.state.visible}
        onClose={this.hideProfilecard}
        placement={this.props.position}
        content={this.renderCard}
        trigger={(triggerProps) => {
          const { ref, ...innerProps } = triggerProps;
          return (
            <span {...innerProps} {...this.containerListeners} ref={ref}>
              {this.props.children}
            </span>
          );
        }}
        zIndex={layers.modal()}
      />
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

export default ProfilecardTrigger;
