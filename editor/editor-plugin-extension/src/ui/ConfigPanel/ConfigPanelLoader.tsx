import type { ComponentType } from 'react';

import Loadable from 'react-loadable';

import type { PublicProps } from './ConfigPanelFieldsLoader';
import LoadingState from './LoadingState';

const _default_1: ComponentType<PublicProps> & Loadable.LoadableComponent = Loadable<
	PublicProps,
	never
>({
	loader: () =>
		import(
			/* webpackChunkName: "@atlaskit-internal_editor-core-config-panel" */
			'./ConfigPanelFieldsLoader'
		).then((module) => module.default),
	loading: LoadingState,
});
export default _default_1;
