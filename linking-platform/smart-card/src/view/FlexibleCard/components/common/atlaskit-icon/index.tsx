import React from 'react';

import Loadable from 'react-loadable';

import { ConfluenceIcon, JiraIcon } from '@atlaskit/logo';
import { fg } from '@atlaskit/platform-feature-flags';
import { token } from '@atlaskit/tokens';

import BlogIcon from '../../../../../common/ui/icons/blog-icon';
import LiveDocumentIcon from '../../../../../common/ui/icons/live-document-icon';
import DocumentIcon from '../../../../../common/ui/icons/page-icon';
import { IconType, SmartLinkSize } from '../../../../../constants';
import { getLazyIcons, isIconSizeLarge } from '../../../../../utils';

import { type AtlaskitIconProps } from './types';

const getIconImportFn = (icon: IconType, size: SmartLinkSize): (() => Promise<any>) | undefined => {
	const item = getLazyIcons()[icon];
	if (isIconSizeLarge(size) && item?.large) {
		return item.large;
	}
	return item?.default;
};

const importIcon = (importFn: () => Promise<any>): any => {
	return Loadable({
		loader: () => importFn().then((module) => module.default),
		loading: () => null,
	}) as any; // Because we're using dynamic loading here, TS will not be able to infer the type.
};

const AtlaskitIcon = ({
	icon,
	label,
	testId,
	size = SmartLinkSize.Medium,
}: AtlaskitIconProps): React.JSX.Element | null => {
	// Check for synchonously loaded icons first for SSR purposes
	switch (icon) {
		case IconType.Document:
			return <DocumentIcon label={label ?? 'document'} testId={testId} size={size} />;
		case IconType.Blog:
			return <BlogIcon label={label ?? 'blog'} testId={testId} size={size} />;
		case IconType.LiveDocument:
			return <LiveDocumentIcon label={label ?? 'live-doc'} testId={testId} size={size} />;
	}

	const importFn = getIconImportFn(icon, size);
	if (!importFn) {
		return null;
	}

	const ImportedIcon = importIcon(importFn);

	switch (icon) {
		case IconType.Confluence:
			return (
				<ConfluenceIcon
					appearance="brand"
					testId={testId}
					size={size === SmartLinkSize.Large || size === SmartLinkSize.XLarge ? 'small' : 'xxsmall'}
					{...(fg('navx-1895-new-logo-design') ? { shouldUseNewLogoDesign: true } : undefined)}
				/>
			);
		case IconType.Jira:
			return (
				<JiraIcon
					appearance="brand"
					testId={testId}
					size={size === SmartLinkSize.Large || size === SmartLinkSize.XLarge ? 'small' : 'xxsmall'}
					{...(fg('navx-1895-new-logo-design') ? { shouldUseNewLogoDesign: true } : undefined)}
				/>
			);
		case IconType.Error:
		case IconType.Forbidden:
			return <ImportedIcon label={label} testId={testId} color={token('color.icon.danger')} />;
		default:
			return <ImportedIcon label={label} testId={testId} size={size} />;
	}
};

export default AtlaskitIcon;
