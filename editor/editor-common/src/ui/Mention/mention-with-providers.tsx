import React, { PureComponent } from 'react';

import { MentionUserType as UserType } from '@atlaskit/adf-schema';
import { ResourcedMention } from '@atlaskit/mention/element';
import { MentionProvider } from '@atlaskit/mention/resource';

import { ProfilecardProvider } from '../../provider-factory/profile-card-provider';
import { MentionEventHandlers } from '../EventHandlers';

import ResourcedMentionWithProfilecard from './mention-with-profilecard';

export interface Props {
  id: string;
  text: string;
  accessLevel?: string;
  userType?: UserType;
  mentionProvider?: Promise<MentionProvider>;
  profilecardProvider?: Promise<ProfilecardProvider>;
  eventHandlers?: MentionEventHandlers;
  portal?: HTMLElement;
}

export interface State {
  profilecardProvider: ProfilecardProvider | null;
}

const GENERIC_USER_IDS = ['HipChat', 'all', 'here'];
const noop = () => {};

export default class MentionWithProviders extends PureComponent<Props, State> {
  state: State = { profilecardProvider: null };

  UNSAFE_componentWillMount() {
    this.updateProfilecardProvider(this.props);
  }

  UNSAFE_componentWillReceiveProps(nextProps: Props) {
    if (nextProps.profilecardProvider !== this.props.profilecardProvider) {
      this.updateProfilecardProvider(nextProps);
    }
  }

  private updateProfilecardProvider(props: Props) {
    // We are not using async/await here to avoid having an intermediate Promise
    // introduced by the transpiler.
    // This will allow consumer to use a SynchronousPromise.resolve and avoid useless
    // rerendering
    if (props.profilecardProvider) {
      props.profilecardProvider
        .then((profilecardProvider) => {
          this.setState({ profilecardProvider });
        })
        .catch(() => {
          this.setState({ profilecardProvider: null });
        });
    } else {
      this.setState({ profilecardProvider: null });
    }
  }

  render() {
    const {
      accessLevel,
      userType,
      eventHandlers,
      id,
      mentionProvider,
      portal,
      text,
    } = this.props;

    const { profilecardProvider } = this.state;

    const actionHandlers: MentionEventHandlers = {} as any;
    (['onClick', 'onMouseEnter', 'onMouseLeave'] as Array<
      keyof MentionEventHandlers
    >).forEach((handler) => {
      actionHandlers[handler] =
        (eventHandlers && eventHandlers[handler]) || noop;
    });

    const MentionComponent =
      profilecardProvider && GENERIC_USER_IDS.indexOf(id) === -1
        ? ResourcedMentionWithProfilecard
        : ResourcedMention;

    return (
      <MentionComponent
        id={id}
        text={text}
        accessLevel={accessLevel}
        userType={userType}
        mentionProvider={mentionProvider}
        profilecardProvider={profilecardProvider!}
        portal={portal}
        {...actionHandlers}
      />
    );
  }
}
