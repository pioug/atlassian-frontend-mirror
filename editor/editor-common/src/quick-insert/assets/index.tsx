import React from 'react';

import Loadable from 'react-loadable';

import type { HeadingLevels, IconProps } from '../../types';

export const IconAction = Loadable({
	loader: () =>
		import(/* webpackChunkName: "@atlaskit-internal_editor-icon-action" */ './action').then(
			(module) => module.default,
		) as Promise<React.ComponentType<React.PropsWithChildren<IconProps>>>,
	loading: () => null,
});

export const IconCode = Loadable({
	loader: () =>
		import(/* webpackChunkName: "@atlaskit-internal_editor-icon-code" */ './code').then(
			(module) => module.default,
		) as Promise<React.ComponentType<React.PropsWithChildren<IconProps>>>,
	loading: () => null,
});

export const IconDate = Loadable({
	loader: () =>
		import(/* webpackChunkName: "@atlaskit-internal_editor-icon-date" */ './date').then(
			(module) => module.default,
		) as Promise<React.ComponentType<React.PropsWithChildren<IconProps>>>,
	loading: () => null,
});

export const IconDecision = Loadable({
	loader: () =>
		import(/* webpackChunkName: "@atlaskit-internal_editor-icon-decision" */ './decision').then(
			(module) => module.default,
		) as Promise<React.ComponentType<React.PropsWithChildren<IconProps>>>,
	loading: () => null,
});

export const IconDivider = Loadable({
	loader: () =>
		import(/* webpackChunkName: "@atlaskit-internal_editor-icon-divider" */ './divider').then(
			(module) => module.default,
		) as Promise<React.ComponentType<React.PropsWithChildren<IconProps>>>,
	loading: () => null,
});

export const IconEmoji = Loadable({
	loader: () =>
		import(/* webpackChunkName: "@atlaskit-internal_editor-icon-emoji" */ './emoji').then(
			(module) => module.default,
		) as Promise<React.ComponentType<React.PropsWithChildren<IconProps>>>,
	loading: () => null,
});

export const IconImages = Loadable({
	loader: () =>
		import(/* webpackChunkName: "@atlaskit-internal_editor-icon-images" */ './images').then(
			(module) => module.default,
		) as Promise<React.ComponentType<React.PropsWithChildren<IconProps>>>,
	loading: () => null,
});

export const IconLayout = Loadable({
	loader: () =>
		import(/* webpackChunkName: "@atlaskit-internal_editor-icon-layout" */ './layout').then(
			(module) => module.default,
		) as Promise<React.ComponentType<React.PropsWithChildren<IconProps>>>,
	loading: () => null,
});

export const IconLink = Loadable({
	loader: () =>
		import(/* webpackChunkName: "@atlaskit-internal_editor-icon-link" */ './link').then(
			(module) => module.default,
		) as Promise<React.ComponentType<React.PropsWithChildren<IconProps>>>,
	loading: () => null,
});

export const IconListNumber = Loadable({
	loader: () =>
		import(
			/* webpackChunkName: "@atlaskit-internal_editor-icon-list-number" */ './list-number'
		).then((module) => module.default) as Promise<
			React.ComponentType<React.PropsWithChildren<IconProps>>
		>,
	loading: () => null,
});

export const IconList = Loadable({
	loader: () =>
		import(/* webpackChunkName: "@atlaskit-internal_editor-icon-list" */ './list').then(
			(module) => module.default,
		) as Promise<React.ComponentType<React.PropsWithChildren<IconProps>>>,
	loading: () => null,
});

export const IconMention = Loadable({
	loader: () =>
		import(/* webpackChunkName: "@atlaskit-internal_editor-icon-mention" */ './mention').then(
			(module) => module.default,
		) as Promise<React.ComponentType<React.PropsWithChildren<IconProps>>>,
	loading: () => null,
});

export const IconPanelError = Loadable({
	loader: () =>
		import(
			/* webpackChunkName: "@atlaskit-internal_editor-icon-panel-error" */ './panel-error'
		).then((module) => module.default) as Promise<
			React.ComponentType<React.PropsWithChildren<IconProps>>
		>,
	loading: () => null,
});

export const IconPanelNote = Loadable({
	loader: () =>
		import(/* webpackChunkName: "@atlaskit-internal_editor-icon-panel-note" */ './panel-note').then(
			(module) => module.default,
		) as Promise<React.ComponentType<React.PropsWithChildren<IconProps>>>,
	loading: () => null,
});

export const IconPanelSuccess = Loadable({
	loader: () =>
		import(
			/* webpackChunkName: "@atlaskit-internal_editor-icon-panel-success" */ './panel-success'
		).then((module) => module.default) as Promise<
			React.ComponentType<React.PropsWithChildren<IconProps>>
		>,
	loading: () => null,
});

export const IconPanelWarning = Loadable({
	loader: () =>
		import(
			/* webpackChunkName: "@atlaskit-internal_editor-icon-panel-warning" */ './panel-warning'
		).then((module) => module.default) as Promise<
			React.ComponentType<React.PropsWithChildren<IconProps>>
		>,
	loading: () => null,
});

export const IconPanel = Loadable({
	loader: () =>
		import(/* webpackChunkName: "@atlaskit-internal_editor-icon-panel" */ './panel').then(
			(module) => module.default,
		) as Promise<React.ComponentType<React.PropsWithChildren<IconProps>>>,
	loading: () => null,
});

export const IconQuote = Loadable({
	loader: () =>
		import(/* webpackChunkName: "@atlaskit-internal_editor-icon-quote" */ './quote').then(
			(module) => module.default,
		) as Promise<React.ComponentType<React.PropsWithChildren<IconProps>>>,
	loading: () => null,
});

export const IconStatus = Loadable({
	loader: () =>
		import(/* webpackChunkName: "@atlaskit-internal_editor-icon-status" */ './status').then(
			(module) => module.default,
		) as Promise<React.ComponentType<React.PropsWithChildren<IconProps>>>,
	loading: () => null,
});

export const IconOneColumnLayout = Loadable({
	loader: () =>
		import(
			/* webpackChunkName: "@atlaskit-internal_editor-icon-one-column-layout" */ './one-column-layout'
		).then((module) => module.default) as Promise<
			React.ComponentType<React.PropsWithChildren<IconProps>>
		>,
	loading: () => null,
});

export const IconTwoColumnLayout = Loadable({
	loader: () =>
		import(
			/* webpackChunkName: "@atlaskit-internal_editor-icon-two-column-layout" */ './two-column-layout'
		).then((module) => module.default) as Promise<
			React.ComponentType<React.PropsWithChildren<IconProps>>
		>,
	loading: () => null,
});
export const IconThreeColumnLayout = Loadable({
	loader: () =>
		import(
			/* webpackChunkName: "@atlaskit-internal_editor-icon-three-column-layout" */ './three-column-layout'
		).then((module) => module.default) as Promise<
			React.ComponentType<React.PropsWithChildren<IconProps>>
		>,
	loading: () => null,
});
export const IconFourColumnLayout = Loadable({
	loader: () =>
		import(
			/* webpackChunkName: "@atlaskit-internal_editor-icon-four-column-layout" */ './four-column-layout'
		).then((module) => module.default) as Promise<
			React.ComponentType<React.PropsWithChildren<IconProps>>
		>,
	loading: () => null,
});
export const IconFiveColumnLayout = Loadable({
	loader: () =>
		import(
			/* webpackChunkName: "@atlaskit-internal_editor-icon-five-column-layout" */ './five-column-layout'
		).then((module) => module.default) as Promise<
			React.ComponentType<React.PropsWithChildren<IconProps>>
		>,
	loading: () => null,
});

type HeadingProps = IconProps & {
	level: HeadingLevels;
};

function importHeading(level: HeadingLevels) {
	switch (level) {
		case 1:
			return import(
				/* webpackChunkName: "@atlaskit-internal_editor-icon-heading-1" */ `./heading1`
			);
		case 2:
			return import(
				/* webpackChunkName: "@atlaskit-internal_editor-icon-heading-2" */ `./heading2`
			);
		case 3:
			return import(
				/* webpackChunkName: "@atlaskit-internal_editor-icon-heading-3" */ `./heading3`
			);
		case 4:
			return import(
				/* webpackChunkName: "@atlaskit-internal_editor-icon-heading-4" */ `./heading4`
			);
		case 5:
			return import(
				/* webpackChunkName: "@atlaskit-internal_editor-icon-heading-5" */ `./heading5`
			);
		case 6:
		default:
			return import(
				/* webpackChunkName: "@atlaskit-internal_editor-icon-heading-6" */ `./heading6`
			);
	}
}

export const IconHeading = ({ level, ...props }: HeadingProps) => {
	const Icon = Loadable({
		loader: () =>
			importHeading(level).then((module) => module.default) as Promise<
				React.ComponentType<React.PropsWithChildren<IconProps>>
			>,
		loading: () => null,
	});
	// Ignored via go/ees005
	// eslint-disable-next-line react/jsx-props-no-spreading
	return <Icon {...props} />;
};

export const IconFeedback = Loadable({
	loader: () =>
		import(/* webpackChunkName: "@atlaskit-internal_editor-icon-feedback" */ './feedback').then(
			(module) => module.default,
		) as Promise<React.ComponentType<React.PropsWithChildren<IconProps>>>,
	loading: () => null,
});

export const IconExpand = Loadable({
	loader: () =>
		import(/* webpackChunkName: "@atlaskit-internal_editor-icon-expand" */ './expand').then(
			(module) => module.default,
		) as Promise<React.ComponentType<React.PropsWithChildren<IconProps>>>,
	loading: () => null,
});

export const IconDatasourceJiraIssue = Loadable({
	loader: () =>
		import(
			/* webpackChunkName: "@atlaskit-internal_editor-icon-datasource-jira-issue" */ './datasource-jira-issue'
		).then((module) => module.default) as Promise<
			React.ComponentType<React.PropsWithChildren<IconProps>>
		>,
	loading: () => null,
});

export const IconDatasourceAssetsObjects = Loadable({
	loader: () =>
		import(
			/* webpackChunkName: "@atlaskit-internal_editor-icon-datasource-assets-objects" */ './datasource-assets-objects'
		).then((module) => module.default) as Promise<
			React.ComponentType<React.PropsWithChildren<IconProps>>
		>,
	loading: () => null,
});

export const IconDatasourceConfluenceSearch = Loadable({
	loader: () =>
		import(
			/* webpackChunkName: "@atlaskit-internal_editor-icon-datasource-confluence-search" */ './datasource-confluence-search'
		).then((module) => module.default) as Promise<
			React.ComponentType<React.PropsWithChildren<IconProps>>
		>,
	loading: () => null,
});

export const IconLoom = Loadable({
	loader: () =>
		import(/* webpackChunkName: "@atlaskit-internal_editor-icon-loom" */ './loom').then(
			(module) => module.default,
		) as Promise<React.ComponentType<React.PropsWithChildren<IconProps>>>,
	loading: () => null,
});
