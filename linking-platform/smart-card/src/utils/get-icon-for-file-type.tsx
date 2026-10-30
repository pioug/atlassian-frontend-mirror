import React from 'react';

import Loadable from 'react-loadable';

import { fg } from '@atlaskit/platform-feature-flags/fg';

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

	if (fg('platform_sl_replace_react_loadable')) {
		const iconType = extractFileFormatIcon(fileMimeType.toLowerCase())?.icon;
		if (iconType) {
			const LazyIcon = getLazyIconComponent(`${iconType}:default`, importCb);
			const lazyLabel = (showIconLabel ?? true) ? icon[1] || '' : '';
			return (<LazyIcon testId="document-file-format-icon" label={lazyLabel} />) as React.ReactNode;
		}
	}

	const Icon = Loadable({
		loader: () => importCb().then((module) => module.default),
		loading: () => null,
	}) as any; // because we're using dynamic loading here, TS will not be able to infer the type

	const label = (showIconLabel ?? true) ? icon[1] || '' : '';
	return (<Icon testId="document-file-format-icon" label={label} />) as React.ReactNode;
};
