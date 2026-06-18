import React from 'react';

import Loadable from 'react-loadable';

import { fg } from '@atlaskit/platform-feature-flags';

import { IconType } from './constants';
import extractFileFormatIcon from './extract-file-format-icon';

type IconLabelMap = [(() => Promise<any>) | undefined];
type IconLabelMapNew = [(() => Promise<any>) | undefined, string];

const getLazyIcons = (): Partial<
	Record<
		IconType,
		{
			default: () => Promise<unknown>;
		}
	>
> => ({
	[IconType.Document]: { default: () => import('./common/ui/icons/page-icon') },
	[IconType.Audio]: { default: () => import('./common/ui/icons/audio-icon') },
	[IconType.Code]: { default: () => import('./common/ui/icons/angle-brackets-icon') },
	[IconType.File]: { default: () => import('./common/ui/icons/file-icon') },
	[IconType.Folder]: { default: () => import('./common/ui/icons/folder-icon') },
	[IconType.Generic]: { default: () => import('./common/ui/icons/file-icon') },
	[IconType.Image]: { default: () => import('./common/ui/icons/image-icon') },
	[IconType.Presentation]: { default: () => import('./common/ui/icons/chart-bar-icon') },
	[IconType.Spreadsheet]: { default: () => import('./common/ui/icons/list-bullet-icon') },
	[IconType.Video]: { default: () => import('./common/ui/icons/video-icon') },
	[IconType.Archive]: {
		default: () => import('@atlaskit/icon-file-type/glyph/archive/16'),
	},
	[IconType.Executable]: {
		default: () => import('@atlaskit/icon-file-type/glyph/executable/16'),
	},
	[IconType.GIF]: {
		default: () => import('@atlaskit/icon-file-type/glyph/gif/16'),
	},
	[IconType.GoogleDocs]: {
		default: () => import('@atlaskit/icon-file-type/glyph/google-doc/16'),
	},
	[IconType.GoogleForms]: {
		default: () => import('@atlaskit/icon-file-type/glyph/google-form/16'),
	},
	[IconType.GoogleSheets]: {
		default: () => import('@atlaskit/icon-file-type/glyph/google-sheet/16'),
	},
	[IconType.GoogleSlides]: {
		default: () => import('@atlaskit/icon-file-type/glyph/google-slide/16'),
	},
	[IconType.MSExcel]: {
		default: () => import('@atlaskit/icon-file-type/glyph/excel-spreadsheet/16'),
	},
	[IconType.MSPowerpoint]: {
		default: () => import('@atlaskit/icon-file-type/glyph/powerpoint-presentation/16'),
	},
	[IconType.MSWord]: {
		default: () => import('@atlaskit/icon-file-type/glyph/word-document/16'),
	},
	[IconType.PDF]: {
		default: () => import('@atlaskit/icon-file-type/glyph/pdf-document/16'),
	},
	[IconType.Sketch]: {
		default: () => import('@atlaskit/icon-file-type/glyph/sketch/16'),
	},
});

const getTypeToIconMap = (fileFormat: string): IconLabelMap | IconLabelMapNew | null => {
	const iconDescriptor = extractFileFormatIcon(fileFormat);
	if (!iconDescriptor?.icon) {
		return null;
	}

	const lazyIcons = getLazyIcons();

	if (fg('platform_navx_smart_link_icon_label_a11y')) {
		return [lazyIcons[iconDescriptor.icon]?.default, iconDescriptor.label ?? ''];
	}
	return [lazyIcons[iconDescriptor.icon]?.default];
};

export const getIconForFileType = (
	fileMimeType: string,
	showIconLabel?: boolean,
): React.ReactNode | undefined => {
	if (!fileMimeType) {
		return;
	}
	const icon = getTypeToIconMap(fileMimeType.toLowerCase());
	if (!icon) {
		return;
	}

	const [importCb] = icon;

	if (!importCb) {
		return;
	}

	const Icon = Loadable({
		loader: () => importCb().then((module) => module.default),
		loading: () => null,
	}) as any;

	if (fg('platform_navx_smart_link_icon_label_a11y')) {
		const descriptorLabel = icon[1] || '';
		const label = (showIconLabel ?? true) ? descriptorLabel : '';
		return <Icon testId="document-file-format-icon" label={label} />;
	}

	return <Icon testId="document-file-format-icon" />;
};
