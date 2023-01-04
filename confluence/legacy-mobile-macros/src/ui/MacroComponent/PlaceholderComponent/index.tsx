import React, { useEffect, useState } from 'react';

import { useMacroViewedAnalyticsEvent } from '../../../common/utils';

import { PlaceholderComponentProps } from './types';

class MacroPlaceholderImageError {
  constructor() {}
}

export const PlaceholderComponent = (props: PlaceholderComponentProps) => {
  const { createPromise, extension, renderFallback } = props;
  const { extensionKey } = extension;
  const fireMacroViewedAnalyticsEvent = useMacroViewedAnalyticsEvent();
  useEffect(() => {
    fireMacroViewedAnalyticsEvent(extensionKey, 'placeholderUrl');
  }, [extensionKey, fireMacroViewedAnalyticsEvent]);

  const [placeholderDataUrl, setPlaceholderDataUrl] = useState<
    string | MacroPlaceholderImageError | null
  >(null);

  const placeholderRemoteUrl =
    extension.parameters?.macroMetadata?.placeholder[0]?.data?.url;

  useEffect(() => {
    if (placeholderRemoteUrl) {
      createPromise('customMacroPlaceholderImage', placeholderRemoteUrl)
        .submit()
        .then((response: any) => {
          if (
            !('placeholderDataUrl' in response) &&
            Object.keys(response).length > 0
          ) {
            const firstKey = Object.keys(response)[0];
            response = response[firstKey];
          }
          if (response.placeholderDataUrl) {
            setPlaceholderDataUrl(response.placeholderDataUrl);
          } else {
            setPlaceholderDataUrl(new MacroPlaceholderImageError());
          }
        })
        .catch(() => {
          setPlaceholderDataUrl(new MacroPlaceholderImageError());
        });
    }
  }, [createPromise, setPlaceholderDataUrl, placeholderRemoteUrl]);

  if (placeholderDataUrl != null) {
    return !(placeholderDataUrl instanceof MacroPlaceholderImageError) ? (
      <a href={placeholderDataUrl}>
        <img src={placeholderDataUrl} data-testid="placeholder-image" />
      </a>
    ) : (
      renderFallback()
    );
  } else {
    return null;
  }
};
