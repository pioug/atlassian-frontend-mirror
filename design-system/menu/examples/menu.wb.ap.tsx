import { wb, type WorkbenchExample } from '@atlassian/workbench';

import ItemVariationsExample from './00-item-variations';
import MenuGroupVrExample from './05-menu-group.vr.ap';
import SkeletonItemsVrExample from './06-skeleton-items.vr.ap';
import ButtonItemVrExample from './button-item.vr.ap';
import CustomItemVrExample from './custom-item.vr.ap';
import GrowingMenuExample from './growing-menu';
import HeadingItemExample from './heading-item';
import IconSizingVrExample from './icon-sizing.vr.ap';
import LinkItemVrExample from './link-item.vr.ap';
import LoadingSkeletonExample from './loading-skeleton';
import MenuExample from './menu';
import MenuWithoutHeadingExample from './menu-without-heading';
import OverridingStylesExample from './overriding-styles';
import ScrollableMenuExample from './scrollable-menu';
import ScrollableSectionsExample from './scrollable-sections';
import SectionWithHeadingExample from './section-with-heading';
import SelectionStatesVrExample from './selection-states.vr.ap';
import SkeletonHeadingItemExample from './skeleton-heading-item';
import SkeletonItemExample from './skeleton-item';

const ItemVariations: WorkbenchExample = wb(ItemVariationsExample);

export default ItemVariations;
// Named "MenuGroup" to match the Workbench URL used by existing integration tests.
export const MenuGroup: WorkbenchExample = wb(MenuGroupVrExample);
// Named "SkeletonItems" to match the Workbench URL used by existing integration tests.
export const SkeletonItems: WorkbenchExample = wb(SkeletonItemsVrExample);
// Named "ButtonItem" to match the Workbench URL used by existing integration tests.
export const ButtonItem: WorkbenchExample = wb(ButtonItemVrExample);
// Named "CustomItem" to match the Workbench URL used by existing integration tests.
export const CustomItem: WorkbenchExample = wb(CustomItemVrExample);
export const GrowingMenu: WorkbenchExample = wb(GrowingMenuExample);
export const HeadingItem: WorkbenchExample = wb(HeadingItemExample);
export const IconSizingVr: WorkbenchExample = wb(IconSizingVrExample);
// Named "LinkItem" to match the Workbench URL used by existing integration tests.
export const LinkItem: WorkbenchExample = wb(LinkItemVrExample);
export const LoadingSkeleton: WorkbenchExample = wb(LoadingSkeletonExample);
export const Menu: WorkbenchExample = wb(MenuExample);
export const MenuWithoutHeading: WorkbenchExample = wb(MenuWithoutHeadingExample);
export const OverridingStyles: WorkbenchExample = wb(OverridingStylesExample);
export const ScrollableMenu: WorkbenchExample = wb(ScrollableMenuExample);
export const ScrollableSections: WorkbenchExample = wb(ScrollableSectionsExample);
export const SectionWithHeading: WorkbenchExample = wb(SectionWithHeadingExample);
// Named "SelectionStates" to match the Workbench URL used by existing integration tests.
export const SelectionStates: WorkbenchExample = wb(SelectionStatesVrExample);
export const SkeletonHeadingItem: WorkbenchExample = wb(SkeletonHeadingItemExample);
export const SkeletonItem: WorkbenchExample = wb(SkeletonItemExample);
