import React from 'react';
import { Card } from '@atlaskit/smart-card';
import { EventHandlers, UnsupportedInline } from '@atlaskit/editor-common';

import { getEventHandler } from '../../utils';
import { CardErrorBoundary } from './fallback';
import {
  withSmartCardStorage,
  WithSmartCardStorageProps,
} from '../../ui/SmartCardStorage';

export interface InlineCardProps {
  url?: string;
  data?: object;
  eventHandlers?: EventHandlers;
  portal?: HTMLElement;
}

const InlineCard: React.FunctionComponent<InlineCardProps &
  WithSmartCardStorageProps> = props => {
  const { url, data, eventHandlers, portal } = props;
  const handler = getEventHandler(eventHandlers, 'smartCard');
  const onClick =
    url && handler
      ? (e: React.MouseEvent<HTMLElement>) => handler(e, url)
      : undefined;

  const cardProps = { url, data, onClick, container: portal };
  return (
    <span
      data-inline-card
      data-card-data={data ? JSON.stringify(data) : undefined}
      data-card-url={url}
    >
      <CardErrorBoundary
        unsupportedComponent={UnsupportedInline}
        {...cardProps}
      >
        <Card
          appearance="inline"
          {...cardProps}
          onResolve={data => {
            if (!data.url || !data.title) {
              return;
            }

            props.smartCardStorage.set(data.url, data.title);
          }}
        />
      </CardErrorBoundary>
    </span>
  );
};

export default withSmartCardStorage(InlineCard);
