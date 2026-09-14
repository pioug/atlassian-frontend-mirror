import { wb, type WorkbenchExample } from '@atlassian/workbench';

import BasicExample from './basic';
import EmojisVrExample from './emojis.vr.ap';
import SkeletonVrExample from './skeleton.vr.ap';
import TestingFlexVrExample from './testing-flex.vr.ap';
import VariationsVrExample from './variations.vr.ap';

const Basic: WorkbenchExample = wb(BasicExample);

export default Basic;
export const EmojisVr: WorkbenchExample = wb(EmojisVrExample);
export const SkeletonVr: WorkbenchExample = wb(SkeletonVrExample);
export const TestingFlexVr: WorkbenchExample = wb(TestingFlexVrExample);
export const VariationsVr: WorkbenchExample = wb(VariationsVrExample);
