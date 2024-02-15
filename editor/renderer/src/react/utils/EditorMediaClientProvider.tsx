import React, { useContext, useEffect, useMemo, useState } from 'react';
import type { FC } from 'react';
import {
  MediaClientContext,
  getMediaClient,
} from '@atlaskit/media-client-react';
import type { MediaClientConfig } from '@atlaskit/media-core';
import { useProvider } from '@atlaskit/editor-common/provider-factory';
import type { MediaSSR } from '../../types/mediaOptions';

export const EditorMediaClientProvider: FC<{
  ssr?: MediaSSR;
}> = ({ children, ssr }) => {
  const [mediaClientConfig, setMediaClientConfig] = useState<
    MediaClientConfig | undefined
  >();

  const mediaProvider = useProvider('mediaProvider');

  const contextMediaClient = useContext(MediaClientContext);

  // MediaClientProvider currently requires a mediaClientConfig
  // And inserting the MediaClientProvider will cause a re-render
  // We should use MediaClientProvider once it no longer requires a config
  const mediaClient = useMemo(
    () => (mediaClientConfig ? getMediaClient(mediaClientConfig) : undefined),
    [mediaClientConfig],
  );

  // Consumers can override the mediaClient for renderer,
  // by not providing both SSR config and mediaProvider,
  // and provide a top level mediaClient context
  // This is useful for testing and creating examples.
  useEffect(() => {
    if (ssr?.config) {
      setMediaClientConfig(ssr.config);
    } else if (mediaProvider) {
      mediaProvider.then((provider) => {
        setMediaClientConfig(provider.viewMediaClientConfig);
      });
    }
  }, [mediaProvider, ssr]);

  return (
    <MediaClientContext.Provider value={mediaClient || contextMediaClient}>
      {children}
    </MediaClientContext.Provider>
  );
};
