import React, { useMemo } from 'react';
import { Card } from '@atlaskit/smart-card';
import { EventHandlers, UnsupportedBlock } from '@atlaskit/editor-common';

import { getEventHandler, getPlatform } from '../../utils';
import { CardErrorBoundary } from './fallback';
import { RendererAppearance } from '../../ui/Renderer/types';

export default function BlockCard(props: {
  url?: string;
  data?: object;
  eventHandlers?: EventHandlers;
  portal?: HTMLElement;
  rendererAppearance?: RendererAppearance;
}) {
  const { url, data, eventHandlers, portal, rendererAppearance } = props;
  const handler = getEventHandler(eventHandlers, 'smartCard');
  const onClick =
    url && handler
      ? (e: React.MouseEvent<HTMLElement>) => handler(e, url)
      : undefined;

  const platform = useMemo(() => getPlatform(rendererAppearance), [
    rendererAppearance,
  ]);

  const cardProps = { url, data, onClick, container: portal };
  return (
    <div
      className="blockCardView-content-wrap"
      data-block-card
      data-card-data={data ? JSON.stringify(data) : undefined}
      data-card-url={url}
    >
      <CardErrorBoundary unsupportedComponent={UnsupportedBlock} {...cardProps}>
        <Card
          appearance="block"
          showActions={rendererAppearance !== 'mobile'}
          platform={platform}
          {...cardProps}
        />
      </CardErrorBoundary>
    </div>
  );
}
