import React, { useMemo } from 'react';
import { Card } from '@atlaskit/smart-card';
import { EventHandlers, UnsupportedBlock } from '@atlaskit/editor-common';

import { getPlatform } from '../../utils';
import { CardErrorBoundary } from './fallback';
import { RendererAppearance } from '../../ui/Renderer/types';
import { getCardClickHandler } from '../utils/getCardClickHandler';

export default function BlockCard(props: {
  url?: string;
  data?: object;
  eventHandlers?: EventHandlers;
  portal?: HTMLElement;
  rendererAppearance?: RendererAppearance;
}) {
  const { url, data, eventHandlers, portal, rendererAppearance } = props;
  const onClick = getCardClickHandler(eventHandlers, url);

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
