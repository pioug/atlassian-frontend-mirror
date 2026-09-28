import { wb, type WorkbenchExample } from '@atlassian/workbench';

import { default as AdvancedLayoutExample } from '../advanced-layout';
import { default as CompanyHubMockVrExample } from '../company-hub-mock.vr.ap';
import { default as CompositionVrExample } from '../composition.vr.ap';
import { default as ConfluenceMockExample } from '../confluence-mock';
import { default as CustomSkipLinksExample } from '../custom-skip-links';
import { default as DragAndDropInTheSidebarFlyoutExample } from '../drag-and-drop-in-the-sidebar-flyout';
import { default as InteractiveLayoutExample } from '../interactive-layout';
import { default as InteractiveLayoutWithTopLayerExample } from '../interactive-layout-with-top-layer';
import { default as JiraMockExample } from '../jira-mock';
import { default as JiraSettingsMockExample } from '../jira-settings-mock';
import { default as LayersInMainVrExample } from '../layers-in-main.vr.ap';
import { default as LegacyVarTestingExample } from '../legacy-var-testing';
import { default as MainContentBorderVrExample } from '../main-content-border.vr.ap';
import { default as MenuItemIntegrationExample } from '../menu-item-integration';
import { default as NavigationShellVrExample } from '../navigation-shell.vr.ap';
import { default as PageLayoutAllSlotsExample } from '../page-layout-all-slots';
import { default as PageLayoutAllSlotsBannerHeightZeroExample } from '../page-layout-all-slots-banner-height-zero';
import { default as PageLayoutAllSlotsCustomSizesExample } from '../page-layout-all-slots-custom-sizes';
import { default as PageLayoutAllSlotsRtlExample } from '../page-layout-all-slots-rtl';
import { default as PageLayoutAllSlotsScrollableExample } from '../page-layout-all-slots-scrollable';
import { default as PageLayoutAsideBorderVrExample } from '../page-layout-aside-border.vr.ap';
import { default as PageLayoutContentIsIframesExample } from '../page-layout-content-is-iframes';
import { default as PageLayoutEdgeCaseAbsolutePositionedExample } from '../page-layout-edge-case-absolute-positioned';
import { default as PageLayoutEdgeCaseAbsolutePositionedCollapsedExample } from '../page-layout-edge-case-absolute-positioned-collapsed';
import { default as PageLayoutEdgeCaseAbsolutePositionedCollapsedCustomSizesExample } from '../page-layout-edge-case-absolute-positioned-collapsed-custom-sizes';
import { default as PageLayoutEdgeCaseAbsolutePositionedPanelVisibleExample } from '../page-layout-edge-case-absolute-positioned-panel-visible';
import { default as PageLayoutEdgeCaseAbsolutePositionedResizableExample } from '../page-layout-edge-case-absolute-positioned-resizable';
import { default as PageLayoutEdgeCaseUsingLegacyVarsExample } from '../page-layout-edge-case-using-legacy-vars';
import { default as PageLayoutFullScreenExample } from '../page-layout-full-screen';
import { default as PageLayoutImplicitRowsVrExample } from '../page-layout-implicit-rows.vr.ap';
import { default as PageLayoutMainAsideExample } from '../page-layout-main-aside';
import { default as PageLayoutMainAsideScrollableExample } from '../page-layout-main-aside-scrollable';
import { default as PageLayoutPanelAsideDefaultWidthsVrExample } from '../page-layout-panel-aside-default-widths.vr.ap';
import { default as PageLayoutResizableExample } from '../page-layout-resizable';
import { default as PageLayoutResizableRtlExample } from '../page-layout-resizable-rtl';
import { default as PageLayoutSideNavContentScrollWithStickyVrExample } from '../page-layout-side-nav-content-scroll-with-sticky.vr.ap';
import { default as PageLayoutSideNavCustomWidthGreaterThanMaxExample } from '../page-layout-side-nav-custom-width-greater-than-max';
import { default as PageLayoutSideNavCustomWidthSmallerThanMinExample } from '../page-layout-side-nav-custom-width-smaller-than-min';
import { default as PageLayoutSideNavMainAsideExample } from '../page-layout-side-nav-main-aside';
import { default as PageLayoutSideNavMainAsideScrollableExample } from '../page-layout-side-nav-main-aside-scrollable';
import { default as PageLayoutSideNavOnboardingExample } from '../page-layout-side-nav-onboarding';
import { default as PageLayoutSideNavOverflowingChildrenExample } from '../page-layout-side-nav-overflowing-children';
import { default as PageLayoutSideNavSlotsVrExample } from '../page-layout-side-nav-slots.vr.ap';
import { default as PageLayoutSideNavWithMenuItemsExample } from '../page-layout-side-nav-with-menu-items';
import { default as PageLayoutTopBarSideNavMainExample } from '../page-layout-top-bar-side-nav-main';
import { default as PageLayoutTopBarSideNavMainAsideExample } from '../page-layout-top-bar-side-nav-main-aside';
import { default as PageLayoutTopBarSideNavMainAsideScrollableExample } from '../page-layout-top-bar-side-nav-main-aside-scrollable';
import { default as PageLayoutTopBarSideNavMainScrollableExample } from '../page-layout-top-bar-side-nav-main-scrollable';
import { default as PageLayoutTopLayerDialogAsDirectChildVrExample } from '../page-layout-top-layer-dialog-as-direct-child.vr.ap';
import { default as PageLayoutTopLayerPopoverAsDirectChildVrExample } from '../page-layout-top-layer-popover-as-direct-child.vr.ap';
import { default as PanelSplitterVrExample } from '../panel-splitter.vr.ap';
import { default as ResizableSlotsExample } from '../resizable-slots';
import { default as RibbonWithoutSideNavVrExample } from '../ribbon-without-side-nav.vr.ap';
import { default as RibbonVrExample } from '../ribbon.vr.ap';
import { default as SideNavFlyoutVrExample } from '../side-nav-flyout.vr.ap';
import { default as SideNavLayeringVrExample } from '../side-nav-layering.vr.ap';
import { default as SideNavToggleButtonVrExample } from '../side-nav-toggle-button.vr.ap';
import { default as StandAloneIframeExample } from '../stand-alone-iframe';
import { default as TopNavCustomProfileImageVrExample } from '../top-nav-custom-profile-image.vr.ap';
import { default as TopNavSideNavCollapsedVrExample } from '../top-nav-side-nav-collapsed.vr.ap';
import { default as TopNavWithLongNameVrExample } from '../top-nav-with-long-name.vr.ap';
import { default as TopNavWithTempNavAppIconAppLogoVrExample } from '../top-nav-with-temp-nav-app-icon-app-logo.vr.ap';
import { default as TopNavWithTempNavAppIconCustomLogoExample } from '../top-nav-with-temp-nav-app-icon-custom-logo';
import { default as TopNavigationAppLogoSecondaryNameVrExample } from '../top-navigation-app-logo-secondary-name.vr.ap';
import { default as TopNavigationAppLogosVrExample } from '../top-navigation-app-logos.vr.ap';
import { default as TopNavigationCustomAppSwitcherVrExample } from '../top-navigation-custom-app-switcher.vr.ap';
import { default as TopNavigationCustomLogoVrExample } from '../top-navigation-custom-logo.vr.ap';
import { default as TopNavigationStressVrExample } from '../top-navigation-stress.vr.ap';
import { default as TopNavigationThemedButtonsVrExample } from '../top-navigation-themed-buttons.vr.ap';
import { default as TopNavigationThemingLoggedOutVrExample } from '../top-navigation-theming-logged-out.vr.ap';
import { default as TopNavigationThemingWithPickerVrExample } from '../top-navigation-theming-with-picker.vr.ap';
import { default as TopNavigationThemingVrExample } from '../top-navigation-theming.vr.ap';
import { default as TopNavigationVrExample } from '../top-navigation.vr.ap';

export const AdvancedLayout: WorkbenchExample<typeof AdvancedLayoutExample> =
	wb(AdvancedLayoutExample);

export const CompanyHubMockVr: WorkbenchExample<typeof CompanyHubMockVrExample> =
	wb(CompanyHubMockVrExample);
export const CompositionVr: WorkbenchExample<typeof CompositionVrExample> =
	wb(CompositionVrExample);
export const ConfluenceMock: WorkbenchExample<typeof ConfluenceMockExample> =
	wb(ConfluenceMockExample);
export const CustomSkipLinks: WorkbenchExample<typeof CustomSkipLinksExample> =
	wb(CustomSkipLinksExample);
export const DragAndDropInTheSidebarFlyout: WorkbenchExample<
	typeof DragAndDropInTheSidebarFlyoutExample
> = wb(DragAndDropInTheSidebarFlyoutExample);
export const InteractiveLayoutWithTopLayer: WorkbenchExample<
	typeof InteractiveLayoutWithTopLayerExample
> = wb(InteractiveLayoutWithTopLayerExample);
export const InteractiveLayout: WorkbenchExample<typeof InteractiveLayoutExample> =
	wb(InteractiveLayoutExample);
export const JiraMock: WorkbenchExample<typeof JiraMockExample> = wb(JiraMockExample);
export const JiraSettingsMock: WorkbenchExample<typeof JiraSettingsMockExample> =
	wb(JiraSettingsMockExample);
export const LayersInMainVr: WorkbenchExample<typeof LayersInMainVrExample> =
	wb(LayersInMainVrExample);
export const LegacyVarTesting: WorkbenchExample<typeof LegacyVarTestingExample> =
	wb(LegacyVarTestingExample);
export const MainContentBorderVr: WorkbenchExample<typeof MainContentBorderVrExample> = wb(
	MainContentBorderVrExample,
);
export const MenuItemIntegration: WorkbenchExample<typeof MenuItemIntegrationExample> = wb(
	MenuItemIntegrationExample,
);
export const NavigationShellVr: WorkbenchExample<typeof NavigationShellVrExample> =
	wb(NavigationShellVrExample);
export const PageLayoutAllSlotsBannerHeightZero: WorkbenchExample<
	typeof PageLayoutAllSlotsBannerHeightZeroExample
> = wb(PageLayoutAllSlotsBannerHeightZeroExample);
export const PageLayoutAllSlotsCustomSizes: WorkbenchExample<
	typeof PageLayoutAllSlotsCustomSizesExample
> = wb(PageLayoutAllSlotsCustomSizesExample);
export const PageLayoutAllSlotsRtl: WorkbenchExample<typeof PageLayoutAllSlotsRtlExample> = wb(
	PageLayoutAllSlotsRtlExample,
);
export const PageLayoutAllSlotsScrollable: WorkbenchExample<
	typeof PageLayoutAllSlotsScrollableExample
> = wb(PageLayoutAllSlotsScrollableExample);
export const PageLayoutAllSlots: WorkbenchExample<typeof PageLayoutAllSlotsExample> =
	wb(PageLayoutAllSlotsExample);
export const PageLayoutAsideBorderVr: WorkbenchExample<typeof PageLayoutAsideBorderVrExample> = wb(
	PageLayoutAsideBorderVrExample,
);
export const PageLayoutContentIsIframes: WorkbenchExample<
	typeof PageLayoutContentIsIframesExample
> = wb(PageLayoutContentIsIframesExample);
export const PageLayoutEdgeCaseAbsolutePositionedCollapsedCustomSizes: WorkbenchExample<
	typeof PageLayoutEdgeCaseAbsolutePositionedCollapsedCustomSizesExample
> = wb(PageLayoutEdgeCaseAbsolutePositionedCollapsedCustomSizesExample);
export const PageLayoutEdgeCaseAbsolutePositionedCollapsed: WorkbenchExample<
	typeof PageLayoutEdgeCaseAbsolutePositionedCollapsedExample
> = wb(PageLayoutEdgeCaseAbsolutePositionedCollapsedExample);
export const PageLayoutEdgeCaseAbsolutePositionedPanelVisible: WorkbenchExample<
	typeof PageLayoutEdgeCaseAbsolutePositionedPanelVisibleExample
> = wb(PageLayoutEdgeCaseAbsolutePositionedPanelVisibleExample);
export const PageLayoutEdgeCaseAbsolutePositionedResizable: WorkbenchExample<
	typeof PageLayoutEdgeCaseAbsolutePositionedResizableExample
> = wb(PageLayoutEdgeCaseAbsolutePositionedResizableExample);
export const PageLayoutEdgeCaseAbsolutePositioned: WorkbenchExample<
	typeof PageLayoutEdgeCaseAbsolutePositionedExample
> = wb(PageLayoutEdgeCaseAbsolutePositionedExample);
export const PageLayoutEdgeCaseUsingLegacyVars: WorkbenchExample<
	typeof PageLayoutEdgeCaseUsingLegacyVarsExample
> = wb(PageLayoutEdgeCaseUsingLegacyVarsExample);
export const PageLayoutFullScreen: WorkbenchExample<typeof PageLayoutFullScreenExample> = wb(
	PageLayoutFullScreenExample,
);
export const PageLayoutImplicitRowsVr: WorkbenchExample<typeof PageLayoutImplicitRowsVrExample> =
	wb(PageLayoutImplicitRowsVrExample);
export const PageLayoutMainAsideScrollable: WorkbenchExample<
	typeof PageLayoutMainAsideScrollableExample
> = wb(PageLayoutMainAsideScrollableExample);
export const PageLayoutMainAside: WorkbenchExample<typeof PageLayoutMainAsideExample> = wb(
	PageLayoutMainAsideExample,
);
export const PageLayoutPanelAsideDefaultWidthsVr: WorkbenchExample<
	typeof PageLayoutPanelAsideDefaultWidthsVrExample
> = wb(PageLayoutPanelAsideDefaultWidthsVrExample);
export const PageLayoutResizableRtl: WorkbenchExample<typeof PageLayoutResizableRtlExample> = wb(
	PageLayoutResizableRtlExample,
);
export const PageLayoutResizable: WorkbenchExample<typeof PageLayoutResizableExample> = wb(
	PageLayoutResizableExample,
);
export const PageLayoutSideNavContentScrollWithStickyVr: WorkbenchExample<
	typeof PageLayoutSideNavContentScrollWithStickyVrExample
> = wb(PageLayoutSideNavContentScrollWithStickyVrExample);
export const PageLayoutSideNavCustomWidthGreaterThanMax: WorkbenchExample<
	typeof PageLayoutSideNavCustomWidthGreaterThanMaxExample
> = wb(PageLayoutSideNavCustomWidthGreaterThanMaxExample);
export const PageLayoutSideNavCustomWidthSmallerThanMin: WorkbenchExample<
	typeof PageLayoutSideNavCustomWidthSmallerThanMinExample
> = wb(PageLayoutSideNavCustomWidthSmallerThanMinExample);
export const PageLayoutSideNavMainAsideScrollable: WorkbenchExample<
	typeof PageLayoutSideNavMainAsideScrollableExample
> = wb(PageLayoutSideNavMainAsideScrollableExample);
export const PageLayoutSideNavMainAside: WorkbenchExample<
	typeof PageLayoutSideNavMainAsideExample
> = wb(PageLayoutSideNavMainAsideExample);
export const PageLayoutSideNavOnboarding: WorkbenchExample<
	typeof PageLayoutSideNavOnboardingExample
> = wb(PageLayoutSideNavOnboardingExample);
export const PageLayoutSideNavOverflowingChildren: WorkbenchExample<
	typeof PageLayoutSideNavOverflowingChildrenExample
> = wb(PageLayoutSideNavOverflowingChildrenExample);
export const PageLayoutSideNavSlotsVr: WorkbenchExample<typeof PageLayoutSideNavSlotsVrExample> =
	wb(PageLayoutSideNavSlotsVrExample);
export const PageLayoutSideNavWithMenuItems: WorkbenchExample<
	typeof PageLayoutSideNavWithMenuItemsExample
> = wb(PageLayoutSideNavWithMenuItemsExample);
export const PageLayoutTopBarSideNavMainAsideScrollable: WorkbenchExample<
	typeof PageLayoutTopBarSideNavMainAsideScrollableExample
> = wb(PageLayoutTopBarSideNavMainAsideScrollableExample);
export const PageLayoutTopBarSideNavMainAside: WorkbenchExample<
	typeof PageLayoutTopBarSideNavMainAsideExample
> = wb(PageLayoutTopBarSideNavMainAsideExample);
export const PageLayoutTopBarSideNavMainScrollable: WorkbenchExample<
	typeof PageLayoutTopBarSideNavMainScrollableExample
> = wb(PageLayoutTopBarSideNavMainScrollableExample);
export const PageLayoutTopBarSideNavMain: WorkbenchExample<
	typeof PageLayoutTopBarSideNavMainExample
> = wb(PageLayoutTopBarSideNavMainExample);
export const PageLayoutTopLayerDialogAsDirectChildVr: WorkbenchExample<
	typeof PageLayoutTopLayerDialogAsDirectChildVrExample
> = wb(PageLayoutTopLayerDialogAsDirectChildVrExample);
export const PageLayoutTopLayerPopoverAsDirectChildVr: WorkbenchExample<
	typeof PageLayoutTopLayerPopoverAsDirectChildVrExample
> = wb(PageLayoutTopLayerPopoverAsDirectChildVrExample);
export const PanelSplitterVr: WorkbenchExample<typeof PanelSplitterVrExample> =
	wb(PanelSplitterVrExample);
export const ResizableSlots: WorkbenchExample<typeof ResizableSlotsExample> =
	wb(ResizableSlotsExample);
export const RibbonWithoutSideNavVr: WorkbenchExample<typeof RibbonWithoutSideNavVrExample> = wb(
	RibbonWithoutSideNavVrExample,
);
export const RibbonVr: WorkbenchExample<typeof RibbonVrExample> = wb(RibbonVrExample);
export const SideNavFlyoutVr: WorkbenchExample<typeof SideNavFlyoutVrExample> =
	wb(SideNavFlyoutVrExample);
export const SideNavLayeringVr: WorkbenchExample<typeof SideNavLayeringVrExample> =
	wb(SideNavLayeringVrExample);
export const SideNavToggleButtonVr: WorkbenchExample<typeof SideNavToggleButtonVrExample> = wb(
	SideNavToggleButtonVrExample,
);
export const StandAloneIframe: WorkbenchExample<typeof StandAloneIframeExample> =
	wb(StandAloneIframeExample);
export const TopNavCustomProfileImageVr: WorkbenchExample<
	typeof TopNavCustomProfileImageVrExample
> = wb(TopNavCustomProfileImageVrExample);
export const TopNavSideNavCollapsedVr: WorkbenchExample<typeof TopNavSideNavCollapsedVrExample> =
	wb(TopNavSideNavCollapsedVrExample);
export const TopNavWithLongNameVr: WorkbenchExample<typeof TopNavWithLongNameVrExample> = wb(
	TopNavWithLongNameVrExample,
);
export const TopNavWithTempNavAppIconAppLogoVr: WorkbenchExample<
	typeof TopNavWithTempNavAppIconAppLogoVrExample
> = wb(TopNavWithTempNavAppIconAppLogoVrExample);
export const TopNavWithTempNavAppIconCustomLogo: WorkbenchExample<
	typeof TopNavWithTempNavAppIconCustomLogoExample
> = wb(TopNavWithTempNavAppIconCustomLogoExample);
export const TopNavigationAppLogoSecondaryNameVr: WorkbenchExample<
	typeof TopNavigationAppLogoSecondaryNameVrExample
> = wb(TopNavigationAppLogoSecondaryNameVrExample);
export const TopNavigationAppLogosVr: WorkbenchExample<typeof TopNavigationAppLogosVrExample> = wb(
	TopNavigationAppLogosVrExample,
);
export const TopNavigationCustomAppSwitcherVr: WorkbenchExample<
	typeof TopNavigationCustomAppSwitcherVrExample
> = wb(TopNavigationCustomAppSwitcherVrExample);
export const TopNavigationCustomLogoVr: WorkbenchExample<typeof TopNavigationCustomLogoVrExample> =
	wb(TopNavigationCustomLogoVrExample);
export const TopNavigationStressVr: WorkbenchExample<typeof TopNavigationStressVrExample> = wb(
	TopNavigationStressVrExample,
);
export const TopNavigationThemedButtonsVr: WorkbenchExample<
	typeof TopNavigationThemedButtonsVrExample
> = wb(TopNavigationThemedButtonsVrExample);
export const TopNavigationThemingLoggedOutVr: WorkbenchExample<
	typeof TopNavigationThemingLoggedOutVrExample
> = wb(TopNavigationThemingLoggedOutVrExample);
export const TopNavigationThemingWithPickerVr: WorkbenchExample<
	typeof TopNavigationThemingWithPickerVrExample
> = wb(TopNavigationThemingWithPickerVrExample);
export const TopNavigationThemingVr: WorkbenchExample<typeof TopNavigationThemingVrExample> = wb(
	TopNavigationThemingVrExample,
);
export const TopNavigationVr: WorkbenchExample<typeof TopNavigationVrExample> =
	wb(TopNavigationVrExample);
