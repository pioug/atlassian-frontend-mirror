import React, { PureComponent } from 'react';

import { MentionUserType as UserType } from '@atlaskit/adf-schema';

import {
  ProviderFactory,
  Providers,
  WithProviders,
} from '../../provider-factory';
import { ProfilecardProvider } from '../../provider-factory/profile-card-provider';
import { MentionEventHandlers } from '../EventHandlers';

import MentionWithProviders from './mention-with-providers';

export interface MentionProps {
  id: string;
  providers?: ProviderFactory;
  eventHandlers?: MentionEventHandlers;
  text: string;
  accessLevel?: string;
  portal?: HTMLElement;
  userType?: UserType;
}

export interface MentionState {
  profilecardProvider: ProfilecardProvider | null;
}

export default class Mention extends PureComponent<MentionProps, {}> {
  private providerFactory: ProviderFactory;

  constructor(props: MentionProps) {
    super(props);
    this.providerFactory = props.providers || new ProviderFactory();
  }

  componentWillUnmount() {
    if (!this.props.providers) {
      // new ProviderFactory is created if no `providers` has been set
      // in this case when component is unmounted it's safe to destroy this providerFactory
      this.providerFactory.destroy();
    }
  }

  private renderWithProvider = (providers: Providers) => {
    const { accessLevel, eventHandlers, id, portal, text } = this.props;

    const { mentionProvider, profilecardProvider } = providers;

    return (
      <MentionWithProviders
        id={id}
        text={text}
        accessLevel={accessLevel}
        eventHandlers={eventHandlers}
        mentionProvider={mentionProvider}
        profilecardProvider={profilecardProvider}
        portal={portal}
      />
    );
  };

  render() {
    return (
      <WithProviders
        providers={['mentionProvider', 'profilecardProvider']}
        providerFactory={this.providerFactory}
        renderNode={this.renderWithProvider}
      />
    );
  }
}
