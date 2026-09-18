import { wb, type WorkbenchExample } from '@atlassian/workbench';

import { default as BasicExample } from './01-basic';
import { default as BasicThreeSectionsExample } from './02-basic-three-sections';
import { default as BasicAnyNumberSectionsExample } from './03-basic-any-number-sections';
import { default as BasicSectionBelowViewportExample } from './03-basic-section-below-viewport';
import { default as BasicSectionBelowViewportWithHoldExample } from './03-basic-section-below-viewport-with-hold';
import { default as BasicSectionUnmountExample } from './03-basic-section-unmount';
import { default as BasicSsrTimingSectionsExample } from './03-basic-ssr-timing-sections';
import { default as BasicWithCustomCohortDataExample } from './03-basic-with-custom-cohort-data';
import { default as BasicWithCustomDataExample } from './03-basic-with-custom-data';
import { default as FullHorizontalPixelPageExample } from './03-full-horizontal-pixel-page';
import { default as FullVerticalPixelPageExample } from './03-full-vertical-pixel-page';
import { default as BoxInBoxExample } from './04-box-in-box';
import { default as NestedElementsExample } from './05-nested-elements';
import { default as MovingNodeExample } from './06-moving-node';
import { default as BadNodeReplacementExample } from './08-bad-node-replacement';
import { default as NodeReplacementExample } from './08-node-replacement';
import { default as SameAttributeValueMutationExample } from './09-same-attribute-value-mutation';
import { default as Fy2502StyleMutationExample } from './10-fy25_02-style-mutation';
import { default as NonVisualStyleMutationExample } from './11-non-visual-style-mutation';
import { default as MediaWrapperExample } from './12-media-wrapper';
import { default as ClassAttributeMutationExample } from './13-class-attribute-mutation';
import { default as BasicThreeSectionsWithButtonExample } from './14-basic-three-sections-with-button';
import { default as BasicWithErrorExample } from './15-basic-with-error';
import { default as BasicWithChangedTimeoutExample } from './16-basic-with-changed-timeout';
import { default as BasicWithTransitionExample } from './17-basic-with-transition';
import { default as CpuIntensivePageExample } from './18-cpu-intensive-page';
import { default as MemoryLeakExample } from './19-memory-leak';
import { default as BasicWithBlindspotExample } from './20-basic-with-blindspot';
import { default as AppWithTopLeftNavExample } from './21-app-with-top-left-nav';
import { default as LoadHoldInteractionIdTrackingExample } from './21-load-hold-interaction-id-tracking';
import { default as RllSimulationExample } from './22-rll-simulation';
import { default as InteractionsSimpleButtonExample } from './23-interactions-simple-button';
import { default as ThirdPartySegmentExample } from './24-third-party-segment';
import { default as ThirdPartySegmentAbortHoldExample } from './24-third-party-segment-abort-hold';
import { default as ThirdPartySegmentDangerousHtmlExample } from './24-third-party-segment-dangerous-html';
import { default as ThirdPartySegmentIframeExample } from './24-third-party-segment-iframe';
import { default as VcNoLayoutShiftExample } from './25-vc-no-layout-shift';
import { default as VcNoLayoutShiftFalseExample } from './25-vc-no-layout-shift_false';
import { default as SsrPlaceholderV3Example } from './26-ssr-placeholder-v3';
import { default as MultipleSegmentsSameNameExample } from './30-multiple-segments-same-name';
import { default as MultipleSegmentsLabelstackTreeExample } from './31-multiple-segments-labelstack-tree';
import { default as CssDisplayContentsExample } from './32-css-display-contents';
import { default as BasicWith3SectionsButtonMinorInteractionsOverrideExample } from './33-basic-with-3-sections-button-minor-interactions-override';
import { default as BasicWithLateHoldExample } from './34-basic-with-late-hold';
import { default as FinishInteractionTransitionExample } from './34-finish-interaction-transition';
import { default as SearchPageWithoutSmartAnswersExample } from './34-search-page-without-smart-answers';
import { default as SearchPageWithSlowerSmartAnswersExample } from './35-search-page-with-slower-smart-answers';
import { default as SearchPageWithSlowerSmartAnswersClassChangeExample } from './35-search-page-with-slower-smart-answers-class-change';
import { default as SearchPageWithFasterSmartAnswersExample } from './36-search-page-with-faster-smart-answers';
import { default as PoorlyPerformingComponentsExample } from './37-poorly-performing-components';
import { default as ThirdPartySegmentLongHoldExample } from './37-third-party-segment-long-hold';
import { default as BasicWithTerminalErrorExample } from './38-basic-with-terminal-error';
import { default as FrameworkRoutingDisplayNoneExample } from './38-framework-routing-display-none';
import { default as LayoutShiftCausation1NewComponentAboveExample } from './39-1-layout-shift-causation-new-component-above';
import { default as LayoutShiftCausation2NewComponentSideExample } from './39-2-layout-shift-causation-new-component-side';
import { default as LayoutShiftCausation3NewTwoComponentsTopSideExample } from './39-3-layout-shift-causation-new-two-components-top-side';
import { default as LayoutShiftCausation4ManyComponentsExample } from './39-4-layout-shift-causation-many-components';
import { default as ThirdPartySegmentTimingsExample } from './40-third-party-segment-timings';
import { default as GenAiSegmentExample } from './41-gen-ai-segment';

export const Basic: WorkbenchExample = wb(BasicExample);
export const BasicThreeSections: WorkbenchExample = wb(BasicThreeSectionsExample);
export const BasicAnyNumberSections: WorkbenchExample = wb(BasicAnyNumberSectionsExample);
export const BasicSectionBelowViewportWithHold: WorkbenchExample = wb(
	BasicSectionBelowViewportWithHoldExample,
);
export const BasicSectionBelowViewport: WorkbenchExample = wb(BasicSectionBelowViewportExample);
export const BasicSectionUnmount: WorkbenchExample = wb(BasicSectionUnmountExample);
export const BasicSsrTimingSections: WorkbenchExample = wb(BasicSsrTimingSectionsExample);
export const BasicWithCustomCohortData: WorkbenchExample = wb(BasicWithCustomCohortDataExample);
export const BasicWithCustomData: WorkbenchExample = wb(BasicWithCustomDataExample);
export const FullHorizontalPixelPage: WorkbenchExample = wb(FullHorizontalPixelPageExample);
export const FullVerticalPixelPage: WorkbenchExample = wb(FullVerticalPixelPageExample);
export const BoxInBox: WorkbenchExample = wb(BoxInBoxExample);
export const NestedElements: WorkbenchExample = wb(NestedElementsExample);
export const MovingNode: WorkbenchExample = wb(MovingNodeExample);
export const BadNodeReplacement: WorkbenchExample = wb(BadNodeReplacementExample);
export const NodeReplacement: WorkbenchExample = wb(NodeReplacementExample);
export const SameAttributeValueMutation: WorkbenchExample = wb(SameAttributeValueMutationExample);
export const Fy2502StyleMutation: WorkbenchExample = wb(Fy2502StyleMutationExample);
export const NonVisualStyleMutation: WorkbenchExample = wb(NonVisualStyleMutationExample);
export const MediaWrapper: WorkbenchExample = wb(MediaWrapperExample);
export const ClassAttributeMutation: WorkbenchExample = wb(ClassAttributeMutationExample);
export const BasicThreeSectionsWithButton: WorkbenchExample = wb(
	BasicThreeSectionsWithButtonExample,
);
export const BasicWithError: WorkbenchExample = wb(BasicWithErrorExample);
export const BasicWithChangedTimeout: WorkbenchExample = wb(BasicWithChangedTimeoutExample);
export const BasicWithTransition: WorkbenchExample = wb(BasicWithTransitionExample);
export const CpuIntensivePage: WorkbenchExample = wb(CpuIntensivePageExample);
export const MemoryLeak: WorkbenchExample = wb(MemoryLeakExample);
export const BasicWithBlindspot: WorkbenchExample = wb(BasicWithBlindspotExample);
export const AppWithTopLeftNav: WorkbenchExample = wb(AppWithTopLeftNavExample);
export const LoadHoldInteractionIdTracking: WorkbenchExample = wb(
	LoadHoldInteractionIdTrackingExample,
);
export const RllSimulation: WorkbenchExample = wb(RllSimulationExample);
export const InteractionsSimpleButton: WorkbenchExample = wb(InteractionsSimpleButtonExample);
export const ThirdPartySegmentAbortHold: WorkbenchExample = wb(ThirdPartySegmentAbortHoldExample);
export const ThirdPartySegmentDangerousHtml: WorkbenchExample = wb(
	ThirdPartySegmentDangerousHtmlExample,
);
export const ThirdPartySegmentIframe: WorkbenchExample = wb(ThirdPartySegmentIframeExample);
export const ThirdPartySegment: WorkbenchExample = wb(ThirdPartySegmentExample);
export const VcNoLayoutShift: WorkbenchExample = wb(VcNoLayoutShiftExample);
export const VcNoLayoutShiftFalse: WorkbenchExample = wb(VcNoLayoutShiftFalseExample);
export const SsrPlaceholderV3: WorkbenchExample = wb(SsrPlaceholderV3Example);
export const MultipleSegmentsSameName: WorkbenchExample = wb(MultipleSegmentsSameNameExample);
export const MultipleSegmentsLabelstackTree: WorkbenchExample = wb(
	MultipleSegmentsLabelstackTreeExample,
);
export const CssDisplayContents: WorkbenchExample = wb(CssDisplayContentsExample);
export const BasicWith3SectionsButtonMinorInteractionsOverride: WorkbenchExample = wb(
	BasicWith3SectionsButtonMinorInteractionsOverrideExample,
);
export const BasicWithLateHold: WorkbenchExample = wb(BasicWithLateHoldExample);
export const FinishInteractionTransition: WorkbenchExample = wb(FinishInteractionTransitionExample);
export const SearchPageWithoutSmartAnswers: WorkbenchExample = wb(
	SearchPageWithoutSmartAnswersExample,
);
export const SearchPageWithSlowerSmartAnswersClassChange: WorkbenchExample = wb(
	SearchPageWithSlowerSmartAnswersClassChangeExample,
);
export const SearchPageWithSlowerSmartAnswers: WorkbenchExample = wb(
	SearchPageWithSlowerSmartAnswersExample,
);
export const SearchPageWithFasterSmartAnswers: WorkbenchExample = wb(
	SearchPageWithFasterSmartAnswersExample,
);
export const PoorlyPerformingComponents: WorkbenchExample = wb(PoorlyPerformingComponentsExample);
export const ThirdPartySegmentLongHold: WorkbenchExample = wb(ThirdPartySegmentLongHoldExample);
export const BasicWithTerminalError: WorkbenchExample = wb(BasicWithTerminalErrorExample);
export const FrameworkRoutingDisplayNone: WorkbenchExample = wb(FrameworkRoutingDisplayNoneExample);
export const LayoutShiftCausation1NewComponentAbove: WorkbenchExample = wb(
	LayoutShiftCausation1NewComponentAboveExample,
);
export const LayoutShiftCausation2NewComponentSide: WorkbenchExample = wb(
	LayoutShiftCausation2NewComponentSideExample,
);
export const LayoutShiftCausation3NewTwoComponentsTopSide: WorkbenchExample = wb(
	LayoutShiftCausation3NewTwoComponentsTopSideExample,
);
export const LayoutShiftCausation4ManyComponents: WorkbenchExample = wb(
	LayoutShiftCausation4ManyComponentsExample,
);
export const ThirdPartySegmentTimings: WorkbenchExample = wb(ThirdPartySegmentTimingsExample);
export const GenAiSegment: WorkbenchExample = wb(GenAiSegmentExample);
