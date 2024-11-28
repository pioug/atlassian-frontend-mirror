import type { NextEditorPlugin, OptionalPlugin } from '@atlaskit/editor-common/types';
import type { PrimaryToolbarPlugin } from '@atlaskit/editor-plugin-primary-toolbar';

import { type ReactComponents } from './types/ReactComponents';

type Config = {
	beforePrimaryToolbarComponents?: ReactComponents;
};

export type BeforePrimaryToolbarPlugin = NextEditorPlugin<
	'beforePrimaryToolbar',
	{
		pluginConfiguration: Config;
		dependencies: [OptionalPlugin<PrimaryToolbarPlugin>];
	}
>;
