import React from 'react';

import Loadable from 'react-loadable';

import type { HeadingLevels, IconProps } from '../../types';

export const IconAction: React.ComponentType<React.PropsWithChildren<IconProps>> & Loadable.LoadableComponent = Loadable({
	loader: () =>
		import(/* webpackChunkName: "@atlaskit-internal_editor-icon-action" */ './action').then(
			(module) => module.default,
		) as Promise<React.ComponentType<React.PropsWithChildren<IconProps>>>,
	loading: () => null,
});

export const IconCode: React.ComponentType<React.PropsWithChildren<IconProps>> & Loadable.LoadableComponent = Loadable({
	loader: () =>
		import(/* webpackChunkName: "@atlaskit-internal_editor-icon-code" */ './code').then(
			(module) => module.default,
		) as Promise<React.ComponentType<React.PropsWithChildren<IconProps>>>,
	loading: () => null,
});

export const IconDate: React.ComponentType<React.PropsWithChildren<IconProps>> & Loadable.LoadableComponent = Loadable({
	loader: () =>
		import(/* webpackChunkName: "@atlaskit-internal_editor-icon-date" */ './date').then(
			(module) => module.default,
		) as Promise<React.ComponentType<React.PropsWithChildren<IconProps>>>,
	loading: () => null,
});

export const IconDecision: React.ComponentType<React.PropsWithChildren<IconProps>> & Loadable.LoadableComponent = Loadable({
	loader: () =>
		import(/* webpackChunkName: "@atlaskit-internal_editor-icon-decision" */ './decision').then(
			(module) => module.default,
		) as Promise<React.ComponentType<React.PropsWithChildren<IconProps>>>,
	loading: () => null,
});

export const IconDivider: React.ComponentType<React.PropsWithChildren<IconProps>> & Loadable.LoadableComponent = Loadable({
	loader: () =>
		import(/* webpackChunkName: "@atlaskit-internal_editor-icon-divider" */ './divider').then(
			(module) => module.default,
		) as Promise<React.ComponentType<React.PropsWithChildren<IconProps>>>,
	loading: () => null,
});

export const IconEmoji: React.ComponentType<React.PropsWithChildren<IconProps>> & Loadable.LoadableComponent = Loadable({
	loader: () =>
		import(/* webpackChunkName: "@atlaskit-internal_editor-icon-emoji" */ './emoji').then(
			(module) => module.default,
		) as Promise<React.ComponentType<React.PropsWithChildren<IconProps>>>,
	loading: () => null,
});

export const IconImages: React.ComponentType<React.PropsWithChildren<IconProps>> & Loadable.LoadableComponent = Loadable({
	loader: () =>
		import(/* webpackChunkName: "@atlaskit-internal_editor-icon-images" */ './images').then(
			(module) => module.default,
		) as Promise<React.ComponentType<React.PropsWithChildren<IconProps>>>,
	loading: () => null,
});

export const IconLayout: React.ComponentType<React.PropsWithChildren<IconProps>> & Loadable.LoadableComponent = Loadable({
	loader: () =>
		import(/* webpackChunkName: "@atlaskit-internal_editor-icon-layout" */ './layout').then(
			(module) => module.default,
		) as Promise<React.ComponentType<React.PropsWithChildren<IconProps>>>,
	loading: () => null,
});

export const IconLink: React.ComponentType<React.PropsWithChildren<IconProps>> & Loadable.LoadableComponent = Loadable({
	loader: () =>
		import(/* webpackChunkName: "@atlaskit-internal_editor-icon-link" */ './link').then(
			(module) => module.default,
		) as Promise<React.ComponentType<React.PropsWithChildren<IconProps>>>,
	loading: () => null,
});

export const IconListNumber: React.ComponentType<React.PropsWithChildren<IconProps>> & Loadable.LoadableComponent = Loadable({
	loader: () =>
		import(
			/* webpackChunkName: "@atlaskit-internal_editor-icon-list-number" */ './list-number'
		).then((module) => module.default) as Promise<
			React.ComponentType<React.PropsWithChildren<IconProps>>
		>,
	loading: () => null,
});

export const IconList: React.ComponentType<React.PropsWithChildren<IconProps>> & Loadable.LoadableComponent = Loadable({
	loader: () =>
		import(/* webpackChunkName: "@atlaskit-internal_editor-icon-list" */ './list').then(
			(module) => module.default,
		) as Promise<React.ComponentType<React.PropsWithChildren<IconProps>>>,
	loading: () => null,
});

export const IconMention: React.ComponentType<React.PropsWithChildren<IconProps>> & Loadable.LoadableComponent = Loadable({
	loader: () =>
		import(/* webpackChunkName: "@atlaskit-internal_editor-icon-mention" */ './mention').then(
			(module) => module.default,
		) as Promise<React.ComponentType<React.PropsWithChildren<IconProps>>>,
	loading: () => null,
});

export const IconPanelError: React.ComponentType<React.PropsWithChildren<IconProps>> & Loadable.LoadableComponent = Loadable({
	loader: () =>
		import(
			/* webpackChunkName: "@atlaskit-internal_editor-icon-panel-error" */ './panel-error'
		).then((module) => module.default) as Promise<
			React.ComponentType<React.PropsWithChildren<IconProps>>
		>,
	loading: () => null,
});

export const IconPanelNote: React.ComponentType<React.PropsWithChildren<IconProps>> & Loadable.LoadableComponent = Loadable({
	loader: () =>
		import(/* webpackChunkName: "@atlaskit-internal_editor-icon-panel-note" */ './panel-note').then(
			(module) => module.default,
		) as Promise<React.ComponentType<React.PropsWithChildren<IconProps>>>,
	loading: () => null,
});

export const IconPanelSuccess: React.ComponentType<React.PropsWithChildren<IconProps>> & Loadable.LoadableComponent = Loadable({
	loader: () =>
		import(
			/* webpackChunkName: "@atlaskit-internal_editor-icon-panel-success" */ './panel-success'
		).then((module) => module.default) as Promise<
			React.ComponentType<React.PropsWithChildren<IconProps>>
		>,
	loading: () => null,
});

export const IconPanelWarning: React.ComponentType<React.PropsWithChildren<IconProps>> & Loadable.LoadableComponent = Loadable({
	loader: () =>
		import(
			/* webpackChunkName: "@atlaskit-internal_editor-icon-panel-warning" */ './panel-warning'
		).then((module) => module.default) as Promise<
			React.ComponentType<React.PropsWithChildren<IconProps>>
		>,
	loading: () => null,
});

export const IconPanel: React.ComponentType<React.PropsWithChildren<IconProps>> & Loadable.LoadableComponent = Loadable({
	loader: () =>
		import(/* webpackChunkName: "@atlaskit-internal_editor-icon-panel" */ './panel').then(
			(module) => module.default,
		) as Promise<React.ComponentType<React.PropsWithChildren<IconProps>>>,
	loading: () => null,
});

export const IconQuote: React.ComponentType<React.PropsWithChildren<IconProps>> & Loadable.LoadableComponent = Loadable({
	loader: () =>
		import(/* webpackChunkName: "@atlaskit-internal_editor-icon-quote" */ './quote').then(
			(module) => module.default,
		) as Promise<React.ComponentType<React.PropsWithChildren<IconProps>>>,
	loading: () => null,
});

export const IconStatus: React.ComponentType<React.PropsWithChildren<IconProps>> & Loadable.LoadableComponent = Loadable({
	loader: () =>
		import(/* webpackChunkName: "@atlaskit-internal_editor-icon-status" */ './status').then(
			(module) => module.default,
		) as Promise<React.ComponentType<React.PropsWithChildren<IconProps>>>,
	loading: () => null,
});

export const IconOneColumnLayout: React.ComponentType<React.PropsWithChildren<IconProps>> & Loadable.LoadableComponent = Loadable({
	loader: () =>
		import(
			/* webpackChunkName: "@atlaskit-internal_editor-icon-one-column-layout" */ './one-column-layout'
		).then((module) => module.default) as Promise<
			React.ComponentType<React.PropsWithChildren<IconProps>>
		>,
	loading: () => null,
});

export const IconTwoColumnLayout: React.ComponentType<React.PropsWithChildren<IconProps>> & Loadable.LoadableComponent = Loadable({
	loader: () =>
		import(
			/* webpackChunkName: "@atlaskit-internal_editor-icon-two-column-layout" */ './two-column-layout'
		).then((module) => module.default) as Promise<
			React.ComponentType<React.PropsWithChildren<IconProps>>
		>,
	loading: () => null,
});
export const IconThreeColumnLayout: React.ComponentType<React.PropsWithChildren<IconProps>> & Loadable.LoadableComponent = Loadable({
	loader: () =>
		import(
			/* webpackChunkName: "@atlaskit-internal_editor-icon-three-column-layout" */ './three-column-layout'
		).then((module) => module.default) as Promise<
			React.ComponentType<React.PropsWithChildren<IconProps>>
		>,
	loading: () => null,
});
export const IconFourColumnLayout: React.ComponentType<React.PropsWithChildren<IconProps>> & Loadable.LoadableComponent = Loadable({
	loader: () =>
		import(
			/* webpackChunkName: "@atlaskit-internal_editor-icon-four-column-layout" */ './four-column-layout'
		).then((module) => module.default) as Promise<
			React.ComponentType<React.PropsWithChildren<IconProps>>
		>,
	loading: () => null,
});
export const IconFiveColumnLayout: React.ComponentType<React.PropsWithChildren<IconProps>> & Loadable.LoadableComponent = Loadable({
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

export const IconHeading = ({
	level,
	label,
}: Pick<HeadingProps, 'level' | 'label'>): React.JSX.Element => {
	const Icon = Loadable({
		loader: () =>
			importHeading(level).then((module) => module.default) as Promise<
				React.ComponentType<React.PropsWithChildren<IconProps>>
			>,
		loading: () => null,
	});
	return <Icon label={label} />;
};

export const IconFeedback: React.ComponentType<React.PropsWithChildren<IconProps>> & Loadable.LoadableComponent = Loadable({
	loader: () =>
		import(/* webpackChunkName: "@atlaskit-internal_editor-icon-feedback" */ './feedback').then(
			(module) => module.default,
		) as Promise<React.ComponentType<React.PropsWithChildren<IconProps>>>,
	loading: () => null,
});

export const IconExpand: React.ComponentType<React.PropsWithChildren<IconProps>> & Loadable.LoadableComponent = Loadable({
	loader: () =>
		import(/* webpackChunkName: "@atlaskit-internal_editor-icon-expand" */ './expand').then(
			(module) => module.default,
		) as Promise<React.ComponentType<React.PropsWithChildren<IconProps>>>,
	loading: () => null,
});

export const IconDatasourceJiraIssue: React.ComponentType<React.PropsWithChildren<IconProps>> & Loadable.LoadableComponent = Loadable({
	loader: () =>
		import(
			/* webpackChunkName: "@atlaskit-internal_editor-icon-datasource-jira-issue" */ './datasource-jira-issue'
		).then((module) => module.default) as Promise<
			React.ComponentType<React.PropsWithChildren<IconProps>>
		>,
	loading: () => null,
});

export const IconDatasourceAssetsObjects: React.ComponentType<React.PropsWithChildren<IconProps>> & Loadable.LoadableComponent = Loadable({
	loader: () =>
		import(
			/* webpackChunkName: "@atlaskit-internal_editor-icon-datasource-assets-objects" */ './datasource-assets-objects'
		).then((module) => module.default) as Promise<
			React.ComponentType<React.PropsWithChildren<IconProps>>
		>,
	loading: () => null,
});

export const IconDatasourceConfluenceSearch: React.ComponentType<React.PropsWithChildren<IconProps>> & Loadable.LoadableComponent = Loadable({
	loader: () =>
		import(
			/* webpackChunkName: "@atlaskit-internal_editor-icon-datasource-confluence-search" */ './datasource-confluence-search'
		).then((module) => module.default) as Promise<
			React.ComponentType<React.PropsWithChildren<IconProps>>
		>,
	loading: () => null,
});

export const IconLoom: React.ComponentType<React.PropsWithChildren<IconProps>> & Loadable.LoadableComponent = Loadable({
	loader: () =>
		import(/* webpackChunkName: "@atlaskit-internal_editor-icon-loom" */ './loom').then(
			(module) => module.default,
		) as Promise<React.ComponentType<React.PropsWithChildren<IconProps>>>,
	loading: () => null,
});

export const IconSyncBlock: React.ComponentType<React.PropsWithChildren<IconProps>> & Loadable.LoadableComponent = Loadable({
	loader: () =>
		import(/* webpackChunkName: "@atlaskit-internal_editor-icon-sync-block" */ './syncBlock').then(
			(module) => module.default,
		) as Promise<React.ComponentType<React.PropsWithChildren<IconProps>>>,
	loading: () => null,
});
