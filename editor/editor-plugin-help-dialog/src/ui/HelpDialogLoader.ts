import type { ComponentType, PropsWithChildren } from 'react';

import Loadable from 'react-loadable';

import type { HelpDialogProps } from './index';

export const HelpDialogLoader: ComponentType<PropsWithChildren<HelpDialogProps>> &
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
