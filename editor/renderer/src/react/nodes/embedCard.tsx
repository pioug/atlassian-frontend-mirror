import React from 'react';
import { Card } from '@atlaskit/smart-card';
import { EventHandlers, UnsupportedBlock } from '@atlaskit/editor-common';

import { getEventHandler } from '../../utils';
import { CardErrorBoundary } from './fallback';

export default function EmbedCard(props: {
  url?: string;
  data?: object;
  eventHandlers?: EventHandlers;
  portal?: HTMLElement;
  originalHeight?: number;
  originalWidth?: number;
  width?: number;
  layout?: string;
}) {
  const {
    url,
    data,
    eventHandlers,
    portal,
    layout,
    width,
    originalWidth,
    originalHeight,
  } = props;
  const handler = getEventHandler(eventHandlers, 'smartCard');
  const onClick =
    url && handler
      ? (e: React.MouseEvent<HTMLElement>) => handler(e, url)
      : undefined;

  const cardProps = { url, data, onClick, container: portal };
  return (
    <div
      data-embed-card
      data-layout={layout}
      data-width={width}
      data-card-original-width={originalWidth}
      data-card-data={data ? JSON.stringify(data) : undefined}
      data-card-url={url}
      data-card-original-height={originalHeight}
    >
      <CardErrorBoundary unsupportedComponent={UnsupportedBlock} {...cardProps}>
        <Card appearance="embed" {...cardProps} />
      </CardErrorBoundary>
    </div>
  );
}
