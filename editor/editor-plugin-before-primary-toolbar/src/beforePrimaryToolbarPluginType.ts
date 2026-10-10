import type {
	NextEditorPlugin,
	OptionalPlugin,
} from '@atlaskit/editor-common/types/next-editor-plugin';
import type { PrimaryToolbarPlugin } from '@atlaskit/editor-plugin-primary-toolbar/primary-toolbar-plugin-type';

import type { ReactComponents } from './types/ReactComponents';

type Config = {
	beforePrimaryToolbarComponents?: ReactComponents;
};

export type BeforePrimaryToolbarPluginDependencies = [OptionalPlugin<PrimaryToolbarPlugin>];

export type BeforePrimaryToolbarPlugin = NextEditorPlugin<
	'beforePrimaryToolbar',
	{
		dependencies: BeforePrimaryToolbarPluginDependencies;
		pluginConfiguration: Config;
	}
>;
