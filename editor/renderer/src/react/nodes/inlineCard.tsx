/** @jsx jsx */
import { css, jsx } from '@emotion/react';
import { Card } from '@atlaskit/smart-card';
import { CardSSR } from '@atlaskit/smart-card/ssr';
import { UnsupportedInline } from '@atlaskit/editor-common/ui';
import type { EventHandlers } from '@atlaskit/editor-common/ui';
import { token } from '@atlaskit/tokens';
import { N60A, Y300, Y75 } from '@atlaskit/theme/colors';
import { getBooleanFF } from '@atlaskit/platform-feature-flags';

import { CardErrorBoundary } from './fallback';
import type { WithSmartCardStorageProps } from '../../ui/SmartCardStorage';
import { withSmartCardStorage } from '../../ui/SmartCardStorage';
import { getCardClickHandler } from '../utils/getCardClickHandler';
import type { SmartLinksOptions } from '../../types/smartLinksOptions';
import { AnalyticsContext } from '@atlaskit/analytics-next';

export interface InlineCardProps {
  url?: string;
  data?: object;
  eventHandlers?: EventHandlers;
  portal?: HTMLElement;
  smartLinks?: SmartLinksOptions;
  marks?: string[];
}

const annotatedCard = css({
  // This is expected to be reworked as part of https://team.atlassian.com/project/ATLAS-61846/updates
  // eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
  "[data-mark-type='annotation'][data-mark-annotation-state='active'] &": {
    background: token('color.background.accent.yellow.subtler', Y75),
    borderBottom: `2px solid ${token('color.border.accent.yellow', Y300)}`,
    boxShadow: token(
      'elevation.shadow.overlay',
      `1px 2px 3px ${N60A}, -1px 2px 3px ${N60A}`,
    ),
    cursor: 'pointer',
    padding: `${token('space.050', '4px')} ${token('space.025', '2px')}`,
  },
});

const InlineCard = (props: InlineCardProps & WithSmartCardStorageProps) => {
  const { url, data, eventHandlers, portal, smartLinks } = props;
  const onClick = getCardClickHandler(eventHandlers, url);
  const cardProps = { url, data, onClick, container: portal };
  const {
    showAuthTooltip,
    hideHoverPreview,
    showServerActions,
    actionOptions,
    ssr,
  } = smartLinks || {};

  const analyticsData = {
    attributes: {
      location: 'renderer',
    },
    // Below is added for the future implementation of Linking Platform namespaced analytic context
    location: 'renderer',
  };

  if (ssr && url) {
    // platform.editor.allow-inline-comments-for-inline-nodes requires this change to work -- however this feature flag is only intended to go to HELLO (and is expected to last for Q4).
    // platform.editor.renderer-inline-card-ssr-fix_kqcwl is the feature flag that allows this change to be safely released more widely.
    // Once platform.editor.renderer-inline-card-ssr-fix_kqcwl reaches 100% we can remove both checks
    if (
      // eslint-disable-next-line @atlaskit/platform/no-invalid-feature-flag-usage
      getBooleanFF('platform.editor.renderer-inline-card-ssr-fix_kqcwl') ||
      // eslint-disable-next-line @atlaskit/platform/no-invalid-feature-flag-usage
      getBooleanFF('platform.editor.allow-inline-comments-for-inline-nodes')
    ) {
      return (
        <span
          data-inline-card
          data-card-data={data ? JSON.stringify(data) : undefined}
          data-card-url={url}
          css={annotatedCard}
        >
          <AnalyticsContext data={analyticsData}>
            <CardSSR
              appearance="inline"
              url={url}
              showAuthTooltip={showAuthTooltip}
              showHoverPreview={!hideHoverPreview}
              actionOptions={actionOptions}
              showServerActions={showServerActions}
              onClick={onClick}
            />
          </AnalyticsContext>
        </span>
      );
    }
    return (
      <AnalyticsContext data={analyticsData}>
        <CardSSR
          appearance="inline"
          url={url}
          showAuthTooltip={showAuthTooltip}
          showHoverPreview={!hideHoverPreview}
          actionOptions={actionOptions}
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
        css={
          getBooleanFF('platform.editor.allow-inline-comments-for-inline-nodes')
            ? annotatedCard
            : undefined
        }
      >
        <CardErrorBoundary
          unsupportedComponent={UnsupportedInline}
          {...cardProps}
        >
          <Card
            appearance="inline"
            showHoverPreview={!hideHoverPreview}
            showAuthTooltip={showAuthTooltip}
            actionOptions={actionOptions}
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
