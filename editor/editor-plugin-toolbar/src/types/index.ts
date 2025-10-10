import type { RegisterComponent } from '@atlaskit/editor-toolbar-model';

export type ToolbarPluginOptions = {
	disableSelectionToolbar?: boolean;
	disableSelectionToolbarWhenPinned?: boolean;
	/**
	 * Option to enable new toolbar designs
	 */
	enableNewToolbarExperience?: boolean;
};

export type RegisterComponentsAction = (
	toolbarComponents: Array<RegisterComponent>,
	/*
	 * If true, the provided `toolbarComponents` will first be checked using key and type in the registry, if
	 * the item already exists it will be replaced instead.
	 *
	 * Most likely you should avoid using this and just use the `register` method as it's preferred.
	 */
	replaceItems?: boolean,
) => void;
