import type { ComponentType } from 'react';

/** An image asset with a light default and an optional dark theme variant. */
export type PreviewImage = {
	dark?: string;
	light: string;
};

export type QuickInsertPreview = {
	attribution?: {
		/** Decorative icon shown at a fixed 16px size beside the attribution. */
		icon?: ComponentType;
		/** Localized display name; Editor adds a localized prefix when no icon is supplied. */
		name: string;
	};
	/** Optional image; text and attribution still render when an image is omitted or fails to load. */
	image?: PreviewImage;
};
