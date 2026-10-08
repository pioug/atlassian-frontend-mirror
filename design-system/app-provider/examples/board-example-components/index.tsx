/**
 * Main exports for board example components
 */

export { Accordion } from './accordion';
export { ToggleWithLabel } from './toggle-with-label';
export { BoardCardComponent } from './board-card';
export { BoardColumn } from './board-column';
export { BoardHeader } from './board-header';
export { BoardSection } from './board-section';
export { BoardSubMenu } from './board-sub-menu';
export { BoardTabs } from './board-tabs';
export { ColorInput } from './color-input';
export { ColorModePicker } from './color-mode-picker';
export { HideMenuDropdown, ProjectIconWrapper } from './navigation-components';
export { ProfileThemeControls, type ThemeColorModes } from './profile-theme-controls';
export { SideNavContentComponent } from './side-nav-content';
export { FileUploadButton } from './file-upload-button';
export { LogoUpload } from './logo-upload';
export { SectionHeader } from './section-header';
export { ThemingApproachPicker } from './theming-approach-picker';
export { ThemeControlsPanel } from './theme-controls-panel';
export { TopNavContent } from './top-nav-content';
export { MockSearch } from './mock-search';
export type {
	AdvancedParameters,
	BoardConfig,
	BoardTemplate,
	NavTemplate,
	NavThemingMode,
	ThemeConfig,
	TintingConfig,
} from './types';
export { BOARD_TEMPLATES, NAV_TEMPLATES, LOGO_TEMPLATES } from './constants';
export { AVATAR_DATA } from './constants';
export { calculateAccessibleForegroundColor, setColorLightnessByHct } from './utils/color-utils';
export { generateImageComponent } from './utils/logo-utils';
export { useNavTheming } from './hooks/use-nav-theming';
