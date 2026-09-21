import React, { type ComponentType, type PropsWithChildren } from 'react';

import Loadable from 'react-loadable';
// oxlint-disable-next-line @atlassian/no-restricted-imports
import { lazyForPaint, LazySuspense } from 'react-loosely-lazy';

import { isExperimentEnabled } from '@atlaskit/platform-feature-experiments/is-experiment-enabled';

import type { HelpDialogProps } from './index';

const HelpDialogLoadable: ComponentType<PropsWithChildren<HelpDialogProps>> &
	Loadable.LoadableComponent = Loadable({
	loader: () =>
		import(
			/* webpackChunkName: "@atlaskit-internal_editor-core-helpdialog" */
			'./index'
		).then((mod) => mod.default) as Promise<
			React.ComponentType<React.PropsWithChildren<HelpDialogProps>>
		>,
	loading: () => null,
});

const HelpDialogLazy = lazyForPaint(
	() =>
		import(
			/* webpackChunkName: "@atlaskit-internal_editor-core-helpdialog" */
			'./index'
		).then((mod) => mod.default) as Promise<ComponentType<PropsWithChildren<HelpDialogProps>>>,
);

export const HelpDialogLoader: ComponentType<PropsWithChildren<HelpDialogProps>> & {
	preload: () => unknown;
} = (props) =>
	isExperimentEnabled('platform_editor_loosely_lazy_migration') ? (
		<LazySuspense fallback={null}>
			{/* eslint-disable-next-line react/jsx-props-no-spreading -- forward the loader props to the dialog */}
			<HelpDialogLazy {...props} />
		</LazySuspense>
	) : (
		/* eslint-disable-next-line react/jsx-props-no-spreading -- forward the loader props to the dialog */
		<HelpDialogLoadable {...props} />
	);

HelpDialogLoader.preload = () =>
	isExperimentEnabled('platform_editor_loosely_lazy_migration')
		? HelpDialogLazy.preload()
		: HelpDialogLoadable.preload();
