/**
 * Entry Point: @atlaskit/media-card/types
 */

import type { CardPreview } from './types';

export const isSSRDataPreview = (preview: CardPreview): boolean => preview.source === 'ssr-data';
