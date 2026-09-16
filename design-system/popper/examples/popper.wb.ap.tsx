import { wb, type WorkbenchExample } from '@atlassian/workbench';

import BasicPositioningVrExample from './00-basic-positioning.vr.ap';
import ScrollContainerExample from './01-scroll-container';
import AdvancedBehaviorsVrExample from './02-advanced-behaviors.vr.ap';
import MaxSizeVrExample from './03-max-size.vr.ap';
import FlagReferenceHiddenExample from './04-flag-reference-hidden';
import FlagReferenceVisibleExample from './05-flag-reference-visible';
import FlagFitViewportRightVrExample from './06-flag-fit-viewport-right.vr.ap';
import FlagPopperEscapedExample from './08-flag-popper-escaped';
import FlagVirtualElementExample from './09-flag-virtual-element';
import FlagAnchorToggleExample from './10-flag-anchor-toggle';
import FlagTopLayerEscapeExample from './11-flag-top-layer-escape';
import FlagImperativeCreatePopperVrExample from './12-flag-imperative-create-popper.vr.ap';
import FlagClippedAnchorExample from './13-flag-clipped-anchor';

const BasicPositioningVr: WorkbenchExample = wb(BasicPositioningVrExample);

export default BasicPositioningVr;
export const ScrollContainer: WorkbenchExample = wb(ScrollContainerExample);
export const AdvancedBehaviorsVr: WorkbenchExample = wb(AdvancedBehaviorsVrExample);
export const MaxSizeVr: WorkbenchExample = wb(MaxSizeVrExample);
export const FlagReferenceHidden: WorkbenchExample = wb(FlagReferenceHiddenExample);
export const FlagReferenceVisible: WorkbenchExample = wb(FlagReferenceVisibleExample);
export const FlagFitViewportRightVr: WorkbenchExample = wb(FlagFitViewportRightVrExample);
export const FlagPopperEscaped: WorkbenchExample = wb(FlagPopperEscapedExample);
export const FlagVirtualElement: WorkbenchExample = wb(FlagVirtualElementExample);
export const FlagAnchorToggle: WorkbenchExample = wb(FlagAnchorToggleExample);
export const FlagTopLayerEscape: WorkbenchExample = wb(FlagTopLayerEscapeExample);
export const FlagImperativeCreatePopperVr: WorkbenchExample = wb(
	FlagImperativeCreatePopperVrExample,
);
export const FlagClippedAnchor: WorkbenchExample = wb(FlagClippedAnchorExample);
