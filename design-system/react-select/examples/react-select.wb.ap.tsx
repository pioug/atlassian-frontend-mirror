import { wb, type WorkbenchExample } from '@atlassian/workbench';

import SingleSelectExample from './00-single-select';
import MultiSelectExample from './01-multi-select';
import ValidationExample from './05-validation';
import AsyncSelectWithCallbackExample from './06-async-select-with-callback';
import AsyncSelectWithPromisesExample from './07-async-select-with-promises';
import AsyncCreatableSelectExample from './08-async-creatable-select';
import ElemBeforeMultiSelectExample from './09-elem-before-multi-select';
import CustomDropdownWithTagsExample from './10-custom-dropdown-with-tags';
import MenuPortalTopLayerVrExample from './30-menu-portal-top-layer.vr.ap';
import MenuPortalClippedAncestorVrExample from './31-menu-portal-clipped-ancestor.vr.ap';
import MenuPortalCustomTargetVrExample from './32-menu-portal-custom-target.vr.ap';
import MenuPositionFixedVrExample from './33-menu-position-fixed.vr.ap';
import MenuNoPortalConfigVrExample from './34-menu-no-portal-config.vr.ap';
import TestingMenuPortalInModalExample from './testing-menu-portal-in-modal';
import TestingMenuPortalOverflowExample from './testing-menu-portal-overflow';
import TestingTopLayerFocusExample from './testing-top-layer-focus';
import TestingTopLayerNestedPopoverExample from './testing-top-layer-nested-popover';

const SingleSelect: WorkbenchExample = wb(SingleSelectExample);

export default SingleSelect;
export const MultiSelect: WorkbenchExample = wb(MultiSelectExample);
export const Validation: WorkbenchExample = wb(ValidationExample);
export const AsyncSelectWithCallback: WorkbenchExample = wb(AsyncSelectWithCallbackExample);
export const AsyncSelectWithPromises: WorkbenchExample = wb(AsyncSelectWithPromisesExample);
export const AsyncCreatableSelect: WorkbenchExample = wb(AsyncCreatableSelectExample);
export const ElemBeforeMultiSelect: WorkbenchExample = wb(ElemBeforeMultiSelectExample);
export const CustomDropdownWithTags: WorkbenchExample = wb(CustomDropdownWithTagsExample);
export const MenuPortalTopLayerVr: WorkbenchExample = wb(MenuPortalTopLayerVrExample);
export const MenuPortalClippedAncestorVr: WorkbenchExample = wb(MenuPortalClippedAncestorVrExample);
export const MenuPortalCustomTargetVr: WorkbenchExample = wb(MenuPortalCustomTargetVrExample);
export const MenuPositionFixedVr: WorkbenchExample = wb(MenuPositionFixedVrExample);
export const MenuNoPortalConfigVr: WorkbenchExample = wb(MenuNoPortalConfigVrExample);
export const TestingMenuPortalInModal: WorkbenchExample = wb(TestingMenuPortalInModalExample);
export const TestingMenuPortalOverflow: WorkbenchExample = wb(TestingMenuPortalOverflowExample);
export const TestingTopLayerFocus: WorkbenchExample = wb(TestingTopLayerFocusExample);
export const TestingTopLayerNestedPopover: WorkbenchExample = wb(
	TestingTopLayerNestedPopoverExample,
);
