// Disable no-re-export rule for entry point files
/* eslint-disable @atlaskit/editor/no-re-export */

import React from 'react';

import Loadable from 'react-loadable';
// oxlint-disable-next-line @atlassian/no-restricted-imports
import { lazy, LazySuspense } from 'react-loosely-lazy';

import { isExperimentEnabled } from '@atlaskit/platform-feature-experiments/is-experiment-enabled';

import type { IconProps } from '../types';

export { PanelInfoIcon } from './shared/PanelInfoIcon';
export { PanelWarningIcon } from './shared/PanelWarningIcon';
export { PanelErrorIcon } from './shared/PanelErrorIcon';
export { PanelSuccessIcon } from './shared/PanelSuccessIcon';
export { PanelNoteIcon } from './shared/PanelNoteIcon';
export { BorderIcon } from './shared/BorderIcon';
export {
	SteppedRainbowIconDecoration,
	rainbow,
	disabledRainbow,
} from './shared/SteppedRainbowIconDecoration';
export { DynamicStrokeIconDecoration } from './shared/DynamicStrokeIconDecoration';

const loadIconTable = () =>
	import(
		/* webpackChunkName: "@atlaskit-internal_editor-icon-table" */ '../icons/shared/table'
	).then((module) => module.default) as Promise<
		React.ComponentType<React.PropsWithChildren<IconProps>>
	>;

const IconTableLazy = lazy(
	() =>
		import(
			/* webpackChunkName: "@atlaskit-internal_editor-icon-table" */ '../icons/shared/table'
		).then((module) => module.default) as Promise<
			React.ComponentType<React.PropsWithChildren<IconProps>>
		>,
);
IconTableLazy.displayName = 'lazy(IconTable)';
const IconTableLoadable = Loadable({
	loader: loadIconTable,
	loading: () => null,
});
export const IconTable: {
	(props: React.PropsWithChildren<IconProps>): React.ReactElement;
	preload: () => void;
} = (props) =>
	isExperimentEnabled('platform_editor_loosely_lazy_migration') ? (
		<LazySuspense fallback={null}>
			{/* eslint-disable-next-line react/jsx-props-no-spreading -- pass icon props to the lazy component */}
			<IconTableLazy {...props} />
		</LazySuspense>
	) : (
		// eslint-disable-next-line react/jsx-props-no-spreading -- pass icon props to the legacy component
		<IconTableLoadable {...props} />
	);

IconTable.preload = () =>
	isExperimentEnabled('platform_editor_loosely_lazy_migration')
		? IconTableLazy.preload()
		: IconTableLoadable.preload();
