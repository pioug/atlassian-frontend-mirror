import { wb, type WorkbenchExample } from '@atlassian/workbench';

import DefaultModalVrExample from '../00-default-modal.vr.ap';
import ModalOverPopupExample from '../01-modal-over-popup';
import ExplicitFontStylesVrExample from '../02-explicit-font-styles.vr.ap';
import AppearanceVrExample from '../10-appearance.vr.ap';
import ContainerExample from '../14-container';
import CustomExample from '../15-custom';
import CompoundTitleExample from '../16-compound-title';
import AutofocusVrExample from '../20-autofocus.vr.ap';
import HeightVrExample from '../30-height.vr.ap';
import MultipleVrExample from '../40-multiple.vr.ap';
import FormVrExample from '../45-form.vr.ap';
import FormAsContainerVrExample from '../46-form-as-container.vr.ap';
import SelectExample from '../47-select';
import WidthVrExample from '../50-width.vr.ap';
import FullScreenVrExample from '../51-full-screen.vr.ap';
import ModalBodyWithoutInlinePaddingVrExample from '../53-modal-body-without-inline-padding.vr.ap';
import ScrollVrExample from '../55-scroll.vr.ap';
import ScrollHorizontalVrExample from '../56-scroll-horizontal.vr.ap';
import LabelExample from '../57-label';
import MultiLineTitlesVrExample from '../65-multi-line-titles.vr.ap';
import WithPopupSelectExample from '../70-with-popup-select';
import WithFooterAndSelectOptionVrExample from '../80-with-footer-and-select-option.vr.ap';
import WithASpotlightExample from '../85-with-a-spotlight';
import WithLayeredComponentsVrExample from '../90-with-layered-components.vr.ap';
import WithRapidlyChangingParentExample from '../91-with-rapidly-changing-parent';
import WithHiddenBlanketVrExample from '../92-with-hidden-blanket.vr.ap';
import MultiColumnVrExample from '../93-multi-column.vr.ap';
import CustomChildVrExample from '../95-custom-child.vr.ap';
import TopLayerScrollReproductionExample from '../95-top-layer-scroll-reproduction';
import WithCurrentSurfaceVrExample from '../96-with-current-surface.vr.ap';
import ChromelessExample from '../97-chromeless';
import ModalA11yBackgroundInertExample from '../97-modal-a11y-background-inert';
import AllowlistExample from '../98-allowlist';
import TestingInitialFocusMatrixExample from '../98-testing-initial-focus-matrix';
import OpenModalFromPopupExample from '../99-open-modal-from-popup';
import DeepSuspenseExample from '../100-deep-suspense';
import FullHeightIllustrationExample from '../101-full-height-illustration';
import ModalDisableMotionUpliftExample from '../102-modal-disable-motion-uplift';
import SsrInitialOpenVrExample from '../103-ssr-initial-open.vr.ap';
import DisableDraggingToCrossOriginIframesExample from '../disable-dragging-to-cross-origin-iframes';
import FocusToRefOnModalCloseExample from '../focus-to-ref-on-modal-close';
import OpenAuiFromPopupInModalExample from '../open-aui-from-popup-in-modal';
import PlaceholderContentExample from '../placeholder-content';

export const DefaultModal: WorkbenchExample<typeof DefaultModalVrExample> =
	wb(DefaultModalVrExample);

export const ModalOverPopup: WorkbenchExample<typeof ModalOverPopupExample> =
	wb(ModalOverPopupExample);
export const ExplicitFontStylesVr: WorkbenchExample<typeof ExplicitFontStylesVrExample> = wb(
	ExplicitFontStylesVrExample,
);
// Named "Appearance" to match the Workbench URL used by existing integration tests.
export const Appearance: WorkbenchExample<typeof AppearanceVrExample> = wb(AppearanceVrExample);
export const DeepSuspense: WorkbenchExample<typeof DeepSuspenseExample> = wb(DeepSuspenseExample);
export const FullHeightIllustration: WorkbenchExample<typeof FullHeightIllustrationExample> = wb(
	FullHeightIllustrationExample,
);
export const ModalDisableMotionUplift: WorkbenchExample<typeof ModalDisableMotionUpliftExample> =
	wb(ModalDisableMotionUpliftExample);
// Named "SsrInitialOpen" to match the Workbench URL used by existing integration tests.
export const SsrInitialOpen: WorkbenchExample<typeof SsrInitialOpenVrExample> =
	wb(SsrInitialOpenVrExample);
export const Container: WorkbenchExample<typeof ContainerExample> = wb(ContainerExample);
export const Custom: WorkbenchExample<typeof CustomExample> = wb(CustomExample);
export const CompoundTitle: WorkbenchExample<typeof CompoundTitleExample> =
	wb(CompoundTitleExample);
// Named "Autofocus" to match the Workbench URL used by existing integration tests.
export const Autofocus: WorkbenchExample<typeof AutofocusVrExample> = wb(AutofocusVrExample);
export const HeightVr: WorkbenchExample<typeof HeightVrExample> = wb(HeightVrExample);
// Named "Multiple" to match the Workbench URL used by existing integration tests.
export const Multiple: WorkbenchExample<typeof MultipleVrExample> = wb(MultipleVrExample);
export const FormVr: WorkbenchExample<typeof FormVrExample> = wb(FormVrExample);
export const FormAsContainerVr: WorkbenchExample<typeof FormAsContainerVrExample> =
	wb(FormAsContainerVrExample);
export const Select: WorkbenchExample<typeof SelectExample> = wb(SelectExample);
export const WidthVr: WorkbenchExample<typeof WidthVrExample> = wb(WidthVrExample);
export const FullScreenVr: WorkbenchExample<typeof FullScreenVrExample> = wb(FullScreenVrExample);
export const ModalBodyWithoutInlinePaddingVr: WorkbenchExample<
	typeof ModalBodyWithoutInlinePaddingVrExample
> = wb(ModalBodyWithoutInlinePaddingVrExample);
// Named "Scroll" to match the Workbench URL used by existing integration tests.
export const Scroll: WorkbenchExample<typeof ScrollVrExample> = wb(ScrollVrExample);
export const ScrollHorizontalVr: WorkbenchExample<typeof ScrollHorizontalVrExample> =
	wb(ScrollHorizontalVrExample);
export const Label: WorkbenchExample<typeof LabelExample> = wb(LabelExample);
export const MultiLineTitlesVr: WorkbenchExample<typeof MultiLineTitlesVrExample> =
	wb(MultiLineTitlesVrExample);
export const WithPopupSelect: WorkbenchExample<typeof WithPopupSelectExample> =
	wb(WithPopupSelectExample);
export const WithFooterAndSelectOptionVr: WorkbenchExample<
	typeof WithFooterAndSelectOptionVrExample
> = wb(WithFooterAndSelectOptionVrExample);
export const WithASpotlight: WorkbenchExample<typeof WithASpotlightExample> =
	wb(WithASpotlightExample);
export const WithLayeredComponentsVr: WorkbenchExample<typeof WithLayeredComponentsVrExample> = wb(
	WithLayeredComponentsVrExample,
);
export const WithRapidlyChangingParent: WorkbenchExample<typeof WithRapidlyChangingParentExample> =
	wb(WithRapidlyChangingParentExample);
export const WithHiddenBlanketVr: WorkbenchExample<typeof WithHiddenBlanketVrExample> = wb(
	WithHiddenBlanketVrExample,
);
export const MultiColumnVr: WorkbenchExample<typeof MultiColumnVrExample> =
	wb(MultiColumnVrExample);
// Named "CustomChild" to match the Workbench URL used by existing integration tests.
export const CustomChild: WorkbenchExample<typeof CustomChildVrExample> = wb(CustomChildVrExample);
export const TopLayerScrollReproduction: WorkbenchExample<
	typeof TopLayerScrollReproductionExample
> = wb(TopLayerScrollReproductionExample);
export const WithCurrentSurfaceVr: WorkbenchExample<typeof WithCurrentSurfaceVrExample> = wb(
	WithCurrentSurfaceVrExample,
);
export const Chromeless: WorkbenchExample<typeof ChromelessExample> = wb(ChromelessExample);
export const ModalA11yBackgroundInert: WorkbenchExample<typeof ModalA11yBackgroundInertExample> =
	wb(ModalA11yBackgroundInertExample);
export const Allowlist: WorkbenchExample<typeof AllowlistExample> = wb(AllowlistExample);
export const TestingInitialFocusMatrix: WorkbenchExample<typeof TestingInitialFocusMatrixExample> =
	wb(TestingInitialFocusMatrixExample);
export const OpenModalFromPopup: WorkbenchExample<typeof OpenModalFromPopupExample> =
	wb(OpenModalFromPopupExample);
export const DisableDraggingToCrossOriginIframes: WorkbenchExample<
	typeof DisableDraggingToCrossOriginIframesExample
> = wb(DisableDraggingToCrossOriginIframesExample);
export const FocusToRefOnModalClose: WorkbenchExample<typeof FocusToRefOnModalCloseExample> = wb(
	FocusToRefOnModalCloseExample,
);
export const OpenAuiFromPopupInModal: WorkbenchExample<typeof OpenAuiFromPopupInModalExample> = wb(
	OpenAuiFromPopupInModalExample,
);
export const PlaceholderContent: WorkbenchExample<typeof PlaceholderContentExample> =
	wb(PlaceholderContentExample);
