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
import { useFeatureFlags } from '../../use-feature-flags';
import { AnalyticsContext } from '@atlaskit/analytics-next';

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
  const featureFlags = useFeatureFlags();
  const { showAuthTooltip, showServerActions, ssr } = smartLinks || {};
  const analyticsData = {
    attributes: {
      location: 'renderer',
    },
    // Below is added for the future implementation of Linking Platform namespaced analytic context
    location: 'renderer',
  };

  if (ssr && url) {
    return (
      <AnalyticsContext data={analyticsData}>
        <CardSSR
          appearance="inline"
          url={url}
          showAuthTooltip={showAuthTooltip}
          showServerActions={showServerActions}
          onClick={onClick}
        />
      </AnalyticsContext>
    );
  }

  const onError = ({ err }: { err?: Error }) => {
    if (err) {
      throw err;
    }
  };

  return (
    <AnalyticsContext data={analyticsData}>
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
            showHoverPreview={featureFlags?.showHoverPreview}
            showAuthTooltip={showAuthTooltip}
            showServerActions={showServerActions}
            {...cardProps}
            onResolve={(data) => {
              if (!data.url || !data.title) {
                return;
              }

              props.smartCardStorage.set(data.url, data.title);
            }}
            onError={onError}
          />
        </CardErrorBoundary>
      </span>
    </AnalyticsContext>
  );
};

export default withSmartCardStorage(InlineCard);
