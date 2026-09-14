import { wb, type WorkbenchExample } from '@atlassian/workbench';

import BasicVrExample from './0-basic.vr.ap';
import TruncationExample from './1-truncation';
import BaselineAlignmentVrExample from './2-baseline-alignment.vr.ap';
import CustomColorVrExample from './3-custom-color.vr.ap';
import WidthHandlingVrExample from './5-width-handling.vr.ap';
import ContainersVrExample from './6-containers.vr.ap';
import NewLozengeVrExample from './7-new-lozenge.vr.ap';
import LozengeDropdownTriggerVrExample from './8-lozenge-dropdown-trigger.vr.ap';
import NewEntrypointExample from './9-new-entrypoint';
import TestingExample from './99-testing';

const BasicVr: WorkbenchExample = wb(BasicVrExample);

export default BasicVr;
export const Truncation: WorkbenchExample = wb(TruncationExample);
export const BaselineAlignmentVr: WorkbenchExample = wb(BaselineAlignmentVrExample);
export const CustomColorVr: WorkbenchExample = wb(CustomColorVrExample);
export const WidthHandlingVr: WorkbenchExample = wb(WidthHandlingVrExample);
export const ContainersVr: WorkbenchExample = wb(ContainersVrExample);
export const NewLozengeVr: WorkbenchExample = wb(NewLozengeVrExample);
export const LozengeDropdownTriggerVr: WorkbenchExample = wb(LozengeDropdownTriggerVrExample);
export const NewEntrypoint: WorkbenchExample = wb(NewEntrypointExample);
export const Testing: WorkbenchExample = wb(TestingExample);
