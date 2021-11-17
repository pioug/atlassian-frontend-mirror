import { MediaClientConfig } from '@atlaskit/media-core';
import { MediaFeatureFlags, SSR } from '@atlaskit/media-common';

export type MediaSSR = { mode: SSR; config: MediaClientConfig };

export interface MediaOptions {
  allowLinking?: boolean;
  enableDownloadButton?: boolean;
  featureFlags?: MediaFeatureFlags;
  ssr?: MediaSSR;
}
