import type { SSR } from '@atlaskit/media-common';
import type { MediaClientConfig } from '@atlaskit/media-core';

export type MediaInlineAttrs = {
	alt?: string;
	height?: number;
	type?: string;
	width?: number;
};

export type MediaSSR = { config: MediaClientConfig; mode: SSR };

export type Dimensions = { height?: number; width?: number };
