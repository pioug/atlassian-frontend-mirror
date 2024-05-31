import type { SSR } from '@atlaskit/media-common';
import type { MediaClientConfig } from '@atlaskit/media-core';

export type MediaInlineAttrs = {
	type?: string;
	alt?: string;
	width?: number;
	height?: number;
};

export type MediaSSR = { mode: SSR; config: MediaClientConfig };

export type Dimensions = { width?: number; height?: number };
