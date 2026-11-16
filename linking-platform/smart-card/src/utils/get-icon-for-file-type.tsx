import React from 'react';

import extractFileFormatIcon from '../extractors/flexible/icon/extract-file-formatIcon';
import { getLazyIcons } from './get-lazy-icons';
import { getLazyIconComponent } from './lazy-component';

type IconLabelMap = [(() => Promise<any>) | undefined];

type IconLabelMapNew = [(() => Promise<any>) | undefined, string];

const getTypeToIconMap = (fileFormat: string): IconLabelMap | IconLabelMapNew | null => {
	const iconDescriptor = extractFileFormatIcon(fileFormat);
	if (!iconDescriptor?.icon) {
		return null;
	}

	const lazyIcons = getLazyIcons();

	return [lazyIcons[iconDescriptor.icon]?.default, iconDescriptor.label ?? ''];
};

export const getIconForFileType = (
	fileMimeType: string,
	showIconLabel?: boolean,
): React.ReactNode | undefined => {
	if (!fileMimeType) {
		return;
	}
	let icon = getTypeToIconMap(fileMimeType.toLowerCase());
	if (!icon) {
		return;
	}

	const [importCb] = icon;

	if (!importCb) {
		return;
	}

	const iconType = extractFileFormatIcon(fileMimeType.toLowerCase())?.icon;
	if (!iconType) {
		return;
	}

	const LazyIcon = getLazyIconComponent(`${iconType}:default`, importCb);
	const label = (showIconLabel ?? true) ? icon[1] || '' : '';
	return (<LazyIcon testId="document-file-format-icon" label={label} />) as React.ReactNode;
};
