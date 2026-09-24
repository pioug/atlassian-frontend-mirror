/* eslint-disable @atlaskit/volt-strict-mode/no-multiple-exports */

import React from 'react';

import Loadable from 'react-loadable';
// oxlint-disable-next-line @atlassian/no-restricted-imports
import { lazy, LazySuspense } from 'react-loosely-lazy';

import { isExperimentEnabled } from '@atlaskit/platform-feature-experiments/is-experiment-enabled';

import type { HeadingLevels, IconProps } from '../../types';

type PreloadableComponent<Props extends object> = React.ComponentType<Props> & {
	preload: () => unknown;
};

const loadIconAction = () =>
	import(/* webpackChunkName: "@atlaskit-internal_editor-icon-action" */ './action').then(
		(module) => module.default,
	) as Promise<React.ComponentType<React.PropsWithChildren<IconProps>>>;
const IconActionLazy = lazy(
	() =>
		import(/* webpackChunkName: "@atlaskit-internal_editor-icon-action" */ './action').then(
			(module) => module.default,
		) as Promise<React.ComponentType<React.PropsWithChildren<IconProps>>>,
);
IconActionLazy.displayName = 'lazy(IconAction)';
const IconActionLoadable = Loadable({ loader: loadIconAction, loading: () => null });
export const IconAction: PreloadableComponent<React.PropsWithChildren<IconProps>> = (props) =>
	isExperimentEnabled('platform_editor_loosely_lazy_migration') ? (
		<LazySuspense fallback={null}>
			{/* eslint-disable-next-line react/jsx-props-no-spreading -- pass icon props to the lazy component */}
			<IconActionLazy {...props} />
		</LazySuspense>
	) : (
		// eslint-disable-next-line react/jsx-props-no-spreading -- pass icon props to the legacy component
		<IconActionLoadable {...props} />
	);
IconAction.preload = () =>
	isExperimentEnabled('platform_editor_loosely_lazy_migration')
		? IconActionLazy.preload()
		: IconActionLoadable.preload();

const loadIconCode = () =>
	import(/* webpackChunkName: "@atlaskit-internal_editor-icon-code" */ './code').then(
		(module) => module.default,
	) as Promise<React.ComponentType<React.PropsWithChildren<IconProps>>>;
const IconCodeLazy = lazy(
	() =>
		import(/* webpackChunkName: "@atlaskit-internal_editor-icon-code" */ './code').then(
			(module) => module.default,
		) as Promise<React.ComponentType<React.PropsWithChildren<IconProps>>>,
);
IconCodeLazy.displayName = 'lazy(IconCode)';
const IconCodeLoadable = Loadable({ loader: loadIconCode, loading: () => null });
export const IconCode: PreloadableComponent<React.PropsWithChildren<IconProps>> = (props) =>
	isExperimentEnabled('platform_editor_loosely_lazy_migration') ? (
		<LazySuspense fallback={null}>
			{/* eslint-disable-next-line react/jsx-props-no-spreading -- pass icon props to the lazy component */}
			<IconCodeLazy {...props} />
		</LazySuspense>
	) : (
		// eslint-disable-next-line react/jsx-props-no-spreading -- pass icon props to the legacy component
		<IconCodeLoadable {...props} />
	);
IconCode.preload = () =>
	isExperimentEnabled('platform_editor_loosely_lazy_migration')
		? IconCodeLazy.preload()
		: IconCodeLoadable.preload();

const loadIconDate = () =>
	import(/* webpackChunkName: "@atlaskit-internal_editor-icon-date" */ './date').then(
		(module) => module.default,
	) as Promise<React.ComponentType<React.PropsWithChildren<IconProps>>>;
const IconDateLazy = lazy(
	() =>
		import(/* webpackChunkName: "@atlaskit-internal_editor-icon-date" */ './date').then(
			(module) => module.default,
		) as Promise<React.ComponentType<React.PropsWithChildren<IconProps>>>,
);
IconDateLazy.displayName = 'lazy(IconDate)';
const IconDateLoadable = Loadable({ loader: loadIconDate, loading: () => null });
export const IconDate: PreloadableComponent<React.PropsWithChildren<IconProps>> = (props) =>
	isExperimentEnabled('platform_editor_loosely_lazy_migration') ? (
		<LazySuspense fallback={null}>
			{/* eslint-disable-next-line react/jsx-props-no-spreading -- pass icon props to the lazy component */}
			<IconDateLazy {...props} />
		</LazySuspense>
	) : (
		// eslint-disable-next-line react/jsx-props-no-spreading -- pass icon props to the legacy component
		<IconDateLoadable {...props} />
	);
IconDate.preload = () =>
	isExperimentEnabled('platform_editor_loosely_lazy_migration')
		? IconDateLazy.preload()
		: IconDateLoadable.preload();

const loadIconDecision = () =>
	import(/* webpackChunkName: "@atlaskit-internal_editor-icon-decision" */ './decision').then(
		(module) => module.default,
	) as Promise<React.ComponentType<React.PropsWithChildren<IconProps>>>;
const IconDecisionLazy = lazy(
	() =>
		import(/* webpackChunkName: "@atlaskit-internal_editor-icon-decision" */ './decision').then(
			(module) => module.default,
		) as Promise<React.ComponentType<React.PropsWithChildren<IconProps>>>,
);
IconDecisionLazy.displayName = 'lazy(IconDecision)';
const IconDecisionLoadable = Loadable({ loader: loadIconDecision, loading: () => null });
export const IconDecision: PreloadableComponent<React.PropsWithChildren<IconProps>> = (props) =>
	isExperimentEnabled('platform_editor_loosely_lazy_migration') ? (
		<LazySuspense fallback={null}>
			{/* eslint-disable-next-line react/jsx-props-no-spreading -- pass icon props to the lazy component */}
			<IconDecisionLazy {...props} />
		</LazySuspense>
	) : (
		// eslint-disable-next-line react/jsx-props-no-spreading -- pass icon props to the legacy component
		<IconDecisionLoadable {...props} />
	);
IconDecision.preload = () =>
	isExperimentEnabled('platform_editor_loosely_lazy_migration')
		? IconDecisionLazy.preload()
		: IconDecisionLoadable.preload();

const loadIconDivider = () =>
	import(/* webpackChunkName: "@atlaskit-internal_editor-icon-divider" */ './divider').then(
		(module) => module.default,
	) as Promise<React.ComponentType<React.PropsWithChildren<IconProps>>>;
const IconDividerLazy = lazy(
	() =>
		import(/* webpackChunkName: "@atlaskit-internal_editor-icon-divider" */ './divider').then(
			(module) => module.default,
		) as Promise<React.ComponentType<React.PropsWithChildren<IconProps>>>,
);
IconDividerLazy.displayName = 'lazy(IconDivider)';
const IconDividerLoadable = Loadable({ loader: loadIconDivider, loading: () => null });
export const IconDivider: PreloadableComponent<React.PropsWithChildren<IconProps>> = (props) =>
	isExperimentEnabled('platform_editor_loosely_lazy_migration') ? (
		<LazySuspense fallback={null}>
			{/* eslint-disable-next-line react/jsx-props-no-spreading -- pass icon props to the lazy component */}
			<IconDividerLazy {...props} />
		</LazySuspense>
	) : (
		// eslint-disable-next-line react/jsx-props-no-spreading -- pass icon props to the legacy component
		<IconDividerLoadable {...props} />
	);
IconDivider.preload = () =>
	isExperimentEnabled('platform_editor_loosely_lazy_migration')
		? IconDividerLazy.preload()
		: IconDividerLoadable.preload();

const loadIconEmoji = () =>
	import(/* webpackChunkName: "@atlaskit-internal_editor-icon-emoji" */ './emoji').then(
		(module) => module.default,
	) as Promise<React.ComponentType<React.PropsWithChildren<IconProps>>>;
const IconEmojiLazy = lazy(
	() =>
		import(/* webpackChunkName: "@atlaskit-internal_editor-icon-emoji" */ './emoji').then(
			(module) => module.default,
		) as Promise<React.ComponentType<React.PropsWithChildren<IconProps>>>,
);
IconEmojiLazy.displayName = 'lazy(IconEmoji)';
const IconEmojiLoadable = Loadable({ loader: loadIconEmoji, loading: () => null });
export const IconEmoji: PreloadableComponent<React.PropsWithChildren<IconProps>> = (props) =>
	isExperimentEnabled('platform_editor_loosely_lazy_migration') ? (
		<LazySuspense fallback={null}>
			{/* eslint-disable-next-line react/jsx-props-no-spreading -- pass icon props to the lazy component */}
			<IconEmojiLazy {...props} />
		</LazySuspense>
	) : (
		// eslint-disable-next-line react/jsx-props-no-spreading -- pass icon props to the legacy component
		<IconEmojiLoadable {...props} />
	);
IconEmoji.preload = () =>
	isExperimentEnabled('platform_editor_loosely_lazy_migration')
		? IconEmojiLazy.preload()
		: IconEmojiLoadable.preload();

const loadIconImages = () =>
	import(/* webpackChunkName: "@atlaskit-internal_editor-icon-images" */ './images').then(
		(module) => module.default,
	) as Promise<React.ComponentType<React.PropsWithChildren<IconProps>>>;
const IconImagesLazy = lazy(
	() =>
		import(/* webpackChunkName: "@atlaskit-internal_editor-icon-images" */ './images').then(
			(module) => module.default,
		) as Promise<React.ComponentType<React.PropsWithChildren<IconProps>>>,
);
IconImagesLazy.displayName = 'lazy(IconImages)';
const IconImagesLoadable = Loadable({ loader: loadIconImages, loading: () => null });
export const IconImages: PreloadableComponent<React.PropsWithChildren<IconProps>> = (props) =>
	isExperimentEnabled('platform_editor_loosely_lazy_migration') ? (
		<LazySuspense fallback={null}>
			{/* eslint-disable-next-line react/jsx-props-no-spreading -- pass icon props to the lazy component */}
			<IconImagesLazy {...props} />
		</LazySuspense>
	) : (
		// eslint-disable-next-line react/jsx-props-no-spreading -- pass icon props to the legacy component
		<IconImagesLoadable {...props} />
	);
IconImages.preload = () =>
	isExperimentEnabled('platform_editor_loosely_lazy_migration')
		? IconImagesLazy.preload()
		: IconImagesLoadable.preload();

const loadIconLayout = () =>
	import(/* webpackChunkName: "@atlaskit-internal_editor-icon-layout" */ './layout').then(
		(module) => module.default,
	) as Promise<React.ComponentType<React.PropsWithChildren<IconProps>>>;
const IconLayoutLazy = lazy(
	() =>
		import(/* webpackChunkName: "@atlaskit-internal_editor-icon-layout" */ './layout').then(
			(module) => module.default,
		) as Promise<React.ComponentType<React.PropsWithChildren<IconProps>>>,
);
IconLayoutLazy.displayName = 'lazy(IconLayout)';
const IconLayoutLoadable = Loadable({ loader: loadIconLayout, loading: () => null });
export const IconLayout: PreloadableComponent<React.PropsWithChildren<IconProps>> = (props) =>
	isExperimentEnabled('platform_editor_loosely_lazy_migration') ? (
		<LazySuspense fallback={null}>
			{/* eslint-disable-next-line react/jsx-props-no-spreading -- pass icon props to the lazy component */}
			<IconLayoutLazy {...props} />
		</LazySuspense>
	) : (
		// eslint-disable-next-line react/jsx-props-no-spreading -- pass icon props to the legacy component
		<IconLayoutLoadable {...props} />
	);
IconLayout.preload = () =>
	isExperimentEnabled('platform_editor_loosely_lazy_migration')
		? IconLayoutLazy.preload()
		: IconLayoutLoadable.preload();

const loadIconLink = () =>
	import(/* webpackChunkName: "@atlaskit-internal_editor-icon-link" */ './link').then(
		(module) => module.default,
	) as Promise<React.ComponentType<React.PropsWithChildren<IconProps>>>;
const IconLinkLazy = lazy(
	() =>
		import(/* webpackChunkName: "@atlaskit-internal_editor-icon-link" */ './link').then(
			(module) => module.default,
		) as Promise<React.ComponentType<React.PropsWithChildren<IconProps>>>,
);
IconLinkLazy.displayName = 'lazy(IconLink)';
const IconLinkLoadable = Loadable({ loader: loadIconLink, loading: () => null });
export const IconLink: PreloadableComponent<React.PropsWithChildren<IconProps>> = (props) =>
	isExperimentEnabled('platform_editor_loosely_lazy_migration') ? (
		<LazySuspense fallback={null}>
			{/* eslint-disable-next-line react/jsx-props-no-spreading -- pass icon props to the lazy component */}
			<IconLinkLazy {...props} />
		</LazySuspense>
	) : (
		// eslint-disable-next-line react/jsx-props-no-spreading -- pass icon props to the legacy component
		<IconLinkLoadable {...props} />
	);
IconLink.preload = () =>
	isExperimentEnabled('platform_editor_loosely_lazy_migration')
		? IconLinkLazy.preload()
		: IconLinkLoadable.preload();

const loadIconListNumber = () =>
	import(/* webpackChunkName: "@atlaskit-internal_editor-icon-list-number" */ './list-number').then(
		(module) => module.default,
	) as Promise<React.ComponentType<React.PropsWithChildren<IconProps>>>;
const IconListNumberLazy = lazy(
	() =>
		import(
			/* webpackChunkName: "@atlaskit-internal_editor-icon-list-number" */ './list-number'
		).then((module) => module.default) as Promise<
			React.ComponentType<React.PropsWithChildren<IconProps>>
		>,
);
IconListNumberLazy.displayName = 'lazy(IconListNumber)';
const IconListNumberLoadable = Loadable({ loader: loadIconListNumber, loading: () => null });
export const IconListNumber: PreloadableComponent<React.PropsWithChildren<IconProps>> = (props) =>
	isExperimentEnabled('platform_editor_loosely_lazy_migration') ? (
		<LazySuspense fallback={null}>
			{/* eslint-disable-next-line react/jsx-props-no-spreading -- pass icon props to the lazy component */}
			<IconListNumberLazy {...props} />
		</LazySuspense>
	) : (
		// eslint-disable-next-line react/jsx-props-no-spreading -- pass icon props to the legacy component
		<IconListNumberLoadable {...props} />
	);
IconListNumber.preload = () =>
	isExperimentEnabled('platform_editor_loosely_lazy_migration')
		? IconListNumberLazy.preload()
		: IconListNumberLoadable.preload();

const loadIconList = () =>
	import(/* webpackChunkName: "@atlaskit-internal_editor-icon-list" */ './list').then(
		(module) => module.default,
	) as Promise<React.ComponentType<React.PropsWithChildren<IconProps>>>;
const IconListLazy = lazy(
	() =>
		import(/* webpackChunkName: "@atlaskit-internal_editor-icon-list" */ './list').then(
			(module) => module.default,
		) as Promise<React.ComponentType<React.PropsWithChildren<IconProps>>>,
);
IconListLazy.displayName = 'lazy(IconList)';
const IconListLoadable = Loadable({ loader: loadIconList, loading: () => null });
export const IconList: PreloadableComponent<React.PropsWithChildren<IconProps>> = (props) =>
	isExperimentEnabled('platform_editor_loosely_lazy_migration') ? (
		<LazySuspense fallback={null}>
			{/* eslint-disable-next-line react/jsx-props-no-spreading -- pass icon props to the lazy component */}
			<IconListLazy {...props} />
		</LazySuspense>
	) : (
		// eslint-disable-next-line react/jsx-props-no-spreading -- pass icon props to the legacy component
		<IconListLoadable {...props} />
	);
IconList.preload = () =>
	isExperimentEnabled('platform_editor_loosely_lazy_migration')
		? IconListLazy.preload()
		: IconListLoadable.preload();

const loadIconMention = () =>
	import(/* webpackChunkName: "@atlaskit-internal_editor-icon-mention" */ './mention').then(
		(module) => module.default,
	) as Promise<React.ComponentType<React.PropsWithChildren<IconProps>>>;
const IconMentionLazy = lazy(
	() =>
		import(/* webpackChunkName: "@atlaskit-internal_editor-icon-mention" */ './mention').then(
			(module) => module.default,
		) as Promise<React.ComponentType<React.PropsWithChildren<IconProps>>>,
);
IconMentionLazy.displayName = 'lazy(IconMention)';
const IconMentionLoadable = Loadable({ loader: loadIconMention, loading: () => null });
export const IconMention: PreloadableComponent<React.PropsWithChildren<IconProps>> = (props) =>
	isExperimentEnabled('platform_editor_loosely_lazy_migration') ? (
		<LazySuspense fallback={null}>
			{/* eslint-disable-next-line react/jsx-props-no-spreading -- pass icon props to the lazy component */}
			<IconMentionLazy {...props} />
		</LazySuspense>
	) : (
		// eslint-disable-next-line react/jsx-props-no-spreading -- pass icon props to the legacy component
		<IconMentionLoadable {...props} />
	);
IconMention.preload = () =>
	isExperimentEnabled('platform_editor_loosely_lazy_migration')
		? IconMentionLazy.preload()
		: IconMentionLoadable.preload();

const loadIconPanelError = () =>
	import(/* webpackChunkName: "@atlaskit-internal_editor-icon-panel-error" */ './panel-error').then(
		(module) => module.default,
	) as Promise<React.ComponentType<React.PropsWithChildren<IconProps>>>;
const IconPanelErrorLazy = lazy(
	() =>
		import(
			/* webpackChunkName: "@atlaskit-internal_editor-icon-panel-error" */ './panel-error'
		).then((module) => module.default) as Promise<
			React.ComponentType<React.PropsWithChildren<IconProps>>
		>,
);
IconPanelErrorLazy.displayName = 'lazy(IconPanelError)';
const IconPanelErrorLoadable = Loadable({ loader: loadIconPanelError, loading: () => null });
export const IconPanelError: PreloadableComponent<React.PropsWithChildren<IconProps>> = (props) =>
	isExperimentEnabled('platform_editor_loosely_lazy_migration') ? (
		<LazySuspense fallback={null}>
			{/* eslint-disable-next-line react/jsx-props-no-spreading -- pass icon props to the lazy component */}
			<IconPanelErrorLazy {...props} />
		</LazySuspense>
	) : (
		// eslint-disable-next-line react/jsx-props-no-spreading -- pass icon props to the legacy component
		<IconPanelErrorLoadable {...props} />
	);
IconPanelError.preload = () =>
	isExperimentEnabled('platform_editor_loosely_lazy_migration')
		? IconPanelErrorLazy.preload()
		: IconPanelErrorLoadable.preload();

const loadIconPanelNote = () =>
	import(/* webpackChunkName: "@atlaskit-internal_editor-icon-panel-note" */ './panel-note').then(
		(module) => module.default,
	) as Promise<React.ComponentType<React.PropsWithChildren<IconProps>>>;
const IconPanelNoteLazy = lazy(
	() =>
		import(/* webpackChunkName: "@atlaskit-internal_editor-icon-panel-note" */ './panel-note').then(
			(module) => module.default,
		) as Promise<React.ComponentType<React.PropsWithChildren<IconProps>>>,
);
IconPanelNoteLazy.displayName = 'lazy(IconPanelNote)';
const IconPanelNoteLoadable = Loadable({ loader: loadIconPanelNote, loading: () => null });
export const IconPanelNote: PreloadableComponent<React.PropsWithChildren<IconProps>> = (props) =>
	isExperimentEnabled('platform_editor_loosely_lazy_migration') ? (
		<LazySuspense fallback={null}>
			{/* eslint-disable-next-line react/jsx-props-no-spreading -- pass icon props to the lazy component */}
			<IconPanelNoteLazy {...props} />
		</LazySuspense>
	) : (
		// eslint-disable-next-line react/jsx-props-no-spreading -- pass icon props to the legacy component
		<IconPanelNoteLoadable {...props} />
	);
IconPanelNote.preload = () =>
	isExperimentEnabled('platform_editor_loosely_lazy_migration')
		? IconPanelNoteLazy.preload()
		: IconPanelNoteLoadable.preload();

const loadIconPanelSuccess = () =>
	import(
		/* webpackChunkName: "@atlaskit-internal_editor-icon-panel-success" */ './panel-success'
	).then((module) => module.default) as Promise<
		React.ComponentType<React.PropsWithChildren<IconProps>>
	>;
const IconPanelSuccessLazy = lazy(
	() =>
		import(
			/* webpackChunkName: "@atlaskit-internal_editor-icon-panel-success" */ './panel-success'
		).then((module) => module.default) as Promise<
			React.ComponentType<React.PropsWithChildren<IconProps>>
		>,
);
IconPanelSuccessLazy.displayName = 'lazy(IconPanelSuccess)';
const IconPanelSuccessLoadable = Loadable({ loader: loadIconPanelSuccess, loading: () => null });
export const IconPanelSuccess: PreloadableComponent<React.PropsWithChildren<IconProps>> = (props) =>
	isExperimentEnabled('platform_editor_loosely_lazy_migration') ? (
		<LazySuspense fallback={null}>
			{/* eslint-disable-next-line react/jsx-props-no-spreading -- pass icon props to the lazy component */}
			<IconPanelSuccessLazy {...props} />
		</LazySuspense>
	) : (
		// eslint-disable-next-line react/jsx-props-no-spreading -- pass icon props to the legacy component
		<IconPanelSuccessLoadable {...props} />
	);
IconPanelSuccess.preload = () =>
	isExperimentEnabled('platform_editor_loosely_lazy_migration')
		? IconPanelSuccessLazy.preload()
		: IconPanelSuccessLoadable.preload();

const loadIconPanelWarning = () =>
	import(
		/* webpackChunkName: "@atlaskit-internal_editor-icon-panel-warning" */ './panel-warning'
	).then((module) => module.default) as Promise<
		React.ComponentType<React.PropsWithChildren<IconProps>>
	>;
const IconPanelWarningLazy = lazy(
	() =>
		import(
			/* webpackChunkName: "@atlaskit-internal_editor-icon-panel-warning" */ './panel-warning'
		).then((module) => module.default) as Promise<
			React.ComponentType<React.PropsWithChildren<IconProps>>
		>,
);
IconPanelWarningLazy.displayName = 'lazy(IconPanelWarning)';
const IconPanelWarningLoadable = Loadable({ loader: loadIconPanelWarning, loading: () => null });
export const IconPanelWarning: PreloadableComponent<React.PropsWithChildren<IconProps>> = (props) =>
	isExperimentEnabled('platform_editor_loosely_lazy_migration') ? (
		<LazySuspense fallback={null}>
			{/* eslint-disable-next-line react/jsx-props-no-spreading -- pass icon props to the lazy component */}
			<IconPanelWarningLazy {...props} />
		</LazySuspense>
	) : (
		// eslint-disable-next-line react/jsx-props-no-spreading -- pass icon props to the legacy component
		<IconPanelWarningLoadable {...props} />
	);
IconPanelWarning.preload = () =>
	isExperimentEnabled('platform_editor_loosely_lazy_migration')
		? IconPanelWarningLazy.preload()
		: IconPanelWarningLoadable.preload();

const loadIconPanel = () =>
	import(/* webpackChunkName: "@atlaskit-internal_editor-icon-panel" */ './panel').then(
		(module) => module.default,
	) as Promise<React.ComponentType<React.PropsWithChildren<IconProps>>>;
const IconPanelLazy = lazy(
	() =>
		import(/* webpackChunkName: "@atlaskit-internal_editor-icon-panel" */ './panel').then(
			(module) => module.default,
		) as Promise<React.ComponentType<React.PropsWithChildren<IconProps>>>,
);
IconPanelLazy.displayName = 'lazy(IconPanel)';
const IconPanelLoadable = Loadable({ loader: loadIconPanel, loading: () => null });
export const IconPanel: PreloadableComponent<React.PropsWithChildren<IconProps>> = (props) =>
	isExperimentEnabled('platform_editor_loosely_lazy_migration') ? (
		<LazySuspense fallback={null}>
			{/* eslint-disable-next-line react/jsx-props-no-spreading -- pass icon props to the lazy component */}
			<IconPanelLazy {...props} />
		</LazySuspense>
	) : (
		// eslint-disable-next-line react/jsx-props-no-spreading -- pass icon props to the legacy component
		<IconPanelLoadable {...props} />
	);
IconPanel.preload = () =>
	isExperimentEnabled('platform_editor_loosely_lazy_migration')
		? IconPanelLazy.preload()
		: IconPanelLoadable.preload();

const loadIconQuote = () =>
	import(/* webpackChunkName: "@atlaskit-internal_editor-icon-quote" */ './quote').then(
		(module) => module.default,
	) as Promise<React.ComponentType<React.PropsWithChildren<IconProps>>>;
const IconQuoteLazy = lazy(
	() =>
		import(/* webpackChunkName: "@atlaskit-internal_editor-icon-quote" */ './quote').then(
			(module) => module.default,
		) as Promise<React.ComponentType<React.PropsWithChildren<IconProps>>>,
);
IconQuoteLazy.displayName = 'lazy(IconQuote)';
const IconQuoteLoadable = Loadable({ loader: loadIconQuote, loading: () => null });
export const IconQuote: PreloadableComponent<React.PropsWithChildren<IconProps>> = (props) =>
	isExperimentEnabled('platform_editor_loosely_lazy_migration') ? (
		<LazySuspense fallback={null}>
			{/* eslint-disable-next-line react/jsx-props-no-spreading -- pass icon props to the lazy component */}
			<IconQuoteLazy {...props} />
		</LazySuspense>
	) : (
		// eslint-disable-next-line react/jsx-props-no-spreading -- pass icon props to the legacy component
		<IconQuoteLoadable {...props} />
	);
IconQuote.preload = () =>
	isExperimentEnabled('platform_editor_loosely_lazy_migration')
		? IconQuoteLazy.preload()
		: IconQuoteLoadable.preload();

const loadIconStatus = () =>
	import(/* webpackChunkName: "@atlaskit-internal_editor-icon-status" */ './status').then(
		(module) => module.default,
	) as Promise<React.ComponentType<React.PropsWithChildren<IconProps>>>;
const IconStatusLazy = lazy(
	() =>
		import(/* webpackChunkName: "@atlaskit-internal_editor-icon-status" */ './status').then(
			(module) => module.default,
		) as Promise<React.ComponentType<React.PropsWithChildren<IconProps>>>,
);
IconStatusLazy.displayName = 'lazy(IconStatus)';
const IconStatusLoadable = Loadable({ loader: loadIconStatus, loading: () => null });
export const IconStatus: PreloadableComponent<React.PropsWithChildren<IconProps>> = (props) =>
	isExperimentEnabled('platform_editor_loosely_lazy_migration') ? (
		<LazySuspense fallback={null}>
			{/* eslint-disable-next-line react/jsx-props-no-spreading -- pass icon props to the lazy component */}
			<IconStatusLazy {...props} />
		</LazySuspense>
	) : (
		// eslint-disable-next-line react/jsx-props-no-spreading -- pass icon props to the legacy component
		<IconStatusLoadable {...props} />
	);
IconStatus.preload = () =>
	isExperimentEnabled('platform_editor_loosely_lazy_migration')
		? IconStatusLazy.preload()
		: IconStatusLoadable.preload();

const loadIconOneColumnLayout = () =>
	import(
		/* webpackChunkName: "@atlaskit-internal_editor-icon-one-column-layout" */ './one-column-layout'
	).then((module) => module.default) as Promise<
		React.ComponentType<React.PropsWithChildren<IconProps>>
	>;
const IconOneColumnLayoutLazy = lazy(
	() =>
		import(
			/* webpackChunkName: "@atlaskit-internal_editor-icon-one-column-layout" */ './one-column-layout'
		).then((module) => module.default) as Promise<
			React.ComponentType<React.PropsWithChildren<IconProps>>
		>,
);
IconOneColumnLayoutLazy.displayName = 'lazy(IconOneColumnLayout)';
const IconOneColumnLayoutLoadable = Loadable({
	loader: loadIconOneColumnLayout,
	loading: () => null,
});
export const IconOneColumnLayout: PreloadableComponent<React.PropsWithChildren<IconProps>> = (
	props,
) =>
	isExperimentEnabled('platform_editor_loosely_lazy_migration') ? (
		<LazySuspense fallback={null}>
			{/* eslint-disable-next-line react/jsx-props-no-spreading -- pass icon props to the lazy component */}
			<IconOneColumnLayoutLazy {...props} />
		</LazySuspense>
	) : (
		// eslint-disable-next-line react/jsx-props-no-spreading -- pass icon props to the legacy component
		<IconOneColumnLayoutLoadable {...props} />
	);
IconOneColumnLayout.preload = () =>
	isExperimentEnabled('platform_editor_loosely_lazy_migration')
		? IconOneColumnLayoutLazy.preload()
		: IconOneColumnLayoutLoadable.preload();

const loadIconTwoColumnLayout = () =>
	import(
		/* webpackChunkName: "@atlaskit-internal_editor-icon-two-column-layout" */ './two-column-layout'
	).then((module) => module.default) as Promise<
		React.ComponentType<React.PropsWithChildren<IconProps>>
	>;
const IconTwoColumnLayoutLazy = lazy(
	() =>
		import(
			/* webpackChunkName: "@atlaskit-internal_editor-icon-two-column-layout" */ './two-column-layout'
		).then((module) => module.default) as Promise<
			React.ComponentType<React.PropsWithChildren<IconProps>>
		>,
);
IconTwoColumnLayoutLazy.displayName = 'lazy(IconTwoColumnLayout)';
const IconTwoColumnLayoutLoadable = Loadable({
	loader: loadIconTwoColumnLayout,
	loading: () => null,
});
export const IconTwoColumnLayout: PreloadableComponent<React.PropsWithChildren<IconProps>> = (
	props,
) =>
	isExperimentEnabled('platform_editor_loosely_lazy_migration') ? (
		<LazySuspense fallback={null}>
			{/* eslint-disable-next-line react/jsx-props-no-spreading -- pass icon props to the lazy component */}
			<IconTwoColumnLayoutLazy {...props} />
		</LazySuspense>
	) : (
		// eslint-disable-next-line react/jsx-props-no-spreading -- pass icon props to the legacy component
		<IconTwoColumnLayoutLoadable {...props} />
	);
IconTwoColumnLayout.preload = () =>
	isExperimentEnabled('platform_editor_loosely_lazy_migration')
		? IconTwoColumnLayoutLazy.preload()
		: IconTwoColumnLayoutLoadable.preload();

const loadIconThreeColumnLayout = () =>
	import(
		/* webpackChunkName: "@atlaskit-internal_editor-icon-three-column-layout" */ './three-column-layout'
	).then((module) => module.default) as Promise<
		React.ComponentType<React.PropsWithChildren<IconProps>>
	>;
const IconThreeColumnLayoutLazy = lazy(
	() =>
		import(
			/* webpackChunkName: "@atlaskit-internal_editor-icon-three-column-layout" */ './three-column-layout'
		).then((module) => module.default) as Promise<
			React.ComponentType<React.PropsWithChildren<IconProps>>
		>,
);
IconThreeColumnLayoutLazy.displayName = 'lazy(IconThreeColumnLayout)';
const IconThreeColumnLayoutLoadable = Loadable({
	loader: loadIconThreeColumnLayout,
	loading: () => null,
});
export const IconThreeColumnLayout: PreloadableComponent<React.PropsWithChildren<IconProps>> = (
	props,
) =>
	isExperimentEnabled('platform_editor_loosely_lazy_migration') ? (
		<LazySuspense fallback={null}>
			{/* eslint-disable-next-line react/jsx-props-no-spreading -- pass icon props to the lazy component */}
			<IconThreeColumnLayoutLazy {...props} />
		</LazySuspense>
	) : (
		// eslint-disable-next-line react/jsx-props-no-spreading -- pass icon props to the legacy component
		<IconThreeColumnLayoutLoadable {...props} />
	);
IconThreeColumnLayout.preload = () =>
	isExperimentEnabled('platform_editor_loosely_lazy_migration')
		? IconThreeColumnLayoutLazy.preload()
		: IconThreeColumnLayoutLoadable.preload();

const loadIconFourColumnLayout = () =>
	import(
		/* webpackChunkName: "@atlaskit-internal_editor-icon-four-column-layout" */ './four-column-layout'
	).then((module) => module.default) as Promise<
		React.ComponentType<React.PropsWithChildren<IconProps>>
	>;
const IconFourColumnLayoutLazy = lazy(
	() =>
		import(
			/* webpackChunkName: "@atlaskit-internal_editor-icon-four-column-layout" */ './four-column-layout'
		).then((module) => module.default) as Promise<
			React.ComponentType<React.PropsWithChildren<IconProps>>
		>,
);
IconFourColumnLayoutLazy.displayName = 'lazy(IconFourColumnLayout)';
const IconFourColumnLayoutLoadable = Loadable({
	loader: loadIconFourColumnLayout,
	loading: () => null,
});
export const IconFourColumnLayout: PreloadableComponent<React.PropsWithChildren<IconProps>> = (
	props,
) =>
	isExperimentEnabled('platform_editor_loosely_lazy_migration') ? (
		<LazySuspense fallback={null}>
			{/* eslint-disable-next-line react/jsx-props-no-spreading -- pass icon props to the lazy component */}
			<IconFourColumnLayoutLazy {...props} />
		</LazySuspense>
	) : (
		// eslint-disable-next-line react/jsx-props-no-spreading -- pass icon props to the legacy component
		<IconFourColumnLayoutLoadable {...props} />
	);
IconFourColumnLayout.preload = () =>
	isExperimentEnabled('platform_editor_loosely_lazy_migration')
		? IconFourColumnLayoutLazy.preload()
		: IconFourColumnLayoutLoadable.preload();

const loadIconFiveColumnLayout = () =>
	import(
		/* webpackChunkName: "@atlaskit-internal_editor-icon-five-column-layout" */ './five-column-layout'
	).then((module) => module.default) as Promise<
		React.ComponentType<React.PropsWithChildren<IconProps>>
	>;
const IconFiveColumnLayoutLazy = lazy(
	() =>
		import(
			/* webpackChunkName: "@atlaskit-internal_editor-icon-five-column-layout" */ './five-column-layout'
		).then((module) => module.default) as Promise<
			React.ComponentType<React.PropsWithChildren<IconProps>>
		>,
);
IconFiveColumnLayoutLazy.displayName = 'lazy(IconFiveColumnLayout)';
const IconFiveColumnLayoutLoadable = Loadable({
	loader: loadIconFiveColumnLayout,
	loading: () => null,
});
export const IconFiveColumnLayout: PreloadableComponent<React.PropsWithChildren<IconProps>> = (
	props,
) =>
	isExperimentEnabled('platform_editor_loosely_lazy_migration') ? (
		<LazySuspense fallback={null}>
			{/* eslint-disable-next-line react/jsx-props-no-spreading -- pass icon props to the lazy component */}
			<IconFiveColumnLayoutLazy {...props} />
		</LazySuspense>
	) : (
		// eslint-disable-next-line react/jsx-props-no-spreading -- pass icon props to the legacy component
		<IconFiveColumnLayoutLoadable {...props} />
	);
IconFiveColumnLayout.preload = () =>
	isExperimentEnabled('platform_editor_loosely_lazy_migration')
		? IconFiveColumnLayoutLazy.preload()
		: IconFiveColumnLayoutLoadable.preload();

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
	const loadIconHeading = () =>
		importHeading(level).then((module) => module.default) as Promise<
			React.ComponentType<React.PropsWithChildren<IconProps>>
		>;
	const IconHeadingLazy = lazy(() => loadIconHeading());
	IconHeadingLazy.displayName = `lazy(IconHeading${level})`;
	const IconHeadingLoadable = Loadable({ loader: loadIconHeading, loading: () => null });

	return isExperimentEnabled('platform_editor_loosely_lazy_migration') ? (
		<LazySuspense fallback={null}>
			<IconHeadingLazy label={label} />
		</LazySuspense>
	) : (
		<IconHeadingLoadable label={label} />
	);
};

const loadIconFeedback = () =>
	import(/* webpackChunkName: "@atlaskit-internal_editor-icon-feedback" */ './feedback').then(
		(module) => module.default,
	) as Promise<React.ComponentType<React.PropsWithChildren<IconProps>>>;
const IconFeedbackLazy = lazy(
	() =>
		import(/* webpackChunkName: "@atlaskit-internal_editor-icon-feedback" */ './feedback').then(
			(module) => module.default,
		) as Promise<React.ComponentType<React.PropsWithChildren<IconProps>>>,
);
IconFeedbackLazy.displayName = 'lazy(IconFeedback)';
const IconFeedbackLoadable = Loadable({ loader: loadIconFeedback, loading: () => null });
export const IconFeedback: PreloadableComponent<React.PropsWithChildren<IconProps>> = (props) =>
	isExperimentEnabled('platform_editor_loosely_lazy_migration') ? (
		<LazySuspense fallback={null}>
			{/* eslint-disable-next-line react/jsx-props-no-spreading -- pass icon props to the lazy component */}
			<IconFeedbackLazy {...props} />
		</LazySuspense>
	) : (
		// eslint-disable-next-line react/jsx-props-no-spreading -- pass icon props to the legacy component
		<IconFeedbackLoadable {...props} />
	);
IconFeedback.preload = () =>
	isExperimentEnabled('platform_editor_loosely_lazy_migration')
		? IconFeedbackLazy.preload()
		: IconFeedbackLoadable.preload();

const loadIconExpand = () =>
	import(/* webpackChunkName: "@atlaskit-internal_editor-icon-expand" */ './expand').then(
		(module) => module.default,
	) as Promise<React.ComponentType<React.PropsWithChildren<IconProps>>>;
const IconExpandLazy = lazy(
	() =>
		import(/* webpackChunkName: "@atlaskit-internal_editor-icon-expand" */ './expand').then(
			(module) => module.default,
		) as Promise<React.ComponentType<React.PropsWithChildren<IconProps>>>,
);
IconExpandLazy.displayName = 'lazy(IconExpand)';
const IconExpandLoadable = Loadable({ loader: loadIconExpand, loading: () => null });
export const IconExpand: PreloadableComponent<React.PropsWithChildren<IconProps>> = (props) =>
	isExperimentEnabled('platform_editor_loosely_lazy_migration') ? (
		<LazySuspense fallback={null}>
			{/* eslint-disable-next-line react/jsx-props-no-spreading -- pass icon props to the lazy component */}
			<IconExpandLazy {...props} />
		</LazySuspense>
	) : (
		// eslint-disable-next-line react/jsx-props-no-spreading -- pass icon props to the legacy component
		<IconExpandLoadable {...props} />
	);
IconExpand.preload = () =>
	isExperimentEnabled('platform_editor_loosely_lazy_migration')
		? IconExpandLazy.preload()
		: IconExpandLoadable.preload();

const loadIconDatasourceJiraIssue = () =>
	import(
		/* webpackChunkName: "@atlaskit-internal_editor-icon-datasource-jira-issue" */ './datasource-jira-issue'
	).then((module) => module.default) as Promise<
		React.ComponentType<React.PropsWithChildren<IconProps>>
	>;
const IconDatasourceJiraIssueLazy = lazy(
	() =>
		import(
			/* webpackChunkName: "@atlaskit-internal_editor-icon-datasource-jira-issue" */ './datasource-jira-issue'
		).then((module) => module.default) as Promise<
			React.ComponentType<React.PropsWithChildren<IconProps>>
		>,
);
IconDatasourceJiraIssueLazy.displayName = 'lazy(IconDatasourceJiraIssue)';
const IconDatasourceJiraIssueLoadable = Loadable({
	loader: loadIconDatasourceJiraIssue,
	loading: () => null,
});
export const IconDatasourceJiraIssue: PreloadableComponent<React.PropsWithChildren<IconProps>> = (
	props,
) =>
	isExperimentEnabled('platform_editor_loosely_lazy_migration') ? (
		<LazySuspense fallback={null}>
			{/* eslint-disable-next-line react/jsx-props-no-spreading -- pass icon props to the lazy component */}
			<IconDatasourceJiraIssueLazy {...props} />
		</LazySuspense>
	) : (
		// eslint-disable-next-line react/jsx-props-no-spreading -- pass icon props to the legacy component
		<IconDatasourceJiraIssueLoadable {...props} />
	);
IconDatasourceJiraIssue.preload = () =>
	isExperimentEnabled('platform_editor_loosely_lazy_migration')
		? IconDatasourceJiraIssueLazy.preload()
		: IconDatasourceJiraIssueLoadable.preload();

const loadIconDatasourceAssetsObjects = () =>
	import(
		/* webpackChunkName: "@atlaskit-internal_editor-icon-datasource-assets-objects" */ './datasource-assets-objects'
	).then((module) => module.default) as Promise<
		React.ComponentType<React.PropsWithChildren<IconProps>>
	>;
const IconDatasourceAssetsObjectsLazy = lazy(
	() =>
		import(
			/* webpackChunkName: "@atlaskit-internal_editor-icon-datasource-assets-objects" */ './datasource-assets-objects'
		).then((module) => module.default) as Promise<
			React.ComponentType<React.PropsWithChildren<IconProps>>
		>,
);
IconDatasourceAssetsObjectsLazy.displayName = 'lazy(IconDatasourceAssetsObjects)';
const IconDatasourceAssetsObjectsLoadable = Loadable({
	loader: loadIconDatasourceAssetsObjects,
	loading: () => null,
});
export const IconDatasourceAssetsObjects: PreloadableComponent<
	React.PropsWithChildren<IconProps>
> = (props) =>
	isExperimentEnabled('platform_editor_loosely_lazy_migration') ? (
		<LazySuspense fallback={null}>
			{/* eslint-disable-next-line react/jsx-props-no-spreading -- pass icon props to the lazy component */}
			<IconDatasourceAssetsObjectsLazy {...props} />
		</LazySuspense>
	) : (
		// eslint-disable-next-line react/jsx-props-no-spreading -- pass icon props to the legacy component
		<IconDatasourceAssetsObjectsLoadable {...props} />
	);
IconDatasourceAssetsObjects.preload = () =>
	isExperimentEnabled('platform_editor_loosely_lazy_migration')
		? IconDatasourceAssetsObjectsLazy.preload()
		: IconDatasourceAssetsObjectsLoadable.preload();

const loadIconDatasourceConfluenceSearch = () =>
	import(
		/* webpackChunkName: "@atlaskit-internal_editor-icon-datasource-confluence-search" */ './datasource-confluence-search'
	).then((module) => module.default) as Promise<
		React.ComponentType<React.PropsWithChildren<IconProps>>
	>;
const IconDatasourceConfluenceSearchLazy = lazy(
	() =>
		import(
			/* webpackChunkName: "@atlaskit-internal_editor-icon-datasource-confluence-search" */ './datasource-confluence-search'
		).then((module) => module.default) as Promise<
			React.ComponentType<React.PropsWithChildren<IconProps>>
		>,
);
IconDatasourceConfluenceSearchLazy.displayName = 'lazy(IconDatasourceConfluenceSearch)';
const IconDatasourceConfluenceSearchLoadable = Loadable({
	loader: loadIconDatasourceConfluenceSearch,
	loading: () => null,
});
export const IconDatasourceConfluenceSearch: PreloadableComponent<
	React.PropsWithChildren<IconProps>
> = (props) =>
	isExperimentEnabled('platform_editor_loosely_lazy_migration') ? (
		<LazySuspense fallback={null}>
			{/* eslint-disable-next-line react/jsx-props-no-spreading -- pass icon props to the lazy component */}
			<IconDatasourceConfluenceSearchLazy {...props} />
		</LazySuspense>
	) : (
		// eslint-disable-next-line react/jsx-props-no-spreading -- pass icon props to the legacy component
		<IconDatasourceConfluenceSearchLoadable {...props} />
	);
IconDatasourceConfluenceSearch.preload = () =>
	isExperimentEnabled('platform_editor_loosely_lazy_migration')
		? IconDatasourceConfluenceSearchLazy.preload()
		: IconDatasourceConfluenceSearchLoadable.preload();

const loadIconLoom = () =>
	import(/* webpackChunkName: "@atlaskit-internal_editor-icon-loom" */ './loom').then(
		(module) => module.default,
	) as Promise<React.ComponentType<React.PropsWithChildren<IconProps>>>;
const IconLoomLazy = lazy(
	() =>
		import(/* webpackChunkName: "@atlaskit-internal_editor-icon-loom" */ './loom').then(
			(module) => module.default,
		) as Promise<React.ComponentType<React.PropsWithChildren<IconProps>>>,
);
IconLoomLazy.displayName = 'lazy(IconLoom)';
const IconLoomLoadable = Loadable({ loader: loadIconLoom, loading: () => null });
export const IconLoom: PreloadableComponent<React.PropsWithChildren<IconProps>> = (props) =>
	isExperimentEnabled('platform_editor_loosely_lazy_migration') ? (
		<LazySuspense fallback={null}>
			{/* eslint-disable-next-line react/jsx-props-no-spreading -- pass icon props to the lazy component */}
			<IconLoomLazy {...props} />
		</LazySuspense>
	) : (
		// eslint-disable-next-line react/jsx-props-no-spreading -- pass icon props to the legacy component
		<IconLoomLoadable {...props} />
	);
IconLoom.preload = () =>
	isExperimentEnabled('platform_editor_loosely_lazy_migration')
		? IconLoomLazy.preload()
		: IconLoomLoadable.preload();

const loadIconSyncBlock = () =>
	import(/* webpackChunkName: "@atlaskit-internal_editor-icon-sync-block" */ './syncBlock').then(
		(module) => module.default,
	) as Promise<React.ComponentType<React.PropsWithChildren<IconProps>>>;
const IconSyncBlockLazy = lazy(
	() =>
		import(/* webpackChunkName: "@atlaskit-internal_editor-icon-sync-block" */ './syncBlock').then(
			(module) => module.default,
		) as Promise<React.ComponentType<React.PropsWithChildren<IconProps>>>,
);
IconSyncBlockLazy.displayName = 'lazy(IconSyncBlock)';
const IconSyncBlockLoadable = Loadable({ loader: loadIconSyncBlock, loading: () => null });
export const IconSyncBlock: PreloadableComponent<React.PropsWithChildren<IconProps>> = (props) =>
	isExperimentEnabled('platform_editor_loosely_lazy_migration') ? (
		<LazySuspense fallback={null}>
			{/* eslint-disable-next-line react/jsx-props-no-spreading -- pass icon props to the lazy component */}
			<IconSyncBlockLazy {...props} />
		</LazySuspense>
	) : (
		// eslint-disable-next-line react/jsx-props-no-spreading -- pass icon props to the legacy component
		<IconSyncBlockLoadable {...props} />
	);
IconSyncBlock.preload = () =>
	isExperimentEnabled('platform_editor_loosely_lazy_migration')
		? IconSyncBlockLazy.preload()
		: IconSyncBlockLoadable.preload();
