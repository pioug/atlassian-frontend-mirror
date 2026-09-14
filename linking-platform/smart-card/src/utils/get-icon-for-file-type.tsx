import React from 'react';

import Loadable from 'react-loadable';

import { fg } from '@atlaskit/platform-feature-flags/fg';

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

	if (fg('platform_navx_smart_link_icon_label_a11y')) {
		return [lazyIcons[iconDescriptor.icon]?.default, iconDescriptor.label ?? ''];
	} else {
		return [lazyIcons[iconDescriptor.icon]?.default];
	}
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

	if (fg('platform_navx_smart_link_icon_label_a11y')) {
		const descriptorLabel = icon[1] || ''; // NAVX-4354: Combine into const [importCb] = icon; above
		const label = (showIconLabel ?? true) ? descriptorLabel : '';
		return (<Icon testId="document-file-format-icon" label={label} />) as React.ReactNode;
	} else {
		return (<Icon testId="document-file-format-icon" />) as React.ReactNode;
	}
};
