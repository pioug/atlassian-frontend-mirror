import Loadable from 'react-loadable';

import type { PublicProps } from './ConfigPanelFieldsLoader';
import LoadingState from './LoadingState';

export default Loadable<PublicProps, never>({
	loader: () =>
		import(
			/* webpackChunkName: "@atlaskit-internal_editor-core-config-panel" */
			'./ConfigPanelFieldsLoader'
		).then((module) => module.default),
	loading: LoadingState,
});
