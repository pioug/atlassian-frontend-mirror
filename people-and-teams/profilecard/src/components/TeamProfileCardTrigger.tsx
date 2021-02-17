import React from 'react';

import Popup from '@atlaskit/popup';
import { TriggerProps } from '@atlaskit/popup/types';

import filterActions from '../internal/filterActions';
import {
  ProfileCardAction,
  Team,
  TeamProfilecardProps,
  TeamProfileCardTriggerProps,
  TeamProfileCardTriggerState,
} from '../types';

import { DELAY_MS_HIDE, DELAY_MS_SHOW } from './config';
import TeamProfilecard from './TeamProfileCard';

class TeamProfileCardTrigger extends React.PureComponent<
  TeamProfileCardTriggerProps,
  TeamProfileCardTriggerState
> {
  static defaultProps: Partial<TeamProfileCardTriggerProps> = {
    actions: [],
    trigger: 'hover',
    position: 'bottom-start',
    triggerLinkType: 'link',
  };

  _isMounted: boolean = false;
  showTimer: number = 0;
  hideTimer: number = 0;

  openedByHover: boolean = false;

  hideProfilecard = (delay = 0) => {
    clearTimeout(this.showTimer);
    clearTimeout(this.hideTimer);

    this.hideTimer = window.setTimeout(() => {
      this.setState({ visible: false });
    }, delay);
  };

  showProfilecard = (delay = 0) => {
    clearTimeout(this.hideTimer);
    clearTimeout(this.showTimer);

    this.showTimer = window.setTimeout(() => {
      if (!this.state.visible) {
        this.clientFetchProfile();
        this.setState({ visible: true });
      }
    }, delay);
  };

  onClick = (event: React.MouseEvent<HTMLElement>) => {
    if (this.props.triggerLinkType === 'link') {
      const isModifiedClick =
        event.metaKey || event.altKey || event.ctrlKey || event.shiftKey;

      // We want to prevent navigation occurring on regular click, but it's important that
      // cmd+click, ctrl+click, etc. still work as expected.
      if (!isModifiedClick) {
        event.preventDefault();
      }
    }

    if (this.props.triggerLinkType === 'clickable-link') {
      if (this.props.viewProfileOnClick) {
        this.props.viewProfileOnClick(event);
      }
    }

    if (this.props.trigger !== 'hover') {
      this.openedByHover = false;
      this.showProfilecard(0);
    }
  };

  onMouseEnter = () => {
    if (this.props.trigger === 'click') {
      return;
    }

    if (!this.state.visible) {
      this.openedByHover = true;
    }

    this.showProfilecard(DELAY_MS_SHOW);
  };

  onMouseLeave = () => {
    if (this.props.trigger === 'click') {
      return;
    }

    if (this.openedByHover) {
      this.hideProfilecard(DELAY_MS_HIDE);
    }
  };

  stopPropagation = (event: React.MouseEvent<HTMLElement>) => {
    // We need to stop propagation when users click on the card, so that it
    // doesn't trigger any special effects that occur when clicking the trigger.
    event.stopPropagation();
  };

  triggerListeners = {
    onClick: this.onClick,
    onMouseEnter: this.onMouseEnter,
    onMouseLeave: this.onMouseLeave,
  };

  cardListeners = {
    onClick: this.stopPropagation,
    onMouseEnter: this.onMouseEnter,
    onMouseLeave: this.onMouseLeave,
  };

  state: TeamProfileCardTriggerState = {
    visible: false,
    isLoading: undefined,
    hasError: false,
    error: null,
    data: null,
  };

  componentDidMount() {
    this._isMounted = true;
  }

  componentDidUpdate(prevProps: TeamProfileCardTriggerProps) {
    const { orgId, teamId } = this.props;
    if (teamId !== prevProps.teamId || orgId !== prevProps.orgId) {
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
    const { orgId, teamId } = this.props;
    const { isLoading } = this.state;

    if (isLoading === true) {
      // don't fetch data when fetching is in process
      return;
    }

    this.setState(
      {
        isLoading: true,
        data: null,
      },
      () => {
        this.props.resourceClient
          .getTeamProfile(teamId, orgId)
          .then(
            res => this.handleClientSuccess(res),
            err => this.handleClientError(err),
          )
          .catch(err => this.handleClientError(err));
      },
    );
  };

  handleClientSuccess(res: Team) {
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

  renderProfileCard = () => {
    const {
      analytics,
      viewingUserId,
      viewProfileLink,
      viewProfileOnClick,
    } = this.props;
    const { data, error, hasError, isLoading } = this.state;

    const newProps: TeamProfilecardProps = {
      clientFetchProfile: this.clientFetchProfile,
      actions: this.filterActions(),
      analytics,
      team: data || undefined,
      viewingUserId,
      viewProfileLink,
      viewProfileOnClick,
    };

    return (
      <div {...this.cardListeners}>
        <TeamProfilecard
          {...newProps}
          isLoading={isLoading}
          hasError={hasError}
          errorType={error}
        />
      </div>
    );
  };

  renderTrigger = (triggerProps: TriggerProps) => {
    const { children, triggerLinkType, viewProfileLink } = this.props;

    if (triggerLinkType === 'none') {
      return (
        <span
          data-testid="team-profilecard-trigger-wrapper"
          {...triggerProps}
          {...this.triggerListeners}
        >
          {children}
        </span>
      );
    }

    return (
      <a
        data-testid="team-profilecard-trigger-wrapper"
        style={{ color: 'initial', textDecoration: 'none' }}
        href={viewProfileLink}
        {...triggerProps}
        ref={triggerProps.ref as React.RefObject<HTMLAnchorElement>}
        {...this.triggerListeners}
      >
        {children}
      </a>
    );
  };

  renderPopup() {
    return (
      <Popup
        isOpen={!!this.state.visible}
        onClose={this.hideProfilecard}
        placement={this.props.position}
        content={this.renderProfileCard}
        trigger={triggerProps => this.renderTrigger(triggerProps)}
      />
    );
  }

  render() {
    if (this.props.children) {
      return this.renderPopup();
    } else {
      throw new Error(
        'Component "TeamProfileCardTrigger" must have "children" property',
      );
    }
  }
}

export default TeamProfileCardTrigger;
