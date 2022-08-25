import React, { useMemo } from 'react';

import { AnalyticsContext } from '@atlaskit/analytics-next';
import { LinkPickerAnalyticsContextType } from '../../analytics.codegen';
import { normalizeUrl } from '../../common/utils/url';

export function withLinkPickerAnalyticsContext<P extends { url?: string }>(
  WrappedComponent: React.ComponentType<P>,
): React.ComponentType<P> {
  return (props: P) => {
    const data: { attributes: LinkPickerAnalyticsContextType } = useMemo(
      () => ({
        attributes: {
          linkState: normalizeUrl(props.url) ? 'editLink' : 'newLink',
        },
      }),
      [props.url],
    );

    return (
      <AnalyticsContext data={data}>
        <WrappedComponent {...props} />
      </AnalyticsContext>
    );
  };
}
