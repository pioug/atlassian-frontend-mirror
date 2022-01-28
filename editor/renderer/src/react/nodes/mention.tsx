import React from 'react';
import { PureComponent } from 'react';

import { ProviderFactory } from '@atlaskit/editor-common/provider-factory';
import type { EventHandlers } from '@atlaskit/editor-common/ui';
import { Mention } from '@atlaskit/editor-common/mention';

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
