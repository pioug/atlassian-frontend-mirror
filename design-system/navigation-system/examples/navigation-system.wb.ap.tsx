import { wb, type WorkbenchExample } from '@atlassian/workbench';

import { default as AdvancedLayoutExample } from './advanced-layout';
import { default as CompanyHubMockVrExample } from './company-hub-mock.vr.ap';
import { default as CompositionVrExample } from './composition.vr.ap';
import { default as ConfluenceMockExample } from './confluence-mock';
import { default as CustomSkipLinksExample } from './custom-skip-links';
import { default as DragAndDropInTheSidebarFlyoutExample } from './drag-and-drop-in-the-sidebar-flyout';
import { default as InteractiveLayoutWithTopLayerExample } from './interactive-layout-with-top-layer';
import { default as InteractiveLayoutExample } from './interactive-layout';
import { default as JiraMockExample } from './jira-mock';
import { default as JiraSettingsMockExample } from './jira-settings-mock';
import { default as LayersInMainVrExample } from './layers-in-main.vr.ap';
import { default as LegacyVarTestingExample } from './legacy-var-testing';
import { default as MainContentBorderVrExample } from './main-content-border.vr.ap';
import { default as MenuItemIntegrationExample } from './menu-item-integration';
import { default as NavigationShellVrExample } from './navigation-shell.vr.ap';
import { default as PageLayoutAllSlotsBannerHeightZeroExample } from './page-layout-all-slots-banner-height-zero';
import { default as PageLayoutAllSlotsCustomSizesExample } from './page-layout-all-slots-custom-sizes';
import { default as PageLayoutAllSlotsRtlExample } from './page-layout-all-slots-rtl';
import { default as PageLayoutAllSlotsScrollableExample } from './page-layout-all-slots-scrollable';
import { default as PageLayoutAllSlotsExample } from './page-layout-all-slots';
import { default as PageLayoutAsideBorderVrExample } from './page-layout-aside-border.vr.ap';
import { default as PageLayoutContentIsIframesExample } from './page-layout-content-is-iframes';
import { default as PageLayoutEdgeCaseAbsolutePositionedCollapsedCustomSizesExample } from './page-layout-edge-case-absolute-positioned-collapsed-custom-sizes';
import { default as PageLayoutEdgeCaseAbsolutePositionedCollapsedExample } from './page-layout-edge-case-absolute-positioned-collapsed';
import { default as PageLayoutEdgeCaseAbsolutePositionedPanelVisibleExample } from './page-layout-edge-case-absolute-positioned-panel-visible';
import { default as PageLayoutEdgeCaseAbsolutePositionedResizableExample } from './page-layout-edge-case-absolute-positioned-resizable';
import { default as PageLayoutEdgeCaseAbsolutePositionedExample } from './page-layout-edge-case-absolute-positioned';
import { default as PageLayoutEdgeCaseUsingLegacyVarsExample } from './page-layout-edge-case-using-legacy-vars';
import { default as PageLayoutFullScreenExample } from './page-layout-full-screen';
import { default as PageLayoutImplicitRowsVrExample } from './page-layout-implicit-rows.vr.ap';
import { default as PageLayoutMainAsideScrollableExample } from './page-layout-main-aside-scrollable';
import { default as PageLayoutMainAsideExample } from './page-layout-main-aside';
import { default as PageLayoutPanelAsideDefaultWidthsVrExample } from './page-layout-panel-aside-default-widths.vr.ap';
import { default as PageLayoutResizableRtlExample } from './page-layout-resizable-rtl';
import { default as PageLayoutResizableExample } from './page-layout-resizable';
import { default as PageLayoutSideNavContentScrollWithStickyVrExample } from './page-layout-side-nav-content-scroll-with-sticky.vr.ap';
import { default as PageLayoutSideNavCustomWidthGreaterThanMaxExample } from './page-layout-side-nav-custom-width-greater-than-max';
import { default as PageLayoutSideNavCustomWidthSmallerThanMinExample } from './page-layout-side-nav-custom-width-smaller-than-min';
import { default as PageLayoutSideNavMainAsideScrollableExample } from './page-layout-side-nav-main-aside-scrollable';
import { default as PageLayoutSideNavMainAsideExample } from './page-layout-side-nav-main-aside';
import { default as PageLayoutSideNavOnboardingExample } from './page-layout-side-nav-onboarding';
import { default as PageLayoutSideNavOverflowingChildrenExample } from './page-layout-side-nav-overflowing-children';
import { default as PageLayoutSideNavSlotsVrExample } from './page-layout-side-nav-slots.vr.ap';
import { default as PageLayoutSideNavWithMenuItemsExample } from './page-layout-side-nav-with-menu-items';
import { default as PageLayoutTopBarSideNavMainAsideScrollableExample } from './page-layout-top-bar-side-nav-main-aside-scrollable';
import { default as PageLayoutTopBarSideNavMainAsideExample } from './page-layout-top-bar-side-nav-main-aside';
import { default as PageLayoutTopBarSideNavMainScrollableExample } from './page-layout-top-bar-side-nav-main-scrollable';
import { default as PageLayoutTopBarSideNavMainExample } from './page-layout-top-bar-side-nav-main';
import { default as PageLayoutTopLayerDialogAsDirectChildVrExample } from './page-layout-top-layer-dialog-as-direct-child.vr.ap';
import { default as PageLayoutTopLayerPopoverAsDirectChildVrExample } from './page-layout-top-layer-popover-as-direct-child.vr.ap';
import { default as PanelSplitterVrExample } from './panel-splitter.vr.ap';
import { default as ResizableSlotsExample } from './resizable-slots';
import { default as RibbonWithoutSideNavVrExample } from './ribbon-without-side-nav.vr.ap';
import { default as RibbonVrExample } from './ribbon.vr.ap';
import { default as SideNavFlyoutVrExample } from './side-nav-flyout.vr.ap';
import { default as SideNavLayeringVrExample } from './side-nav-layering.vr.ap';
import { default as SideNavToggleButtonVrExample } from './side-nav-toggle-button.vr.ap';
import { default as StandAloneIframeExample } from './stand-alone-iframe';
import { default as TopNavCustomProfileImageVrExample } from './top-nav-custom-profile-image.vr.ap';
import { default as TopNavSideNavCollapsedVrExample } from './top-nav-side-nav-collapsed.vr.ap';
import { default as TopNavWithLongNameVrExample } from './top-nav-with-long-name.vr.ap';
import { default as TopNavWithTempNavAppIconAppLogoVrExample } from './top-nav-with-temp-nav-app-icon-app-logo.vr.ap';
import { default as TopNavWithTempNavAppIconCustomLogoExample } from './top-nav-with-temp-nav-app-icon-custom-logo';
import { default as TopNavigationAppLogoSecondaryNameVrExample } from './top-navigation-app-logo-secondary-name.vr.ap';
import { default as TopNavigationAppLogosVrExample } from './top-navigation-app-logos.vr.ap';
import { default as TopNavigationCustomAppSwitcherVrExample } from './top-navigation-custom-app-switcher.vr.ap';
import { default as TopNavigationCustomLogoVrExample } from './top-navigation-custom-logo.vr.ap';
import { default as TopNavigationStressVrExample } from './top-navigation-stress.vr.ap';
import { default as TopNavigationThemedButtonsVrExample } from './top-navigation-themed-buttons.vr.ap';
import { default as TopNavigationThemingLoggedOutVrExample } from './top-navigation-theming-logged-out.vr.ap';
import { default as TopNavigationThemingWithPickerVrExample } from './top-navigation-theming-with-picker.vr.ap';
import { default as TopNavigationThemingVrExample } from './top-navigation-theming.vr.ap';
import { default as TopNavigationVrExample } from './top-navigation.vr.ap';

const AdvancedLayout: WorkbenchExample = wb(AdvancedLayoutExample);

export default AdvancedLayout;
export const CompanyHubMockVr: WorkbenchExample = wb(CompanyHubMockVrExample);
export const CompositionVr: WorkbenchExample = wb(CompositionVrExample);
export const ConfluenceMock: WorkbenchExample = wb(ConfluenceMockExample);
export const CustomSkipLinks: WorkbenchExample = wb(CustomSkipLinksExample);
export const DragAndDropInTheSidebarFlyout: WorkbenchExample = wb(
	DragAndDropInTheSidebarFlyoutExample,
);
export const InteractiveLayoutWithTopLayer: WorkbenchExample = wb(
	InteractiveLayoutWithTopLayerExample,
);
export const InteractiveLayout: WorkbenchExample = wb(InteractiveLayoutExample);
export const JiraMock: WorkbenchExample = wb(JiraMockExample);
export const JiraSettingsMock: WorkbenchExample = wb(JiraSettingsMockExample);
export const LayersInMainVr: WorkbenchExample = wb(LayersInMainVrExample);
export const LegacyVarTesting: WorkbenchExample = wb(LegacyVarTestingExample);
export const MainContentBorderVr: WorkbenchExample = wb(MainContentBorderVrExample);
export const MenuItemIntegration: WorkbenchExample = wb(MenuItemIntegrationExample);
export const NavigationShellVr: WorkbenchExample = wb(NavigationShellVrExample);
export const PageLayoutAllSlotsBannerHeightZero: WorkbenchExample = wb(
	PageLayoutAllSlotsBannerHeightZeroExample,
);
export const PageLayoutAllSlotsCustomSizes: WorkbenchExample = wb(
	PageLayoutAllSlotsCustomSizesExample,
);
export const PageLayoutAllSlotsRtl: WorkbenchExample = wb(PageLayoutAllSlotsRtlExample);
export const PageLayoutAllSlotsScrollable: WorkbenchExample = wb(
	PageLayoutAllSlotsScrollableExample,
);
export const PageLayoutAllSlots: WorkbenchExample = wb(PageLayoutAllSlotsExample);
export const PageLayoutAsideBorderVr: WorkbenchExample = wb(PageLayoutAsideBorderVrExample);
export const PageLayoutContentIsIframes: WorkbenchExample = wb(PageLayoutContentIsIframesExample);
export const PageLayoutEdgeCaseAbsolutePositionedCollapsedCustomSizes: WorkbenchExample = wb(
	PageLayoutEdgeCaseAbsolutePositionedCollapsedCustomSizesExample,
);
export const PageLayoutEdgeCaseAbsolutePositionedCollapsed: WorkbenchExample = wb(
	PageLayoutEdgeCaseAbsolutePositionedCollapsedExample,
);
export const PageLayoutEdgeCaseAbsolutePositionedPanelVisible: WorkbenchExample = wb(
	PageLayoutEdgeCaseAbsolutePositionedPanelVisibleExample,
);
export const PageLayoutEdgeCaseAbsolutePositionedResizable: WorkbenchExample = wb(
	PageLayoutEdgeCaseAbsolutePositionedResizableExample,
);
export const PageLayoutEdgeCaseAbsolutePositioned: WorkbenchExample = wb(
	PageLayoutEdgeCaseAbsolutePositionedExample,
);
export const PageLayoutEdgeCaseUsingLegacyVars: WorkbenchExample = wb(
	PageLayoutEdgeCaseUsingLegacyVarsExample,
);
export const PageLayoutFullScreen: WorkbenchExample = wb(PageLayoutFullScreenExample);
export const PageLayoutImplicitRowsVr: WorkbenchExample = wb(PageLayoutImplicitRowsVrExample);
export const PageLayoutMainAsideScrollable: WorkbenchExample = wb(
	PageLayoutMainAsideScrollableExample,
);
export const PageLayoutMainAside: WorkbenchExample = wb(PageLayoutMainAsideExample);
export const PageLayoutPanelAsideDefaultWidthsVr: WorkbenchExample = wb(
	PageLayoutPanelAsideDefaultWidthsVrExample,
);
export const PageLayoutResizableRtl: WorkbenchExample = wb(PageLayoutResizableRtlExample);
export const PageLayoutResizable: WorkbenchExample = wb(PageLayoutResizableExample);
export const PageLayoutSideNavContentScrollWithStickyVr: WorkbenchExample = wb(
	PageLayoutSideNavContentScrollWithStickyVrExample,
);
export const PageLayoutSideNavCustomWidthGreaterThanMax: WorkbenchExample = wb(
	PageLayoutSideNavCustomWidthGreaterThanMaxExample,
);
export const PageLayoutSideNavCustomWidthSmallerThanMin: WorkbenchExample = wb(
	PageLayoutSideNavCustomWidthSmallerThanMinExample,
);
export const PageLayoutSideNavMainAsideScrollable: WorkbenchExample = wb(
	PageLayoutSideNavMainAsideScrollableExample,
);
export const PageLayoutSideNavMainAside: WorkbenchExample = wb(PageLayoutSideNavMainAsideExample);
export const PageLayoutSideNavOnboarding: WorkbenchExample = wb(PageLayoutSideNavOnboardingExample);
export const PageLayoutSideNavOverflowingChildren: WorkbenchExample = wb(
	PageLayoutSideNavOverflowingChildrenExample,
);
export const PageLayoutSideNavSlotsVr: WorkbenchExample = wb(PageLayoutSideNavSlotsVrExample);
export const PageLayoutSideNavWithMenuItems: WorkbenchExample = wb(
	PageLayoutSideNavWithMenuItemsExample,
);
export const PageLayoutTopBarSideNavMainAsideScrollable: WorkbenchExample = wb(
	PageLayoutTopBarSideNavMainAsideScrollableExample,
);
export const PageLayoutTopBarSideNavMainAside: WorkbenchExample = wb(
	PageLayoutTopBarSideNavMainAsideExample,
);
export const PageLayoutTopBarSideNavMainScrollable: WorkbenchExample = wb(
	PageLayoutTopBarSideNavMainScrollableExample,
);
export const PageLayoutTopBarSideNavMain: WorkbenchExample = wb(PageLayoutTopBarSideNavMainExample);
export const PageLayoutTopLayerDialogAsDirectChildVr: WorkbenchExample = wb(
	PageLayoutTopLayerDialogAsDirectChildVrExample,
);
export const PageLayoutTopLayerPopoverAsDirectChildVr: WorkbenchExample = wb(
	PageLayoutTopLayerPopoverAsDirectChildVrExample,
);
export const PanelSplitterVr: WorkbenchExample = wb(PanelSplitterVrExample);
export const ResizableSlots: WorkbenchExample = wb(ResizableSlotsExample);
export const RibbonWithoutSideNavVr: WorkbenchExample = wb(RibbonWithoutSideNavVrExample);
export const RibbonVr: WorkbenchExample = wb(RibbonVrExample);
export const SideNavFlyoutVr: WorkbenchExample = wb(SideNavFlyoutVrExample);
export const SideNavLayeringVr: WorkbenchExample = wb(SideNavLayeringVrExample);
export const SideNavToggleButtonVr: WorkbenchExample = wb(SideNavToggleButtonVrExample);
export const StandAloneIframe: WorkbenchExample = wb(StandAloneIframeExample);
export const TopNavCustomProfileImageVr: WorkbenchExample = wb(TopNavCustomProfileImageVrExample);
export const TopNavSideNavCollapsedVr: WorkbenchExample = wb(TopNavSideNavCollapsedVrExample);
export const TopNavWithLongNameVr: WorkbenchExample = wb(TopNavWithLongNameVrExample);
export const TopNavWithTempNavAppIconAppLogoVr: WorkbenchExample = wb(
	TopNavWithTempNavAppIconAppLogoVrExample,
);
export const TopNavWithTempNavAppIconCustomLogo: WorkbenchExample = wb(
	TopNavWithTempNavAppIconCustomLogoExample,
);
export const TopNavigationAppLogoSecondaryNameVr: WorkbenchExample = wb(
	TopNavigationAppLogoSecondaryNameVrExample,
);
export const TopNavigationAppLogosVr: WorkbenchExample = wb(TopNavigationAppLogosVrExample);
export const TopNavigationCustomAppSwitcherVr: WorkbenchExample = wb(
	TopNavigationCustomAppSwitcherVrExample,
);
export const TopNavigationCustomLogoVr: WorkbenchExample = wb(TopNavigationCustomLogoVrExample);
export const TopNavigationStressVr: WorkbenchExample = wb(TopNavigationStressVrExample);
export const TopNavigationThemedButtonsVr: WorkbenchExample = wb(
	TopNavigationThemedButtonsVrExample,
);
export const TopNavigationThemingLoggedOutVr: WorkbenchExample = wb(
	TopNavigationThemingLoggedOutVrExample,
);
export const TopNavigationThemingWithPickerVr: WorkbenchExample = wb(
	TopNavigationThemingWithPickerVrExample,
);
export const TopNavigationThemingVr: WorkbenchExample = wb(TopNavigationThemingVrExample);
export const TopNavigationVr: WorkbenchExample = wb(TopNavigationVrExample);
