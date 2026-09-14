import type { RegisterComponent } from '@atlaskit/editor-ui-control-model/types';

/**
 * Structural toolbar nodes do not render a control by themselves. Treat a surface as populated
 * only once a contributor has registered an interactive descendant.
 */
export const hasSurfaceControls = (components: readonly RegisterComponent[]): boolean =>
	components.some(
		(component) =>
			Boolean(component.component) ||
			component.type === 'button' ||
			component.type === 'menu' ||
			component.type === 'menu-item' ||
			component.type === 'nested-menu',
	);
