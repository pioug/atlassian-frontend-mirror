import React, { useEffect, useState } from 'react';

import styled from 'styled-components';

import { N0 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

import { useMacroViewedAnalyticsEvent } from '../../../common/utils';

import { PlaceholderComponentProps } from './types';

class MacroPlaceholderImageError {
  constructor() {}
}

const PlaceholderImage = styled.img`
  max-width: ${(props) => `${props.width}px`};
  background-color: ${token('elevation.surface', N0)};
  padding: ${token('space.100', '8px')};
  width: 100%;
  box-sizing: border-box;
`;

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

  const openImageInWebView = (url: String) => {
    createPromise('customOpenUrlInWebView', url)
      .submit()
      .catch(() => {});
  };

  if (placeholderDataUrl != null) {
    return !(placeholderDataUrl instanceof MacroPlaceholderImageError) ? (
      <PlaceholderImage
        onClick={() => openImageInWebView(placeholderDataUrl)}
        src={placeholderDataUrl}
        data-testid="placeholder-image"
        width={window.innerWidth}
      />
    ) : (
      renderFallback()
    );
  } else {
    return null;
  }
};
