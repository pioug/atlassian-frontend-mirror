import type { MediaClientConfig } from '@atlaskit/media-core';
import type { MediaFeatureFlags, SSR } from '@atlaskit/media-common';

export type MediaSSR = { mode: SSR; config: MediaClientConfig };

export interface MediaOptions {
  allowLinking?: boolean;
  enableDownloadButton?: boolean;
  featureFlags?: MediaFeatureFlags;
  ssr?: MediaSSR;
  allowCaptions?: boolean;
}
