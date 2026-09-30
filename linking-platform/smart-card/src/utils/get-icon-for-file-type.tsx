import React from 'react';

import Loadable from 'react-loadable';

import extractFileFormatIcon from '../extractors/flexible/icon/extract-file-formatIcon';
import { getLazyIcons } from './get-lazy-icons';

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

	const Icon = Loadable({
		loader: () => importCb().then((module) => module.default),
		loading: () => null,
	}) as any; // because we're using dynamic loading here, TS will not be able to infer the type

	const label = (showIconLabel ?? true) ? icon[1] || '' : '';
	return (<Icon testId="document-file-format-icon" label={label} />) as React.ReactNode;
};
