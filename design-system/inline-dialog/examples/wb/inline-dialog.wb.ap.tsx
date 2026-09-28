import { wb, type WorkbenchExample } from '@atlassian/workbench';

import DefaultVrExample from '../01-default.vr.ap';
import PositioningExample from '../02-positioning';
import OversizedContentExample from '../03-oversized-content';
import SelectDatepickerExample from '../04-select-datepicker';
import ScrollParentClippingExample from '../05-scroll-parent-clipping';
import ModalExample from '../06-modal';
import PopperPlacementsVrExample from '../07-popper-placements.vr.ap';
import MultipleInlineDialogsExample from '../08-multiple-inline-dialogs';
import PopupExample from '../09-popup';
import TestingExample from '../99-testing';
import TestingInitialFocusMatrixExample from '../99-testing-initial-focus-matrix';

export const DefaultVr: WorkbenchExample<typeof DefaultVrExample> = wb(DefaultVrExample);

export const Positioning: WorkbenchExample<typeof PositioningExample> = wb(PositioningExample);
export const OversizedContent: WorkbenchExample<typeof OversizedContentExample> =
	wb(OversizedContentExample);
export const SelectDatepicker: WorkbenchExample<typeof SelectDatepickerExample> =
	wb(SelectDatepickerExample);
export const ScrollParentClipping: WorkbenchExample<typeof ScrollParentClippingExample> = wb(
	ScrollParentClippingExample,
);
export const Modal: WorkbenchExample<typeof ModalExample> = wb(ModalExample);
export const PopperPlacementsVr: WorkbenchExample<typeof PopperPlacementsVrExample> =
	wb(PopperPlacementsVrExample);
export const MultipleInlineDialogs: WorkbenchExample<typeof MultipleInlineDialogsExample> = wb(
	MultipleInlineDialogsExample,
);
export const Popup: WorkbenchExample<typeof PopupExample> = wb(PopupExample);
export const Testing: WorkbenchExample<typeof TestingExample> = wb(TestingExample);
export const TestingInitialFocusMatrix: WorkbenchExample<typeof TestingInitialFocusMatrixExample> =
	wb(TestingInitialFocusMatrixExample);
