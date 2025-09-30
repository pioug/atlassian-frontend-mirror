import type {
	RegisterComponent,
	RegisterToolbar,
	ToolbarGroupComponent,
	ToolbarMenuSectionComponent,
	ToolbarSectionComponent,
} from '../../types';

export type ToolbarProps = {
	/**
	 * Every registered toolbar component
	 */
	components: RegisterComponent[];
	/**
	 * Fallback components used in rendering
	 */
	fallbacks: {
		group: ToolbarGroupComponent;
		menuSection: ToolbarMenuSectionComponent;
		section: ToolbarSectionComponent;
	};
	/**
	 * Toolbar component
	 */
	toolbar: RegisterToolbar;
};
