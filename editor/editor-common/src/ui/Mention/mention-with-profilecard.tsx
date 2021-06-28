import React, { PureComponent, ReactInstance, SyntheticEvent } from 'react';

import { findDOMNode } from 'react-dom';

import { MentionUserType as UserType } from '@atlaskit/adf-schema';
import { MentionProvider, ResourcedMention } from '@atlaskit/mention';
import ProfileCard, { ProfileCardAction } from '@atlaskit/profilecard';

import { ProfilecardProvider } from '../../provider-factory/profile-card-provider';
import { MentionEventHandler } from '../EventHandlers';
import Popup from '../Popup';
import withOuterListeners from '../with-outer-listeners';

const ProfilecardResourcedWithListeners = withOuterListeners(ProfileCard);

interface Coords {
  x: number;
  y: number;
}

export interface Props {
  id: string;
  text: string;
  accessLevel?: string;
  userType?: UserType;
  mentionProvider?: Promise<MentionProvider>;
  portal?: HTMLElement;
  profilecardProvider: ProfilecardProvider;
  onClick?: MentionEventHandler;
  onMouseEnter?: MentionEventHandler;
  onMouseLeave?: MentionEventHandler;
}

export type PopupAlignX = 'left' | 'right';
export type PopupAlignY = 'top' | 'bottom';

export interface State {
  target: HTMLElement | null;
  visible: boolean;
  popupAlignX: PopupAlignX;
  popupAlignY: PopupAlignY;
}

export default class MentionWithProfileCard extends PureComponent<
  Props,
  State
> {
  private domNode: HTMLElement | null | undefined;
  state: State = {
    target: null,
    visible: false,
    popupAlignX: 'left',
    popupAlignY: 'top',
  };

  private handleRef = (target: HTMLElement | null) => {
    this.setState({ target });
  };

  private calculateLayerPosition(): [PopupAlignX, PopupAlignY] {
    const domNodeCentreCoords = this.getDomNodeCenterCoords();
    const visibleAreaCentreCoords = this.getVisibleAreaCentreCoords();

    const popupAlignY =
      domNodeCentreCoords.y > visibleAreaCentreCoords.y ? 'top' : 'bottom';
    const popupAlignX =
      domNodeCentreCoords.x > visibleAreaCentreCoords.x ? 'right' : 'left';

    return [popupAlignX, popupAlignY];
  }

  private handleMentionNodeRef = (component: ReactInstance | null) => {
    if (!component) {
      this.domNode = null;
    } else {
      this.domNode = findDOMNode(component) as HTMLElement;
    }
  };

  private getDomNodeCenterCoords(): Coords {
    const rect = this.domNode!.getBoundingClientRect();

    return {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
    };
  }

  private getVisibleAreaCentreCoords(): Coords {
    return {
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
    };
  }

  private getActions(
    id: string,
    text: string,
    accessLevel?: string,
  ): ProfileCardAction[] {
    const { profilecardProvider } = this.props;
    const actions = profilecardProvider.getActions(id, text, accessLevel);

    return actions.map((action) => {
      return {
        ...action,
        callback: () => {
          this.setState({ visible: false });
          if (action && action.callback) {
            action.callback();
          }
        },
      };
    });
  }

  private showProfilecard = (event: SyntheticEvent<HTMLElement>) => {
    if (!this.domNode) {
      return;
    }

    event.stopPropagation();

    const [popupAlignX, popupAlignY] = this.calculateLayerPosition();

    this.setState({
      popupAlignX,
      popupAlignY,
      visible: true,
    });
  };

  private hideProfilecard = () => {
    this.setState({ visible: false });
  };

  render() {
    const {
      accessLevel,
      id,
      mentionProvider,
      profilecardProvider,
      text,
      onClick,
      onMouseEnter,
      onMouseLeave,
      portal,
    } = this.props;

    const { popupAlignX, popupAlignY, target, visible } = this.state;

    const { cloudId, resourceClient } = profilecardProvider;

    return (
      <span ref={this.handleRef} onClick={this.showProfilecard}>
        <ResourcedMention
          ref={this.handleMentionNodeRef}
          id={id}
          text={text}
          accessLevel={accessLevel}
          mentionProvider={mentionProvider}
          onClick={onClick}
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
        />
        {target && portal && visible && (
          <Popup
            offset={[0, 8]}
            target={target}
            mountTo={portal}
            alignX={popupAlignX}
            alignY={popupAlignY}
          >
            <ProfilecardResourcedWithListeners
              handleClickOutside={this.hideProfilecard}
              handleEscapeKeydown={this.hideProfilecard}
              cloudId={cloudId}
              userId={id}
              resourceClient={resourceClient}
              actions={this.getActions(id, text, accessLevel)}
            />
          </Popup>
        )}
      </span>
    );
  }
}
