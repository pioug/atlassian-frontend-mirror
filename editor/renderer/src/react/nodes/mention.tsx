import React from 'react';
import { PureComponent } from 'react';

import {
  Mention,
  ProviderFactory,
  EventHandlers,
} from '@atlaskit/editor-common';

export interface Props {
  id: string;
  providers?: ProviderFactory;
  eventHandlers?: EventHandlers;
  text: string;
  accessLevel?: string;
  portal?: HTMLElement;
}

export default class MentionItem extends PureComponent<Props, {}> {
  render() {
    const {
      eventHandlers,
      id,
      portal,
      providers,
      text,
      accessLevel,
    } = this.props;

    return (
      <Mention
        id={id}
        text={text}
        accessLevel={accessLevel}
        providers={providers}
        portal={portal}
        eventHandlers={eventHandlers && eventHandlers.mention}
      />
    );
  }
}
