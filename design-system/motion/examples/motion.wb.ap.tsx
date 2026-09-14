import { wb, type WorkbenchExample } from '@atlassian/workbench';

import CurvesExample from './curves';
import DurationsExample from './durations';
import FadeBetweenElementsExample from './fade-between-elements';
import FadeInAllExamplesExample from './fade-in-all-examples';
import FadeInGridOfElementsExample from './fade-in-grid-of-elements';
import FadeInListOfElementsExample from './fade-in-list-of-elements';
import FadeInSingleElementExample from './fade-in-single-element';
import FadeOutFixedListExample from './fade-out-fixed-list';
import FadeOutListOfElementsExample from './fade-out-list-of-elements';
import FadeOutSingleElementExample from './fade-out-single-element';
import MotionPrimitiveExample from './motion-primitive';
import MotionPrimitiveCustomExample from './motion-primitive-custom';
import MotionPrimitiveCustomKeyframeExample from './motion-primitive-custom-keyframe';
import MotionPrimitiveCustomWithDelayExample from './motion-primitive-custom-with-delay';
import MotionPrimitivePlaygroundExample from './motion-primitive-playground';
import ResizingExample from './resizing';
import ResizingHeightExample from './resizing-height';
import ShrinkOutExample from './shrink-out';
import SlideInExample from './slide-in';
import UseMotionExample from './use-motion';
import UseMotionCustomExample from './use-motion-custom';
import UseMotionCustomKeyframeExample from './use-motion-custom-keyframe';
import ZoomInExample from './zoom-in';

const Curves: WorkbenchExample = wb(CurvesExample);

export default Curves;
export const Durations: WorkbenchExample = wb(DurationsExample);
export const FadeBetweenElements: WorkbenchExample = wb(FadeBetweenElementsExample);
export const FadeInAllExamples: WorkbenchExample = wb(FadeInAllExamplesExample);
export const FadeInGridOfElements: WorkbenchExample = wb(FadeInGridOfElementsExample);
export const FadeInListOfElements: WorkbenchExample = wb(FadeInListOfElementsExample);
export const FadeInSingleElement: WorkbenchExample = wb(FadeInSingleElementExample);
export const FadeOutFixedList: WorkbenchExample = wb(FadeOutFixedListExample);
export const FadeOutListOfElements: WorkbenchExample = wb(FadeOutListOfElementsExample);
export const FadeOutSingleElement: WorkbenchExample = wb(FadeOutSingleElementExample);
export const MotionPrimitive: WorkbenchExample = wb(MotionPrimitiveExample);
export const MotionPrimitiveCustom: WorkbenchExample = wb(MotionPrimitiveCustomExample);
export const MotionPrimitiveCustomKeyframe: WorkbenchExample = wb(
	MotionPrimitiveCustomKeyframeExample,
);
export const MotionPrimitiveCustomWithDelay: WorkbenchExample = wb(
	MotionPrimitiveCustomWithDelayExample,
);
export const MotionPrimitivePlayground: WorkbenchExample = wb(MotionPrimitivePlaygroundExample);
export const Resizing: WorkbenchExample = wb(ResizingExample);
export const ResizingHeight: WorkbenchExample = wb(ResizingHeightExample);
export const ShrinkOut: WorkbenchExample = wb(ShrinkOutExample);
export const SlideIn: WorkbenchExample = wb(SlideInExample);
export const UseMotion: WorkbenchExample = wb(UseMotionExample);
export const UseMotionCustom: WorkbenchExample = wb(UseMotionCustomExample);
export const UseMotionCustomKeyframe: WorkbenchExample = wb(UseMotionCustomKeyframeExample);
export const ZoomIn: WorkbenchExample = wb(ZoomInExample);
