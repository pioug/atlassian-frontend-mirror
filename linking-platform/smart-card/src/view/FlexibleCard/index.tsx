import React, { useEffect, useMemo } from 'react';

import { FlexibleCardProps } from './types';
import { SmartLinkStatus } from '../../constants';
import Container from './components/container';
import {
  FlexibleUiAnalyticsContext,
  FlexibleUiContext,
  FlexibleUiOptionContext,
} from '../../state/flexible-ui-context';
import { getContextByStatus, getRetryOptions } from './utils';
import { useAISummaryConfig } from '../../state/hooks/use-ai-summary-config';

/**
 * This represents a Flexible Card: a link represented by a card with metadata.
 * This is the container in which all Flexible UI Blocks and Elements exist.
 * Note: TitleBlock is mandatory for a Flexible Card to render.
 * @see Container
 */
const FlexibleCard: React.FC<FlexibleCardProps> = ({
  analytics,
  appearance = 'flexible',
  cardState,
  children,
  id,
  onAuthorize,
  onClick,
  onError,
  onResolve,
  renderers,
  showAuthTooltip,
  showHoverPreview,
  actionOptions,
  testId,
  ui,
  url,
}: React.PropsWithChildren<FlexibleCardProps>) => {
  const aiSummaryConfig = useAISummaryConfig();

  const { status: cardType, details } = cardState;
  const status = cardType as SmartLinkStatus;

  const context = useMemo(
    () =>
      getContextByStatus({
        aiSummaryConfig,
        response: details,
        id,
        renderers,
        actionOptions,
        status,
        url,
      }),
    [aiSummaryConfig, details, id, renderers, actionOptions, status, url],
  );
  const retry = getRetryOptions(url, status, details, onAuthorize);
  const { title } = context || {};

  const analyticsContext = useMemo(
    () =>
      analytics
        ? {
            ...analytics,
            display: appearance,
            extensionKey: details?.meta?.key,
          }
        : undefined,
    [analytics, appearance, details?.meta?.key],
  );

  useEffect(() => {
    switch (status) {
      case SmartLinkStatus.Resolved:
        if (onResolve) {
          onResolve({ title, url });
        }
        break;
      case SmartLinkStatus.Errored:
      case SmartLinkStatus.Fallback:
      case SmartLinkStatus.Forbidden:
      case SmartLinkStatus.NotFound:
      case SmartLinkStatus.Unauthorized:
        if (onError) {
          onError({ status, url });
        }
        break;
    }
  }, [onError, onResolve, status, title, url]);

  return (
    <FlexibleUiAnalyticsContext.Provider value={analyticsContext}>
      <FlexibleUiOptionContext.Provider value={ui}>
        <FlexibleUiContext.Provider value={context}>
          <Container
            testId={testId}
            {...ui}
            onClick={onClick}
            retry={retry}
            showHoverPreview={showHoverPreview}
            actionOptions={actionOptions}
            showAuthTooltip={showAuthTooltip}
            status={status}
          >
            {children}
          </Container>
        </FlexibleUiContext.Provider>
      </FlexibleUiOptionContext.Provider>
    </FlexibleUiAnalyticsContext.Provider>
  );
};

export default FlexibleCard;
