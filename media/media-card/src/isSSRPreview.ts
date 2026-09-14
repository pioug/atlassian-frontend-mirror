/**
 * Entry Point: @atlaskit/media-card/types
 */

import { isSSRClientPreview } from './isSSRClientPreview';
import { isSSRDataPreview } from './isSSRDataPreview';
import { isSSRServerPreview } from './isSSRServerPreview';
import type { CardPreview } from './types';

export const isSSRPreview = (preview: CardPreview): boolean =>
	isSSRClientPreview(preview) || isSSRServerPreview(preview) || isSSRDataPreview(preview);
