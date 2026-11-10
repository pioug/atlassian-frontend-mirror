import type { ComponentType } from 'react';

import type { MessageDescriptor } from 'react-intl';

/** An image asset with a light default and an optional dark theme variant. */
export type PreviewImage = {
	dark?: string;
	light: string;
	/**
	 * How the image fills the preview's fixed-height image area, as CSS `object-fit`. Defaults to
	 * `contain`, which shows the whole image. Use `cover` only for images whose edges are
	 * background, since it crops whatever doesn't fit the area's shape.
	 */
	objectFit?: 'contain' | 'cover';
};

export type QuickInsertPreview = {
	attribution?: {
		/** Decorative icon shown at a fixed 16px size beside the attribution. */
		icon?: ComponentType;
		/** Display name or message to localize; Editor adds a localized prefix when no icon is supplied. */
		name: string | MessageDescriptor;
	};
	/** Optional image; text and attribution still render when an image is omitted or fails to load. */
	image?: PreviewImage;
};
