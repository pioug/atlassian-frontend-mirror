import React from 'react';
import { Card } from '@atlaskit/smart-card';
import { CardSSR } from '@atlaskit/smart-card/ssr';
import { UnsupportedInline } from '@atlaskit/editor-common/ui';
import type { EventHandlers } from '@atlaskit/editor-common/ui';

import { CardErrorBoundary } from './fallback';
import {
  withSmartCardStorage,
  WithSmartCardStorageProps,
} from '../../ui/SmartCardStorage';
import { getCardClickHandler } from '../utils/getCardClickHandler';
import { SmartLinksOptions } from '../../types/smartLinksOptions';

export interface InlineCardProps {
  url?: string;
  data?: object;
  eventHandlers?: EventHandlers;
  portal?: HTMLElement;
  smartLinks?: SmartLinksOptions;
}

const InlineCard: React.FunctionComponent<
  InlineCardProps & WithSmartCardStorageProps
> = (props) => {
  const { url, data, eventHandlers, portal, smartLinks } = props;
  const onClick = getCardClickHandler(eventHandlers, url);
  const cardProps = { url, data, onClick, container: portal };

  if (smartLinks?.ssr && url) {
    return <CardSSR appearance="inline" url={url} />;
  }

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
          onResolve={(data) => {
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
