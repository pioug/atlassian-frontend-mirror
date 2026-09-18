import React from 'react';

import type { MenuItem } from '@atlaskit/editor-common/extensions';
import CarouselIcon from '@atlaskit/icon-lab/core/carousel';
import TableOfContentIcon from '@atlaskit/icon-lab/core/table-of-content';
import TemplateIcon from '@atlaskit/icon-lab/core/template';
import AppsIcon from '@atlaskit/icon/core/apps';
import CardIcon from '@atlaskit/icon/core/card';
import WhiteboardIcon from '@atlaskit/icon/core/whiteboard';

type ExtensionIcon = React.ComponentType<{ label: string }>;

const lazyExtensionIconCache = new WeakMap<NonNullable<MenuItem['icon']>, ExtensionIcon>();

const whiteboardQuickInsertItemKeys = new Set([
	'whiteboard-extension:create-whiteboard',
	'whiteboard-extension:create-diagram',
	'whiteboard-extension:create-flowchart',
	'whiteboard-extension:create-brainstorming',
	'whiteboard-extension:create-retrospective',
	'whiteboard-extension:create-roadmap',
]);

const quickInsertItemIcons: Readonly<Record<string, ExtensionIcon>> = {
	'toc:toc': TableOfContentIcon,
	'cards:quick-insert': CardIcon,
	'carousel:quick-insert': CarouselIcon,
	'create-from-template:create-from-template': TemplateIcon,
};

const resolveExtensionIcon = async (getIcon: MenuItem['icon']): Promise<ExtensionIcon> => {
	try {
		const maybeIcon = await getIcon?.();
		if (!maybeIcon) {
			return AppsIcon;
		}
		if (Object.prototype.hasOwnProperty.call(maybeIcon, 'default')) {
			return (maybeIcon as { default?: ExtensionIcon }).default ?? AppsIcon;
		}
		return maybeIcon as ExtensionIcon;
	} catch {
		return AppsIcon;
	}
};

const createLazyExtensionIcon = (getIcon: NonNullable<MenuItem['icon']>): ExtensionIcon => {
	const cachedIcon = lazyExtensionIconCache.get(getIcon);
	if (cachedIcon) {
		return cachedIcon;
	}

	const LazyIcon = React.lazy(() =>
		resolveExtensionIcon(getIcon).then((Icon) => ({ default: Icon })),
	) as React.NamedExoticComponent<React.ComponentProps<ExtensionIcon>>;
	LazyIcon.displayName = 'lazy(ExtensionIcon)';

	const Icon: ExtensionIcon = (props) => (
		<React.Suspense fallback={<AppsIcon label={props.label} />}>
			<LazyIcon label={props.label} />
		</React.Suspense>
	);

	lazyExtensionIconCache.set(getIcon, Icon);
	return Icon;
};

export const ExtensionQuickInsertIcon = ({
	getIcon,
	itemKey,
	label,
}: {
	getIcon?: MenuItem['icon'];
	itemKey: string;
	label: string;
}): React.JSX.Element => {
	const Icon = React.useMemo(() => {
		const quickInsertItemIcon = quickInsertItemIcons[itemKey];
		if (quickInsertItemIcon) {
			return quickInsertItemIcon;
		}

		if (whiteboardQuickInsertItemKeys.has(itemKey)) {
			return WhiteboardIcon;
		}

		return getIcon ? createLazyExtensionIcon(getIcon) : AppsIcon;
	}, [getIcon, itemKey]);

	return <Icon label={label} />;
};
