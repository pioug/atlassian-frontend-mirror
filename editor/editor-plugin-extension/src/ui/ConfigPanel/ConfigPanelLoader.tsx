import React, { type ComponentType } from 'react';

import Loadable from 'react-loadable';

import { isExperimentEnabled } from '@atlaskit/platform-feature-experiments/is-experiment-enabled';
// oxlint-disable-next-line @atlassian/no-restricted-imports
import { lazyForPaint, LazySuspense } from 'react-loosely-lazy';

import type { PublicProps } from './ConfigPanelFieldsLoader';
import LoadingState from './LoadingState';

const loadConfigPanel = () =>
	import(
		/* webpackChunkName: "@atlaskit-internal_editor-core-config-panel" */
		'./ConfigPanelFieldsLoader'
	).then((module) => module.default);

const ConfigPanelLazy = lazyForPaint(() =>
	import(
		/* webpackChunkName: "@atlaskit-internal_editor-core-config-panel" */
		'./ConfigPanelFieldsLoader'
	).then((module) => module.default),
);
const ConfigPanelLoadable = Loadable<PublicProps, never>({
	loader: loadConfigPanel,
	loading: LoadingState,
});

const _default_1: ComponentType<PublicProps> & { preload: () => unknown } = (props) =>
	isExperimentEnabled('platform_editor_loosely_lazy_migration') ? (
		<LazySuspense fallback={<LoadingState />}>
			{/* eslint-disable-next-line react/jsx-props-no-spreading */}
			<ConfigPanelLazy {...props} />
		</LazySuspense>
	) : (
		// eslint-disable-next-line react/jsx-props-no-spreading
		<ConfigPanelLoadable {...props} />
	);

_default_1.preload = () =>
	isExperimentEnabled('platform_editor_loosely_lazy_migration')
		? ConfigPanelLazy.preload()
		: ConfigPanelLoadable.preload();

export default _default_1;
