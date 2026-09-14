import { wb, type WorkbenchExample } from '@atlassian/workbench';

import DefaultVrExample from './01-default.vr.ap';
import PositioningExample from './02-positioning';
import OversizedContentExample from './03-oversized-content';
import SelectDatepickerExample from './04-select-datepicker';
import ScrollParentClippingExample from './05-scroll-parent-clipping';
import ModalExample from './06-modal';
import PopperPlacementsVrExample from './07-popper-placements.vr.ap';
import MultipleInlineDialogsExample from './08-multiple-inline-dialogs';
import PopupExample from './09-popup';
import TestingExample from './99-testing';
import TestingInitialFocusMatrixExample from './99-testing-initial-focus-matrix';

const DefaultVr: WorkbenchExample = wb(DefaultVrExample);

export default DefaultVr;
export const Positioning: WorkbenchExample = wb(PositioningExample);
export const OversizedContent: WorkbenchExample = wb(OversizedContentExample);
export const SelectDatepicker: WorkbenchExample = wb(SelectDatepickerExample);
export const ScrollParentClipping: WorkbenchExample = wb(ScrollParentClippingExample);
export const Modal: WorkbenchExample = wb(ModalExample);
export const PopperPlacementsVr: WorkbenchExample = wb(PopperPlacementsVrExample);
export const MultipleInlineDialogs: WorkbenchExample = wb(MultipleInlineDialogsExample);
export const Popup: WorkbenchExample = wb(PopupExample);
export const Testing: WorkbenchExample = wb(TestingExample);
export const TestingInitialFocusMatrix: WorkbenchExample = wb(TestingInitialFocusMatrixExample);
