import React from 'react';
import { Card } from '@atlaskit/smart-card';
import { EventHandlers, UnsupportedBlock } from '@atlaskit/editor-common';

import { getEventHandler } from '../../utils';
import { CardErrorBoundary } from './fallback';

export default function BlockCard(props: {
  url?: string;
  data?: object;
  eventHandlers?: EventHandlers;
  portal?: HTMLElement;
}) {
  const { url, data, eventHandlers, portal } = props;
  const handler = getEventHandler(eventHandlers, 'smartCard');
  const onClick =
    url && handler
      ? (e: React.MouseEvent<HTMLElement>) => handler(e, url)
      : undefined;

  const cardProps = { url, data, onClick, container: portal };
  return (
    <div
      data-block-card
      data-card-data={data ? JSON.stringify(data) : undefined}
      data-card-url={url}
    >
      <CardErrorBoundary unsupportedComponent={UnsupportedBlock} {...cardProps}>
        <Card appearance="block" {...cardProps} />
      </CardErrorBoundary>
    </div>
  );
}
