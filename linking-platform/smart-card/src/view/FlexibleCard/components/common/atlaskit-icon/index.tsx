import React from 'react';

import Loadable from 'react-loadable';

import { IconTile, type IconTileProps } from '@atlaskit/icon';
import { ConfluenceIcon, JiraIcon } from '@atlaskit/logo';
import { fg } from '@atlaskit/platform-feature-flags';
import { token } from '@atlaskit/tokens';

import { transformSmartLinkSizeToIconTileSize } from '../../../../../common/ui/icons/utils';
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

const getBlogIcon = () => require('../../../../../common/ui/icons/blog-icon').default;
const getDocumentIcon = () => require('../../../../../common/ui/icons/page-icon').default;
const getLiveDocumentIcon = () =>
	require('../../../../../common/ui/icons/live-document-icon').default;

const isCoreIcon = (icon: IconType): boolean => {
	return [
		IconType.Project,
		IconType.Template,
		IconType.Forbidden,
		IconType.Default,
		IconType.Error,
		IconType.Attachment,
		IconType.CheckItem,
		IconType.Component,
		IconType.Comment,
		IconType.View,
		IconType.React,
		IconType.Vote,
		IconType.PriorityUndefined,
		IconType.ProgrammingLanguage,
		IconType.Subscriber,
		IconType.SubTasksProgress,
	].includes(icon);
};

const AtlaskitIcon = ({
	icon,
	label,
	testId,
	size = SmartLinkSize.Medium,
	isTiledIcon,
}: AtlaskitIconProps): React.JSX.Element | null => {
	// Intentionally keep these three icon types synchronous and outside lazy imports.
	// These icons should be present in SSR markup so hydration does not cause a
	// visible empty-state-then-pop-in transition in Smart Link consumers.
	switch (icon) {
		case IconType.Document: {
			const DocumentIcon = getDocumentIcon();
			return (
				<DocumentIcon
					label={label ?? 'document'}
					testId={testId}
					size={size}
					isTiledIcon={isTiledIcon}
				/>
			);
		}
		case IconType.Blog: {
			const BlogIcon = getBlogIcon();
			return (
				<BlogIcon label={label ?? 'blog'} testId={testId} size={size} isTiledIcon={isTiledIcon} />
			);
		}
		case IconType.LiveDocument: {
			const LiveDocumentIcon = getLiveDocumentIcon();
			return (
				<LiveDocumentIcon
					label={label ?? 'live-doc'}
					testId={testId}
					size={size}
					isTiledIcon={isTiledIcon}
				/>
			);
		}
	}

	const importFn = getIconImportFn(icon, size);
	if (!importFn) {
		return null;
	}

	const ImportedIcon = importIcon(importFn);

	if (isCoreIcon(icon) && fg('platform_sl_icons_refactor')) {
		let color;
		if (icon === IconType.Error || icon === IconType.Forbidden) {
			color = token('color.icon.danger');
		}
		switch (size) {
			case SmartLinkSize.Small:
			case SmartLinkSize.Medium:
				return <ImportedIcon label={label} testId={testId} color={color} />;
			case SmartLinkSize.Large:
			case SmartLinkSize.XLarge:
				let appearance: IconTileProps['appearance'];
				if (icon === IconType.Error || icon === IconType.Forbidden) {
					appearance = 'redBold';
				} else {
					appearance = 'grayBold';
				}
				const iconTileSize = transformSmartLinkSizeToIconTileSize(size);
				if (iconTileSize) {
					return (
						<IconTile
							appearance={appearance}
							icon={
								isTiledIcon
									? (iconProps) => <ImportedIcon {...iconProps} spacing="spacious" />
									: ImportedIcon
							}
							size={iconTileSize}
							label={label ?? ''}
						/>
					);
				} else {
					return <ImportedIcon label={label} testId={testId} color={color} />;
				}
		}
	}

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
			if (fg('platform_sl_icons_refactor')) {
				return <ImportedIcon label={label} testId={testId} size={size} isTiledIcon={isTiledIcon} />;
			}
			return <ImportedIcon label={label} testId={testId} color={token('color.icon.danger')} />;
		default:
			return <ImportedIcon label={label} testId={testId} size={size} isTiledIcon={isTiledIcon} />;
	}
};

export default AtlaskitIcon;
