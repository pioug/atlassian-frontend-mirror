import { createSurfaceContext } from '@atlaskit/editor-ui-control-model/create-surface-context';
import {
	createContextToken,
	type ContextToken,
	type SurfaceContext,
} from '@atlaskit/editor-ui-control-model/types';

export type RegisteredMenuSurfaceContext = {
	readonly menuOpenId: symbol;
	readonly surface: 'typeahead' | 'toolbar' | 'element-browser';
};

export const REGISTERED_MENU_SURFACE_CONTEXT: ContextToken<RegisteredMenuSurfaceContext> =
	createContextToken<RegisteredMenuSurfaceContext>('registered-menu-surface-context');

export const createRegisteredMenuSurfaceContext = (
	value: RegisteredMenuSurfaceContext,
): SurfaceContext => createSurfaceContext(REGISTERED_MENU_SURFACE_CONTEXT, value);
